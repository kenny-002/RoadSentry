'use client';

import React, { useState } from 'react';
import { Road } from '../data/mockData';
import { useAppState } from '../context/StateContext';
import { Search, AlertTriangle, Filter, RefreshCw, Compass, Info } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import of RealMap with client-only loading fallback
const RealMap = dynamic(() => import('./RealMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/20 text-slate-400 rounded-xl border border-card-border">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-xs font-semibold">Initializing Geographic Engine...</span>
      </div>
    </div>
  )
});

// Robust fetch with abort timeout to prevent hanging on local/offline networks
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 2500): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

interface RoadMapProps {
  onSelectRoad: (road: Road) => void;
  selectedRoadId?: string;
}

export default function RoadMap({ onSelectRoad, selectedRoadId }: RoadMapProps) {
  const { roads, addMultipleRoads } = useAppState();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [conditionFilter, setConditionFilter] = useState<string>('All');

  // OSM loading states
  const [isLoadingRoads, setIsLoadingRoads] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [mapBounds, setMapBounds] = useState<any>(null);

  // Filtered Roads
  const filteredRoads = React.useMemo(() => {
    return roads.filter(road => {
      const matchesSearch = road.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || road.type === typeFilter;
      const matchesCondition = conditionFilter === 'All' || road.condition === conditionFilter;
      return matchesSearch && matchesType && matchesCondition;
    });
  }, [roads, search, typeFilter, conditionFilter]);

  // Overpass API fetch for bounding box
  const fetchLocalRoads = async (bounds: any) => {
    const latSpan = Math.abs(bounds.getNorth() - bounds.getSouth());
    const lngSpan = Math.abs(bounds.getEast() - bounds.getWest());

    // Only query if the viewport bounds aren't too large (prevents massive country-level queries)
    if (latSpan > 0.35 || lngSpan > 0.35) {
      return;
    }

    setIsLoadingRoads(true);
    try {
      const west = bounds.getWest();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const north = bounds.getNorth();

      // Determine highway query filter based on zoom depth (bounds span)
      // When zoomed out, fetch major arterials only; when zoomed in closely, fetch all street lanes
      const queryType = (latSpan > 0.08 || lngSpan > 0.08)
        ? 'motorway|trunk|primary|secondary'
        : 'motorway|trunk|primary|secondary|tertiary|residential|service|unclassified';

      const query = `[out:json][timeout:15];(way["highway"~"${queryType}"](${south},${west},${north},${east}););out geom;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const res = await fetchWithTimeout(url, {}, 3000);
      if (!res.ok) throw new Error('Overpass query failed');
      const data = await res.json();
      
      if (data.elements && data.elements.length > 0) {
        const newRoads: Road[] = data.elements
          .filter((el: any) => el.type === 'way' && el.geometry && el.geometry.length >= 2)
          .map((el: any) => {
            const tags = el.tags || {};
            const name = tags.name || tags.ref || `Local Street (${tags.highway || 'unclassified'})`;
            const highway = tags.highway || 'residential';
            
            let roadType: Road['type'] = 'Local Road';
            if (highway === 'motorway' || highway === 'trunk') roadType = 'NH';
            else if (highway === 'primary' || highway === 'secondary') roadType = 'SH';
            else if (highway === 'tertiary') roadType = 'MDR';

            const hash = el.id;
            const condition: Road['condition'] = 
              hash % 5 === 0 ? 'Critical' : 
              hash % 4 === 0 ? 'Damaged' : 
              hash % 3 === 0 ? 'Moderate' : 'Good';
              
            const contractorId = `contractor-${(hash % 5) + 1}`;
            const sanctionedAmount = (hash % 12 + 4) * 80;
            const spentAmount = (hash % 12 + 4) * 78 + (hash % 3 === 0 ? 30 : -15);
            const lastRelayingDate = `2024-${String((hash % 11) + 1).padStart(2, '0')}-${String((hash % 28) + 1).padStart(2, '0')}`;
            const lengthKm = Number(((el.geometry.length * 0.015) + 0.1).toFixed(2));
            const coordinates: [number, number][] = el.geometry.map((pt: any) => [pt.lat, pt.lon]);

            return {
              id: `osm-way-${el.id}`,
              name,
              type: roadType,
              condition,
              contractorId,
              sanctionedAmount,
              spentAmount,
              lastRelayingDate,
              lengthKm,
              svgPath: '',
              textCoords: { x: 0, y: 0 },
              coordinates
            };
          });

        addMultipleRoads(newRoads);
      }
    } catch (err) {
      console.error('Failed to load local roads:', err);
    } finally {
      setIsLoadingRoads(false);
    }
  };

  // Debounced bounding box fetch
  React.useEffect(() => {
    if (mapBounds) {
      const delayDebounce = setTimeout(() => {
        fetchLocalRoads(mapBounds);
      }, 600);
      return () => clearTimeout(delayDebounce);
    }
  }, [mapBounds]);

  // Nominatim Search Submit for Roads (e.g. NH44)
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let query = search.trim();
    if (query.length < 2) return;

    // Auto-normalize NS corridor / typo to NH for Indian highways (e.g. NS 44 -> NH 44)
    if (/^ns\s*\d+/i.test(query)) {
      query = query.replace(/ns/i, 'NH');
    }
    
    // Check local matches first
    const localMatches = roads.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
    if (localMatches.length > 0) {
      onSelectRoad(localMatches[0]);
      setSearchError('');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', India')}&format=json&polygon_geojson=1&limit=3`;
      const res = await fetchWithTimeout(url, {
        headers: {
          'User-Agent': 'RoadWatch-App/1.0'
        }
      }, 3000);
      if (!res.ok) throw new Error('Nominatim query failed');
      const data = await res.json();

      if (data && data.length > 0) {
        // Prioritize LineString/MultiLineString roads, but fallback to place points/polygons
        const roadResult = data.find((r: any) => 
          r.geojson && (r.geojson.type === 'LineString' || r.geojson.type === 'MultiLineString')
        ) || data[0];

        const name = roadResult.display_name.split(',')[0] || query;
        const lat = parseFloat(roadResult.lat);
        const lon = parseFloat(roadResult.lon);
        const osmId = roadResult.osm_id || Math.floor(Math.random() * 1000000);
        
        // Detect if the result is a general place/boundary rather than a specific road way
        const isPlace = roadResult.class === 'place' || roadResult.class === 'boundary' || roadResult.type === 'administrative' || roadResult.addresstype === 'city' || roadResult.addresstype === 'district';

        let coordinates: [number, number][] = [];
        if (!isPlace && roadResult.geojson && roadResult.geojson.type === 'LineString') {
          coordinates = roadResult.geojson.coordinates.map((pt: any) => [pt[1], pt[0]]);
        } else if (!isPlace && roadResult.geojson && roadResult.geojson.type === 'MultiLineString') {
          coordinates = roadResult.geojson.coordinates[0].map((pt: any) => [pt[1], pt[0]]);
        } else if (!isPlace && roadResult.geojson && roadResult.geojson.type === 'Polygon') {
          coordinates = roadResult.geojson.coordinates[0].map((pt: any) => [pt[1], pt[0]]);
        } else {
          // If it is a city/district/place, we create a small 1km polyline line centered on its coordinates
          // This serves as an anchor for map.fitBounds to pan and zoom to the city center and trigger Overpass
          coordinates = [
            [lat - 0.005, lon - 0.005],
            [lat, lon],
            [lat + 0.005, lon + 0.005]
          ];
        }

        const roadType: Road['type'] = query.toUpperCase().includes('NH') ? 'NH' : query.toUpperCase().includes('SH') ? 'SH' : query.toUpperCase().includes('MDR') ? 'MDR' : 'Local Road';

        const hash = osmId;
        const condition: Road['condition'] = 
          hash % 5 === 0 ? 'Critical' : 
          hash % 4 === 0 ? 'Damaged' : 
          hash % 3 === 0 ? 'Moderate' : 'Good';
          
        const contractorId = `contractor-${(hash % 5) + 1}`;
        const sanctionedAmount = (hash % 12 + 4) * 80;
        const spentAmount = (hash % 12 + 4) * 78 + (hash % 3 === 0 ? 30 : -15);
        const lastRelayingDate = `2024-${String((hash % 11) + 1).padStart(2, '0')}-${String((hash % 28) + 1).padStart(2, '0')}`;
        const lengthKm = Number(((coordinates.length * 0.015) + 0.1).toFixed(2));

        const newRoad: Road = {
          id: `osm-way-${osmId}`,
          name: isPlace ? `${name.toUpperCase()} (CITY CENTER)` : name.toUpperCase(),
          type: roadType,
          condition,
          contractorId,
          sanctionedAmount,
          spentAmount,
          lastRelayingDate,
          lengthKm,
          svgPath: '',
          textCoords: { x: 0, y: 0 },
          coordinates
        };

        addMultipleRoads([newRoad]);
        onSelectRoad(newRoad);
        setSearchError('');
      } else {
        setSearchError(`Could not find road coordinates for "${query}". Try refining your search (e.g. NH44, Madurai).`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Error contacting geolocation server. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetFilters = React.useCallback(() => {
    setSearch('');
    setTypeFilter('All');
    setConditionFilter('All');
    setSearchError('');
  }, []);

  const handleMapBoundsChange = React.useCallback((bounds: any) => {
    setMapBounds(bounds);
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      
      {/* Search & Filter Panel */}
      <div className="xl:col-span-1 glass-panel p-5 flex flex-col gap-5 bg-opacity-50 dark:bg-opacity-35">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-500" />
            <span>Map Filters</span>
          </h3>
          {(search || typeFilter !== 'All' || conditionFilter !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 active:scale-95 transition-transform"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search (e.g. NH44, Anna Salai)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (searchError) setSearchError('');
            }}
            className="w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-navy-700 bg-white/70 dark:bg-navy-950/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent text-slate-800 dark:text-white"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="absolute right-3 top-2.5 text-slate-450 dark:text-slate-500 hover:text-blue-500 active:scale-95 transition-transform"
          >
            {isSearching ? (
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>
        </form>

        {searchError && (
          <p className="text-[10px] text-red-500 font-bold bg-red-500/10 border border-red-500/20 p-2 rounded-md flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>{searchError}</span>
          </p>
        )}

        {/* Zoom reminder */}
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-navy-950 p-2.5 rounded-lg border border-slate-200/50 dark:border-navy-850 flex items-start gap-1.5 leading-relaxed">
          <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
          <span>Zoom in closely (street level) to automatically stream local streets and connecting lanes onto the map.</span>
        </div>

        {/* Road Type Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Road Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-navy-700 bg-white/70 dark:bg-navy-950/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-805 dark:text-white dark:bg-navy-950"
          >
            <option value="All">All Types</option>
            <option value="NH">National Highways (NH)</option>
            <option value="SH">State Highways (SH)</option>
            <option value="MDR">Major District Roads (MDR)</option>
            <option value="Local Road">Local Roads</option>
          </select>
        </div>

        {/* Road Condition Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Road Condition</label>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-navy-700 bg-white/70 dark:bg-navy-950/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-805 dark:text-white dark:bg-navy-950"
          >
            <option value="All">All Conditions</option>
            <option value="Good">Good (Green)</option>
            <option value="Moderate">Moderate (Yellow)</option>
            <option value="Damaged">Damaged (Orange)</option>
            <option value="Critical">Critical (Red)</option>
          </select>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-slate-200 dark:border-navy-800/80 space-y-2.5">
          <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Condition Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-650 dark:text-slate-300">Good</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="text-slate-655 dark:text-slate-300">Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
              <span className="text-slate-655 dark:text-slate-300">Damaged</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="text-slate-655 dark:text-slate-300">Critical</span>
            </div>
          </div>
        </div>

        {/* Stat summaries */}
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-navy-800/80 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-550 dark:text-slate-400">Filtered Roads:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{filteredRoads.length} / {roads.length}</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-550 dark:text-slate-400">Critical Segments:</span>
            <span className="font-bold text-red-500">{roads.filter(r => r.condition === 'Critical').length}</span>
          </div>
        </div>

      </div>

      {/* Map Interactive Canvas */}
      <div className="xl:col-span-3 glass-panel p-4 bg-white/40 dark:bg-slate-900/40 border border-card-border shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
        {/* Map Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-navy-800/80 mb-2">
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">METROPOLITAN GIS DATABASE</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Select any colored highway route to audit contractor ledger logs</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono">
            <span>LIVE GPS SYNC</span>
          </div>
        </div>

        {/* Map Leaflet Canvas Wrapper */}
        <div className="flex-1 w-full relative min-h-[400px] overflow-hidden rounded-xl">
          {filteredRoads.length > 0 ? (
            <RealMap 
              roads={filteredRoads}
              selectedRoadId={selectedRoadId}
              onSelectRoad={onSelectRoad}
              onMapBoundsChange={handleMapBoundsChange}
              isLoadingRoads={isLoadingRoads}
            />
          ) : (
            <div className="absolute inset-0 bg-slate-100/90 dark:bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center z-10 backdrop-blur-sm">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-3 animate-bounce" />
              <h4 className="font-bold text-slate-800 dark:text-white text-base">No Matching Road Paths</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">Adjust search queries or filters to explore alternative municipal coordinates.</p>
              <button 
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
