// api/roast.js
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const roasts = [
    "Still procrastinating? Your DREAMS are dying!",
    "Every second you waste, someone else gets YOUR success!",
    "Your bed thinks you're a QUITTER!",
    "Netflix can wait. Your FUTURE can't!",
    "You're not tired, you're WEAK! PROVE ME WRONG!",
    "Your competition just passed you AGAIN!",
    "Comfort zone = FAILURE zone!",
    "Stop reading this and START WORKING!",
    "Your future poverty thanks your current LAZINESS!",
    "Winners work. Losers find excuses. CHOOSE!",
    "Your mom didn't raise a QUITTER... or did she?",
    "That task won't do itself, PRINCESS!",
    "Procrastination is just FEAR wearing a disguise!",
    "Your potential is SCREAMING while you sit there!",
    "The graveyard is full of 'I'll do it tomorrow' people!",
    "Your excuse is WEAKER than your grandmother!",
    "Success called - you sent it to VOICEMAIL!",
    "Your goals think you're PATHETIC right now!",
    "Even this roast is more productive than YOU!",
    "Dinosaurs went extinct. So will your DREAMS if you don't MOVE!"
  ];

  const intensity = req.query.intensity || 'brutal';
  
  let selectedRoast = roasts[Math.floor(Math.random() * roasts.length)];
  
  if (intensity === 'nuclear') {
    selectedRoast = selectedRoast.toUpperCase() + " 🔥💀🔥";
  }

  res.status(200).json({
    success: true,
    roast: selectedRoast,
    intensity: intensity,
    motivationalThreat: "NOW GET BACK TO WORK!",
    timestamp: new Date().toISOString()
  });
}
