import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Persona AI, the personal style assistant for Persona — a luxury fashion e-commerce store.
You are knowledgeable, warm, sophisticated, and fashion-forward. Your tone is elegant yet approachable.
Help customers: find their style, pick sizes, build outfits, understand return policies, discover deals.
Brand: Persona. Colors: gold, rose, cream, dark. Categories: Women, Men, Kids, Shoes, Accessories, Beauty.
Keep responses concise: 2-3 sentences max. End with a relevant emoji.
IMPORTANT: Always respond in the SAME LANGUAGE the user writes in. Fully support Arabic and English.
Never make up specific prices or product availability. Suggest they browse the relevant category.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, currentPage } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const contextualSystem = `${SYSTEM_PROMPT}\nCurrent page: ${currentPage || '/'}`;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await fetch(process.env.LLM_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: contextualSystem },
          ...messages.slice(-10),
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[AI API error]', err);
      return NextResponse.json({ response: "I'm having a moment! Please try again in a bit. ✨" });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "Let me help you find your perfect style! ✨";

    return NextResponse.json({ response: message });
  } catch (error) {
    console.error('[style-assistant]', error);
    return NextResponse.json({ response: "Sorry, I couldn't connect right now. Feel free to browse our collections! 🛍️" });
  }
}
