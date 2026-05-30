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

// ── Topic guard — detect off-topic questions ─────────────────────────────────
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

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Empty message' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Quick off-topic check before hitting the API
    if (!isRoadRelated(message)) {
      return NextResponse.json({
        reply: "Sorry, I can only help with Road Sentry related road infrastructure, civic issue, and road safety queries. Try asking about a road's contractor, pothole complaints, budget details, or how to report an issue! 🛣️"
      });
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm having trouble responding right now. Please try again.";

    return NextResponse.json({ reply });

  } catch (err) {
    console.error('Chat API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
