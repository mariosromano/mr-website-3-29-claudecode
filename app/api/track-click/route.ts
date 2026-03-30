import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_PAT = process.env.AIRTABLE_PAT!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { design_name, active_filters, session_id } = body;

    if (!design_name) {
      return NextResponse.json({ error: 'Missing design_name' }, { status: 400 });
    }

    // Write to Design Clicks table in Airtable
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Design%20Clicks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                design_name,
                timestamp: new Date().toISOString(),
                active_filters: typeof active_filters === 'string'
                  ? active_filters
                  : JSON.stringify(active_filters || {}),
                session_id: session_id || 'anonymous',
              },
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[track-click] Airtable error:', err);
      return NextResponse.json({ error: 'Failed to write' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[track-click] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
