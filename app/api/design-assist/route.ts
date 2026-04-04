import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_PAT = process.env.AIRTABLE_PAT!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { design, name, email, firm, projectName, location, application, dimensions, surfaceType, timeline } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Design%20Assist`,
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
                design: design || '',
                name,
                email,
                firm: firm || '',
                project_name: projectName || '',
                location: location || '',
                application: application || '',
                dimensions: dimensions || '',
                surface_type: surfaceType || '',
                timeline: timeline || '',
                timestamp: new Date().toISOString(),
              },
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[design-assist] Airtable error:', err);
      return NextResponse.json({ error: 'Failed to write' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[design-assist] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
