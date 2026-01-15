import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'No API key configured' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { stats, topWallpaper, topResource } = body;

    const prompt = `Write a friendly intro for an e-reader community newsletter (2-3 short sentences).

Stats: ${stats.resources} resources, ${stats.news} news, ${stats.wallpapers} wallpapers.
${topWallpaper ? `Top wallpaper: "${topWallpaper.title}" (${topWallpaper.downloads} downloads).` : ''}
${topResource ? `Featured resource: "${topResource.title}".` : ''}

Rules:
- Output simple HTML with <br> for line breaks between sentences
- Keep it casual and engaging
- End with: <br><br>👋 Florent
- No emojis at the start of sentences
- Vary the tone`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', response.status, errorText);
      return new Response(JSON.stringify({ error: `OpenAI error: ${response.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim() || '';
    
    // Nettoyer les balises markdown code block
    content = content.replace(/^```html\n?/i, '').replace(/\n?```$/i, '').trim();

    return new Response(JSON.stringify({ intro: content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    console.error('Generation error:', e);
    return new Response(JSON.stringify({ error: e.message || 'Generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
