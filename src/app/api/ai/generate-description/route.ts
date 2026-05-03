import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productName, brand, category, colors, tags } = await request.json();

    const prompt = `Write a compelling, SEO-optimized product description for this fashion e-commerce product.
Product: ${productName}
Brand: ${brand}
Category: ${category}
Colors available: ${colors?.join(', ')}
Tags: ${tags?.join(', ')}

Write exactly:
ENGLISH: [2-3 sentences, highlight style, quality, and versatility. Be aspirational but concise.]
ARABIC: [Arabic translation of the same description]

Respond ONLY with the two labeled sections. No other text.`;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await fetch(process.env.LLM_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'moonshot-v1-8k',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    const enMatch = text.match(/ENGLISH:\s*([\s\S]+?)(?=ARABIC:|$)/i);
    const arMatch = text.match(/ARABIC:\s*([\s\S]+?)$/i);

    return NextResponse.json({
      descriptionEn: enMatch?.[1]?.trim() || text,
      descriptionAr: arMatch?.[1]?.trim() || '',
    });
  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
