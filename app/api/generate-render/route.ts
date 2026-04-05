import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { image_url, prompt } = await request.json();

    if (!image_url || !prompt) {
      return NextResponse.json({ error: 'Missing image_url or prompt' }, { status: 400 });
    }

    const res = await fetch('https://fal.run/fal-ai/nano-banana-pro/edit', {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url,
        prompt,
        image_size: 'landscape_16_9',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[generate-render] fal.ai error:', err);
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[generate-render] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
