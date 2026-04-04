import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_PAT = process.env.AIRTABLE_PAT!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { design, name, email, firm, shippingAddress } = body;

    if (!name || !email || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Sample%20Requests`,
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
                shipping_address: shippingAddress,
                timestamp: new Date().toISOString(),
              },
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[sample-request] Airtable error:', err);
      return NextResponse.json({ error: 'Failed to write' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[sample-request] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
