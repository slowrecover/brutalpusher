export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    let prompt = '';
    
    if (type === 'task') {
      prompt = `You are a brutally honest anti-procrastination coach. The user is avoiding: "${text}"
      
      Give a harsh but funny roast about their procrastination. Be sarcastic and witty.
      Keep it under 50 words. Don't be too mean, just funny and motivating.`;
    } else if (type === 'excuse') {
      prompt = `The user just gave this pathetic excuse: "${text}"
      
      Destroy this excuse with a witty, sarcastic comeback. Point out why it's just procrastination.
      Keep it under 30 words. Be funny but brutal.`;
    } else {
      prompt = `Answer this question with a bit of sass and humor: "${text}"
      Keep it brief and engaging.`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ response: aiText });
  } catch (error) {
    res.status(500).json({ error: 'AI failed', response: 'Even AI gave up on you. Just do it!' });
  }
}
