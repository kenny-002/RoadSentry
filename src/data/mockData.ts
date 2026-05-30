export { CITIES, INDIA_DISTRICTS } from './indiaDistricts';
export type { District, StateDistricts } from './indiaDistricts';

export interface Road {
  id: string;
  name: string;
  type: 'NH' | 'SH' | 'MDR' | 'Local Road';
  condition: 'Good' | 'Moderate' | 'Damaged' | 'Critical';
  contractorId: string;
  sanctionedAmount: number; // in Lakhs (INR)
  spentAmount: number; // in Lakhs (INR)
  lastRelayingDate: string;
  lengthKm: number;
  svgPath: string; // Coordinate representation for custom interactive SVG map
  textCoords: { x: number; y: number }; // Where to draw the text label on the map
  coordinates: [number, number][]; // Lat, Lng polyline for real Leaflet Map
}

export interface Contractor {
  id: string;
  name: string;
  rating: number; // out of 5 stars
  score: number; // performance score 0-100
  completedProjects: number;
  delayedProjects: number;
  activeProjects: number;
}

export interface Authority {
  id: string;
  name: string;
  role: string;
  region: string;
  email: string;
  phone: string;
}

export interface Complaint {
  id: string;
  roadId: string;
  issueType: 'pothole' | 'crack' | 'waterlogging' | 'street light' | 'drainage';
  description: string;
  severity: 'Low' | 'Medium' | 'Critical';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';
  assignedAuthorityId: string;
  gpsLocation: { lat: number; lng: number };
  imageUrl: string;
  createdDate: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  notes?: string;
}

export const contractors: Contractor[] = [
  { id: 'contractor-1', name: 'Apex Infrastructure Ltd', rating: 4.6, score: 92, completedProjects: 24, delayedProjects: 1, activeProjects: 3 },
  { id: 'contractor-2', name: 'BuildSmart Civils', rating: 3.9, score: 78, completedProjects: 16, delayedProjects: 3, activeProjects: 2 },
  { id: 'contractor-3', name: 'Vanguard Roads Corp', rating: 2.7, score: 54, completedProjects: 8, delayedProjects: 5, activeProjects: 2 },
  { id: 'contractor-4', name: 'Horizon Paving & Infra', rating: 4.2, score: 86, completedProjects: 19, delayedProjects: 0, activeProjects: 4 },
  { id: 'contractor-5', name: 'Metro Tech Builders', rating: 3.1, score: 62, completedProjects: 11, delayedProjects: 4, activeProjects: 1 },
];

export const authorities: Authority[] = [
  { id: 'authority-1', name: 'Er. Rajesh Kumar', role: 'Executive Engineer (NH Division)', region: 'Zone 1 (North)', email: 'rajesh.kumar@roadsentry.gov', phone: '+91 98450 12341' },
  { id: 'authority-2', name: 'Er. M. Anbarasan', role: 'Assistant Executive Engineer (SH Division)', region: 'Zone 2 (Central)', email: 'm.anbarasan@roadsentry.gov', phone: '+91 98450 12342' },
  { id: 'authority-3', name: 'Er. S. Meenakshi', role: 'Divisional Engineer (MDR Division)', region: 'Zone 3 (South)', email: 's.meenakshi@roadsentry.gov', phone: '+91 98450 12343' },
  { id: 'authority-4', name: 'Er. K. Raghavan', role: 'Ward Officer (Local Roads Division)', region: 'Zone 4 (East)', email: 'k.raghavan@roadsentry.gov', phone: '+91 98450 12344' },
];

export const roads: Road[] = [
  {
    id: 'road-1',
    name: 'Mount Road (Anna Salai)',
    type: 'NH',
    condition: 'Good',
    contractorId: 'contractor-1',
    sanctionedAmount: 850,
    spentAmount: 820,
    lastRelayingDate: '2025-08-12',
    lengthKm: 12.4,
    svgPath: 'M 100,250 L 700,250',
    textCoords: { x: 400, y: 235 },
    coordinates: [
      [13.0827, 80.2707],
      [13.0732, 80.2608],
      [13.0601, 80.2494],
      [13.0402, 80.2335],
      [13.0215, 80.2201],
      [13.0112, 80.2144]
    ]
  },
  {
    id: 'road-2',
    name: 'OMR IT Expressway',
    type: 'SH',
    condition: 'Moderate',
    contractorId: 'contractor-4',
    sanctionedAmount: 1200,
    spentAmount: 1150,
    lastRelayingDate: '2024-11-20',
    lengthKm: 20.1,
    svgPath: 'M 250,250 L 250,480',
    textCoords: { x: 200, y: 380 },
    coordinates: [
      [13.0075, 80.2450],
      [12.9860, 80.2462],
      [12.9592, 80.2455],
      [12.9288, 80.2440],
      [12.8995, 80.2468]
    ]
  },
  {
    id: 'road-3',
    name: 'East Coast Road',
    type: 'SH',
    condition: 'Good',
    contractorId: 'contractor-1',
    sanctionedAmount: 950,
    spentAmount: 910,
    lastRelayingDate: '2025-03-05',
    lengthKm: 15.6,
    svgPath: 'M 600,250 L 600,480',
    textCoords: { x: 630, y: 380 },
    coordinates: [
      [12.9855, 80.2605],
      [12.9580, 80.2620],
      [12.9295, 80.2635],
      [12.8988, 80.2650],
      [12.8710, 80.2590]
    ]
  },
  {
    id: 'road-4',
    name: 'Outer Ring Road',
    type: 'NH',
    condition: 'Critical',
    contractorId: 'contractor-3',
    sanctionedAmount: 1450,
    spentAmount: 1580,
    lastRelayingDate: '2023-05-14',
    lengthKm: 29.8,
    svgPath: 'M 80,450 Q 80,80 720,80',
    textCoords: { x: 380, y: 65 },
    coordinates: [
      [13.0010, 80.1200],
      [13.0350, 80.1150],
      [13.0900, 80.1320],
      [13.1550, 80.1680],
      [13.2050, 80.2240]
    ]
  },
  {
    id: 'road-5',
    name: 'Poonamallee High Road',
    type: 'NH',
    condition: 'Damaged',
    contractorId: 'contractor-2',
    sanctionedAmount: 600,
    spentAmount: 590,
    lastRelayingDate: '2023-10-18',
    lengthKm: 9.5,
    svgPath: 'M 100,250 L 250,80',
    textCoords: { x: 130, y: 150 },
    coordinates: [
      [13.0825, 80.2745],
      [13.0782, 80.2390],
      [13.0740, 80.1880],
      [13.0560, 80.1450],
      [13.0480, 80.1080]
    ]
  },
  {
    id: 'road-6',
    name: 'Kamarajar Salai (Beach Road)',
    type: 'SH',
    condition: 'Good',
    contractorId: 'contractor-4',
    sanctionedAmount: 450,
    spentAmount: 430,
    lastRelayingDate: '2025-01-22',
    lengthKm: 5.2,
    svgPath: 'M 600,250 L 700,120',
    textCoords: { x: 670, y: 180 },
    coordinates: [
      [13.0820, 80.2825],
      [13.0645, 80.2812],
      [13.0478, 80.2790],
      [13.0315, 80.2762]
    ]
  },
  {
    id: 'road-7',
    name: 'Arcot Road',
    type: 'MDR',
    condition: 'Damaged',
    contractorId: 'contractor-5',
    sanctionedAmount: 380,
    spentAmount: 375,
    lastRelayingDate: '2024-02-10',
    lengthKm: 7.8,
    svgPath: 'M 250,250 L 100,380',
    textCoords: { x: 145, y: 310 },
    coordinates: [
      [13.0520, 80.2315],
      [13.0495, 80.2100],
      [13.0430, 80.1820],
      [13.0360, 80.1580]
    ]
  },
  {
    id: 'road-8',
    name: 'Radial Road',
    type: 'MDR',
    condition: 'Moderate',
    contractorId: 'contractor-2',
    sanctionedAmount: 520,
    spentAmount: 490,
    lastRelayingDate: '2024-09-15',
    lengthKm: 8.9,
    svgPath: 'M 250,380 L 600,380',
    textCoords: { x: 425, y: 370 },
    coordinates: [
      [12.9645, 80.2460],
      [12.9560, 80.2180],
      [12.9510, 80.1890],
      [12.9630, 80.1495]
    ]
  },
  {
    id: 'road-9',
    name: 'Gandhi Mandapam Link',
    type: 'Local Road',
    condition: 'Critical',
    contractorId: 'contractor-3',
    sanctionedAmount: 180,
    spentAmount: 195,
    lastRelayingDate: '2022-08-01',
    lengthKm: 3.2,
    svgPath: 'M 400,250 L 400,380',
    textCoords: { x: 420, y: 310 },
    coordinates: [
      [13.0075, 80.2450],
      [13.0092, 80.2310],
      [13.0135, 80.2225],
      [13.0180, 80.2195]
    ]
  },
  {
    id: 'road-10',
    name: 'Thiruvalluvar Local Lane',
    type: 'Local Road',
    condition: 'Moderate',
    contractorId: 'contractor-5',
    sanctionedAmount: 90,
    spentAmount: 85,
    lastRelayingDate: '2025-02-28',
    lengthKm: 1.5,
    svgPath: 'M 600,300 L 720,300',
    textCoords: { x: 670, y: 290 },
    coordinates: [
      [13.0005, 80.2680],
      [12.9982, 80.2640],
      [12.9968, 80.2595]
    ]
  }
];

export const complaints: Complaint[] = [
  {
    id: 'RW-1001',
    roadId: 'road-4',
    issueType: 'pothole',
    description: 'A cluster of deep potholes is causing severe traffic slowing and hazard for two-wheelers right after the flyover.',
    severity: 'Critical',
    status: 'In Progress',
    assignedAuthorityId: 'authority-1',
    gpsLocation: { lat: 13.0645, lng: 80.2012 },
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-12',
    reporterName: 'Aarav Sharma',
    reporterPhone: '+91 99000 88771',
    notes: 'Contractor Vanguard Roads Corp notified. Repair scheduled.'
  },
  {
    id: 'RW-1002',
    roadId: 'road-9',
    issueType: 'drainage',
    description: 'Overflowing sewage water has flooded the street, making it impossible for pedestrians to walk. Strong foul smell.',
    severity: 'Critical',
    status: 'Assigned',
    assignedAuthorityId: 'authority-4',
    gpsLocation: { lat: 13.0112, lng: 80.2314 },
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-18',
    reporterName: 'Priya Patel',
    reporterPhone: '+91 98888 77766',
    notes: 'Routed to Ward Officer. Drainage inspection team dispatched.'
  },
  {
    id: 'RW-1003',
    roadId: 'road-5',
    issueType: 'crack',
    description: 'Long longitudinal cracks opening up along the central lane, threatening to break apart with heavy truck traffic.',
    severity: 'Medium',
    status: 'Pending',
    assignedAuthorityId: 'authority-1',
    gpsLocation: { lat: 13.0827, lng: 80.2707 },
    imageUrl: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-22',
    reporterName: 'Karthik S',
    reporterPhone: '+91 97777 66655'
  },
  {
    id: 'RW-1004',
    roadId: 'road-2',
    issueType: 'waterlogging',
    description: 'Moderate water accumulation near the IT park entrance after brief showers due to clogged storm water outlets.',
    severity: 'Medium',
    status: 'Resolved',
    assignedAuthorityId: 'authority-2',
    gpsLocation: { lat: 12.9716, lng: 80.2452 },
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6b66b730?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-02',
    reporterName: 'Sneha Reddy',
    reporterPhone: '+91 96666 55544',
    notes: 'Inlet grates cleared. Water drained. Closed on 2026-05-05.'
  },
  {
    id: 'RW-1005',
    roadId: 'road-7',
    issueType: 'street light',
    description: 'Three consecutive street lights are not functioning, making the stretch pitch dark and highly unsafe for women at night.',
    severity: 'Medium',
    status: 'In Progress',
    assignedAuthorityId: 'authority-3',
    gpsLocation: { lat: 13.0478, lng: 80.2125 },
    imageUrl: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-15',
    reporterName: 'Siddharth Sen',
    reporterPhone: '+91 95555 44433',
    notes: 'Technician team from MDR Division is working on wiring replacement.'
  },
  {
    id: 'RW-1006',
    roadId: 'road-5',
    issueType: 'pothole',
    description: 'Sharp pothole near the left edge. Hard to see at dusk, already caused two tire punctures this week.',
    severity: 'Medium',
    status: 'Assigned',
    assignedAuthorityId: 'authority-1',
    gpsLocation: { lat: 13.0789, lng: 80.2589 },
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-20',
    reporterName: 'Vikram Seth',
    reporterPhone: '+91 94444 33322'
  },
  {
    id: 'RW-1007',
    roadId: 'road-4',
    issueType: 'crack',
    description: 'Road edge is crumbling down near the canal, leaving a very narrow and unstable margin.',
    severity: 'Critical',
    status: 'Pending',
    assignedAuthorityId: 'authority-1',
    gpsLocation: { lat: 13.0722, lng: 80.1988 },
    imageUrl: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-25',
    reporterName: 'Divya N',
    reporterPhone: '+91 93333 22211'
  },
  {
    id: 'RW-1008',
    roadId: 'road-8',
    issueType: 'waterlogging',
    description: 'Puddle of standing water has remained for 10 days, breeding mosquitoes near the apartment block.',
    severity: 'Low',
    status: 'Resolved',
    assignedAuthorityId: 'authority-3',
    gpsLocation: { lat: 12.9899, lng: 80.2111 },
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6b66b730?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-04-28',
    reporterName: 'Meera Nair',
    reporterPhone: '+91 92222 11100',
    notes: 'Blocked culvert cleared, stagnant water swept away. Closed on 2026-05-01.'
  },
  {
    id: 'RW-1009',
    roadId: 'road-1',
    issueType: 'street light',
    description: '[IoT AUTO-ALERT] Lamp Post #LP-241 Bulb circuit failure. Luminous output dropped below threshold (0 lux detected).',
    severity: 'Critical',
    status: 'Pending',
    assignedAuthorityId: 'authority-1',
    gpsLocation: { lat: 13.0732, lng: 80.2608 },
    imageUrl: 'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-28',
    reporterName: 'IoT Lamp Sensor #241',
    reporterPhone: 'TELEMETRY-SYS-01'
  },
  {
    id: 'RW-1010',
    roadId: 'road-3',
    issueType: 'street light',
    description: '[IoT AUTO-ALERT] Lamp Post #LP-108 Voltage anomaly detected. Active circuit cutoff logged.',
    severity: 'Medium',
    status: 'Assigned',
    assignedAuthorityId: 'authority-2',
    gpsLocation: { lat: 12.9580, lng: 80.2620 },
    imageUrl: 'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?q=80&w=800&auto=format&fit=crop',
    createdDate: '2026-05-29',
    reporterName: 'IoT Lamp Sensor #108',
    reporterPhone: 'TELEMETRY-SYS-02'
  }
];

// CITIES is now re-exported from ./indiaDistricts (all districts of India)
