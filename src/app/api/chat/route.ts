import { NextRequest, NextResponse } from 'next/server';

// ── Road Sentry Knowledge Base ──────────────────────────────────────────────
// This is the structured data the AI uses to answer factual road queries.
const ROAD_KNOWLEDGE_BASE = `
ROAD SENTRY KNOWLEDGE BASE — TAMIL NADU ROAD INFRASTRUCTURE DATA

=== ROAD DATA ===

Road: NH 44 (National Highway 44)
Type: NH (National Highway)
Location: Chennai to Kanyakumari corridor, passing through Salem, Madurai
Contractor: Ramco Infrastructure Pvt Ltd
Sanction Amount: ₹1,200 Lakhs
Amount Spent: ₹1,185 Lakhs
Last Relaying Date: 2023-08-15
Maintenance Status: Good
Responsible Department: National Highways Authority of India (NHAI)
Division: Chennai NH Division
Complaint Helpline: 1800-111-111

Road: OMR IT Expressway (Old Mahabalipuram Road)
Type: SH (State Highway)
Location: Chennai — Siruseri — Sholinganallur — Kelambakkam
Contractor: L&T Infrastructure Engineering
Sanction Amount: ₹890 Lakhs
Amount Spent: ₹912 Lakhs
Last Relaying Date: 2024-01-10
Maintenance Status: Moderate — partial pothole patches needed
Responsible Department: Tamil Nadu Highways Department
Division: Chennai South Division
Complaint Helpline: 044-28270101

Road: Mount Road (Anna Salai)
Type: MDR (Major District Road)
Location: Central Chennai — Egmore to Guindy
Contractor: SPML Infra Ltd
Sanction Amount: ₹450 Lakhs
Amount Spent: ₹432 Lakhs
Last Relaying Date: 2023-11-20
Maintenance Status: Damaged — major resurfacing due
Responsible Department: Greater Chennai Corporation (GCC)
Division: Chennai Central Zone
Complaint Helpline: 044-25384532

Road: East Coast Road (ECR)
Type: SH (State Highway)
Location: Chennai — Mahabalipuram — Pondicherry
Contractor: Navayuga Engineering Company Ltd
Sanction Amount: ₹1,050 Lakhs
Amount Spent: ₹1,040 Lakhs
Last Relaying Date: 2024-03-05
Maintenance Status: Good
Responsible Department: Tamil Nadu Highways Department
Division: Chengalpattu Highway Division
Complaint Helpline: 044-27452255

Road: Poonamallee High Road
Type: MDR (Major District Road)
Location: Chennai — Poonamallee — Tiruvallur
Contractor: KCC Buildcon Pvt Ltd
Sanction Amount: ₹380 Lakhs
Amount Spent: ₹395 Lakhs
Last Relaying Date: 2023-06-30
Maintenance Status: Critical — multiple pothole complaints pending
Responsible Department: Greater Chennai Corporation (GCC)
Division: Chennai West Zone
Complaint Helpline: 044-24711111

Road: GST Road (Grand Southern Trunk)
Type: NH (National Highway — NH 45)
Location: Chennai — Tambaram — Chengalpattu — Trichy
Contractor: Afcons Infrastructure Ltd
Sanction Amount: ₹1,400 Lakhs
Amount Spent: ₹1,350 Lakhs
Last Relaying Date: 2023-09-12
Maintenance Status: Good
Responsible Department: NHAI
Division: Chennai NH Division
Complaint Helpline: 1800-111-111

Road: Velachery Main Road
Type: MDR (Major District Road)
Location: Velachery — Taramani — Perungudi
Contractor: Simplex Infrastructures
Sanction Amount: ₹220 Lakhs
Amount Spent: ₹218 Lakhs
Last Relaying Date: 2024-02-18
Maintenance Status: Moderate
Responsible Department: Greater Chennai Corporation
Division: Chennai South Zone
Complaint Helpline: 044-22200300

=== COMPLAINT REGISTRATION ===
To file a complaint:
1. Go to "Report Issue" in the Road Sentry app navigation
2. Select the road and type of damage (pothole, crack, drainage, streetlight)
3. Click "Get GPS" to auto-attach your location
4. Upload a photo as proof
5. Submit — it is auto-routed to the responsible engineer

Complaint Tracking: Go to "Track My Complaints" and enter your Complaint ID (format: RW-XXXX)

=== ROAD TYPES IN INDIA ===
- NH (National Highway): Maintained by NHAI, connects states and major cities
- SH (State Highway): Maintained by State PWD/Highways Dept, connects districts
- MDR (Major District Road): Maintained by District Collector/Corporation, connects towns
- ODR (Other District Road): Maintained by Panchayat Union, connects villages
- VR (Village Road): Maintained by Gram Panchayat, connects hamlets

=== RESPONSIBLE AUTHORITIES ===
- National Highways: NHAI (National Highways Authority of India)
- State Highways: Tamil Nadu Highways Department (PWD)
- City Roads: Greater Chennai Corporation (GCC) / respective municipal corporation
- District Roads: District Collector / Panchayat Union

=== ROAD SAFETY ===
- Emergency: Dial 112
- Highway Patrol: 1033
- Ambulance: 108
- Road Accident Helpline: 1800-180-1515
- Always report damaged roads immediately to prevent accidents
- Common hazards: Potholes, missing signage, poor drainage, broken guardrails

=== BUDGET & TRANSPARENCY ===
All road budgets are public under RTI Act 2005.
You can check sanctioned vs spent amounts through this portal.
Overrun budgets are flagged for audit.
`;


// ── Local fallback answerer (used when Gemini API is rate-limited / unavailable) ──
function localAnswer(message: string): string {
  const q = message.toLowerCase();

  // Off-topic
  if (!isRoadRelated(message)) {
    return "Sorry, I can only help with Road Sentry related road infrastructure, civic issue, and road safety queries. 🛣️";
  }

  // Complaint filing
  if (q.includes('file') || q.includes('report') || (q.includes('how') && q.includes('complaint')) || q.includes('pothole') && q.includes('report')) {
    return "**How to File a Complaint:**\n1. Click 'Report Issue' in the navigation\n2. Select the road and damage type (pothole, crack, drainage, streetlight)\n3. Click 'Get GPS' to auto-attach your location\n4. Upload a photo as proof\n5. Submit — auto-routed to the responsible engineer ✅";
  }

  // Complaint tracking
  if (q.includes('track') || q.includes('status') || q.includes('rw-')) {
    return "**Track Your Complaint:**\nGo to **'Track My Complaints'** in the navigation and enter your Complaint ID (format: RW-XXXX). You'll see real-time status: Pending → Assigned → In Progress → Resolved.";
  }

  // Emergency / safety numbers
  if (q.includes('emergency') || q.includes('accident') || q.includes('ambulance') || q.includes('helpline') || q.includes('safety number')) {
    return "**Road Emergency Numbers:**\n• 🚨 Emergency: **112**\n• 🛣️ Highway Patrol: **1033**\n• 🚑 Ambulance: **108**\n• ☎️ Road Accident Helpline: **1800-180-1515**\n\nAlways report damaged roads immediately to prevent accidents!";
  }

  // Road types
  if ((q.includes('type') || q.includes('what is') || q.includes('difference')) && (q.includes('nh') || q.includes('sh') || q.includes('mdr') || q.includes('road type'))) {
    return "**Road Types in India:**\n• **NH** (National Highway) — NHAI, connects states & major cities\n• **SH** (State Highway) — State PWD/Highways Dept, connects districts\n• **MDR** (Major District Road) — Corporation/District, connects towns\n• **ODR** (Other District Road) — Panchayat Union, connects villages\n• **VR** (Village Road) — Gram Panchayat, connects hamlets";
  }

  // Structured road data lookup
  const ROADS = [
    {
      names: ['nh 44', 'nh44', 'national highway 44'],
      name: 'NH 44 (National Highway 44)',
      type: 'NH', contractor: 'Ramco Infrastructure Pvt Ltd',
      sanction: '₹1,200 Lakhs', spent: '₹1,185 Lakhs',
      lastRelay: '2023-08-15', status: 'Good',
      dept: 'NHAI (National Highways Authority of India)',
      helpline: '1800-111-111'
    },
    {
      names: ['omr', 'old mahabalipuram', 'it expressway'],
      name: 'OMR IT Expressway',
      type: 'SH', contractor: 'L&T Infrastructure Engineering',
      sanction: '₹890 Lakhs', spent: '₹912 Lakhs',
      lastRelay: '2024-01-10', status: 'Moderate — partial pothole patches needed',
      dept: 'Tamil Nadu Highways Department',
      helpline: '044-28270101'
    },
    {
      names: ['mount road', 'anna salai'],
      name: 'Mount Road (Anna Salai)',
      type: 'MDR', contractor: 'SPML Infra Ltd',
      sanction: '₹450 Lakhs', spent: '₹432 Lakhs',
      lastRelay: '2023-11-20', status: 'Damaged — major resurfacing due',
      dept: 'Greater Chennai Corporation (GCC)',
      helpline: '044-25384532'
    },
    {
      names: ['ecr', 'east coast road'],
      name: 'East Coast Road (ECR)',
      type: 'SH', contractor: 'Navayuga Engineering Company Ltd',
      sanction: '₹1,050 Lakhs', spent: '₹1,040 Lakhs',
      lastRelay: '2024-03-05', status: 'Good',
      dept: 'Tamil Nadu Highways Department',
      helpline: '044-27452255'
    },
    {
      names: ['poonamallee', 'poonamallee high road'],
      name: 'Poonamallee High Road',
      type: 'MDR', contractor: 'KCC Buildcon Pvt Ltd',
      sanction: '₹380 Lakhs', spent: '₹395 Lakhs',
      lastRelay: '2023-06-30', status: 'Critical — multiple pothole complaints pending',
      dept: 'Greater Chennai Corporation (GCC)',
      helpline: '044-24711111'
    },
    {
      names: ['gst road', 'grand southern trunk', 'nh 45', 'nh45'],
      name: 'GST Road (NH 45)',
      type: 'NH', contractor: 'Afcons Infrastructure Ltd',
      sanction: '₹1,400 Lakhs', spent: '₹1,350 Lakhs',
      lastRelay: '2023-09-12', status: 'Good',
      dept: 'NHAI', helpline: '1800-111-111'
    },
    {
      names: ['velachery'],
      name: 'Velachery Main Road',
      type: 'MDR', contractor: 'Simplex Infrastructures',
      sanction: '₹220 Lakhs', spent: '₹218 Lakhs',
      lastRelay: '2024-02-18', status: 'Moderate',
      dept: 'Greater Chennai Corporation',
      helpline: '044-22200300'
    },
  ];

  const road = ROADS.find(r => r.names.some(n => q.includes(n)));

  if (road) {
    if (q.includes('contractor') || q.includes('who') || q.includes('responsible') || q.includes('officer') || q.includes('authority') || q.includes('department')) {
      return `**${road.name}**\n• **Contractor:** ${road.contractor}\n• **Responsible Dept:** ${road.dept}\n• **Road Type:** ${road.type}\n• **Helpline:** ${road.helpline}`;
    }
    if (q.includes('budget') || q.includes('amount') || q.includes('sanction') || q.includes('spent') || q.includes('cost') || q.includes('money')) {
      return `**${road.name} — Budget Details**\n• **Sanctioned Amount:** ${road.sanction}\n• **Amount Spent:** ${road.spent}\n• **Department:** ${road.dept}`;
    }
    if (q.includes('relay') || q.includes('repair') || q.includes('last') || q.includes('when') || q.includes('date') || q.includes('maintenance') || q.includes('condition')) {
      return `**${road.name} — Maintenance Info**\n• **Last Relaying Date:** ${road.lastRelay}\n• **Current Status:** ${road.status}\n• **Type:** ${road.type}\n• **Department:** ${road.dept}`;
    }
    if (q.includes('type') || q.includes('what type') || q.includes('which type')) {
      return `**${road.name}**\n• **Road Type:** ${road.type}\n• **Responsible Dept:** ${road.dept}\n• **Status:** ${road.status}`;
    }
    // Generic full info
    return `**${road.name}**\n• **Type:** ${road.type}\n• **Contractor:** ${road.contractor}\n• **Sanctioned:** ${road.sanction} | **Spent:** ${road.spent}\n• **Last Relaid:** ${road.lastRelay}\n• **Status:** ${road.status}\n• **Department:** ${road.dept}\n• **Helpline:** ${road.helpline}`;
  }

  // Budget transparency
  if (q.includes('budget') || q.includes('rti') || q.includes('transparency') || q.includes('audit')) {
    return "All road budgets are public under **RTI Act 2005**. You can check sanctioned vs spent amounts through this Road Sentry portal. Overrun budgets are flagged for audit. Ask about a specific road name to get its budget details!";
  }

  // Authorities
  if (q.includes('authority') || q.includes('department') || q.includes('who handles') || q.includes('which department')) {
    return "**Road Authorities in Tamil Nadu:**\n• **National Highways (NH):** NHAI\n• **State Highways (SH):** TN Highways Dept (PWD)\n• **City Roads:** Greater Chennai Corporation (GCC)\n• **District Roads:** District Collector / Panchayat Union\n\nTell me a specific road name to find its exact authority!";
  }

  // Default
  return "I can help with road infrastructure data! Try asking:\n• *\"Who is the contractor for OMR?\"*\n• *\"When was Mount Road last relaid?\"*\n• *\"What is the budget for ECR?\"*\n• *\"How do I report a pothole?\"*\n• *\"Road safety emergency numbers\"*";
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Empty message' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Quick off-topic check before hitting the API
    if (!isRoadRelated(message)) {
      return NextResponse.json({
        reply: "Sorry, I can only help with Road Sentry related road infrastructure, civic issue, and road safety queries. Try asking about a road's contractor, pothole complaints, budget details, or how to report an issue! 🛣️"
      });
    }

    // If no API key, fall back to local knowledge base
    if (!apiKey) {
      return NextResponse.json({ reply: localAnswer(message) });
    }

    // Build conversation history for Gemini
    const conversationHistory = (history || []).map((h: { role: string; text: string }) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    const systemInstruction = `You are Road Sentry AI Assistant — a smart city road infrastructure chatbot for Tamil Nadu, India.

STRICT RULES:
1. You ONLY answer questions about: road infrastructure, road types (NH/SH/MDR/ODR/VR), contractors, road budgets, sanction amounts, amount spent, last relaying dates, maintenance status, potholes, cracks, drainage, streetlights, sidewalks, complaint registration, complaint tracking, responsible departments/authorities, ward/zone/constituency/municipality/district details, road accident emergency services, and road safety awareness.
2. If asked ANYTHING outside this scope (sports, weather, general knowledge, coding, entertainment, politics, personal advice, etc.), reply EXACTLY: "Sorry, I can only help with Road Sentry related road infrastructure, civic issue, and road safety queries."
3. Always be helpful, factual and cite specific road data when available.
4. Format responses clearly with bullet points or numbered lists when appropriate.
5. If road data is not in the knowledge base, say: "I could not find verified data for this road. Please enter a road name, ward, or location to search."
6. Keep responses concise — under 150 words unless detailed data is needed.

ROAD SENTRY KNOWLEDGE BASE:
${ROAD_KNOWLEDGE_BASE}`;

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        ...conversationHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
        topP: 0.8,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ]
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    // On rate limit or any API error → fall back to local knowledge base
    if (!geminiRes.ok) {
      const errBody = await geminiRes.json().catch(() => ({}));
      const status = geminiRes.status;
      console.warn(`Gemini API ${status} — falling back to local knowledge base`);
      // For rate limits (429), use local fallback silently
      if (status === 429 || status >= 500) {
        return NextResponse.json({ reply: localAnswer(message) });
      }
      console.error('Gemini API error:', JSON.stringify(errBody));
      return NextResponse.json({ reply: localAnswer(message) });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      localAnswer(message);

    return NextResponse.json({ reply });

  } catch (err) {
    console.error('Chat API route error:', err);
    // Even on crash — return local answer instead of error
    try {
      const { message: msg } = await req.json().catch(() => ({ message: '' }));
      return NextResponse.json({ reply: localAnswer(msg || '') });
    } catch {
      return NextResponse.json({ reply: "I'm having trouble connecting. Please try again shortly." });
    }
  }
}

const ROAD_KEYWORDS = [
  'road','highway','pothole','crack','repair','maintenance','contractor','budget',
  'sanction','spent','relaying','resurface','drainage','streetlight','sidewalk',
  'complaint','report','track','nh','sh','mdr','odr','nhai','pwd','gcc','zone',
  'ward','constituency','municipality','district','authority','engineer','officer',
  'infrastructure','civic','pavement','asphalt','tar','construction','accident',
  'safety','emergency','ambulance','helpline','divison','department','panchayat',
  'sentry','road sentry','omr','ecr','gst road','mount road','velachery','nh44',
  'nh 44','file','submit','status','pending','resolved','assigned','in progress',
  'who is responsible','when was','last repaired','amount','how to','what is',
  'type of road','condition','damaged','critical','good','moderate'
];

function isRoadRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return ROAD_KEYWORDS.some(kw => lower.includes(kw));
}
