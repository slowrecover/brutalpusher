export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a brutal anti-procrastination coach. User says: "${text}"
              
              Reply with:
              1. A harsh but funny roast (max 20 words)
              2. THREE tiny steps they can do RIGHT NOW (each under 30 seconds)
              
              Format:
              ROAST: [your roast]
              STEPS:
              1. [step 1]
              2. [step 2]  
              3. [step 3]`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ response: aiText });
  } catch (error) {
    res.status(500).json({ error: 'AI failed', details: error.message });
  }
}
