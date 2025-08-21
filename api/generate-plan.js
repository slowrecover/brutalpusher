// api/generate-plan.js
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { taskName, duration, difficulty } = req.body;

    // Generate brutal plan
    const plan = generateBrutalPlan(taskName || 'unnamed task', duration || 25, difficulty || 'medium');
    
    res.status(200).json({
      success: true,
      plan: plan,
      message: 'Your brutal plan is ready. NOW EXECUTE!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error. But that\'s no excuse for YOUR laziness!'
    });
  }
}

function generateBrutalPlan(taskName, duration, difficulty) {
  const plans = {
    easy: {
      steps: [
        `Stop being PATHETIC and start "${taskName}" RIGHT NOW!`,
        `This should take ${duration} minutes. A BABY could do it faster!`,
        `No breaks, no excuses, just FINISH IT!`
      ],
      tips: [
        "It's EASY! What's your excuse now?",
        "My grandmother could do this blindfolded!",
        "Stop thinking, START DOING!",
        "This is so simple, your procrastination is EMBARRASSING!"
      ],
      motivation: "This task is beneath you, yet here you are, AFRAID of it. PATHETIC!",
      threat: "Fail this easy task and you'll prove you can't do ANYTHING!",
      insult: "Even asking for help with this easy task shows weakness!"
    },
    medium: {
      steps: [
        `ENOUGH EXCUSES! Attack "${taskName}" NOW! (5 min planning MAX)`,
        `GRIND for ${Math.floor(duration * 0.4)} minutes - NO STOPPING!`,
        `2-minute water break - SET A TIMER or you're WEAK!`,
        `DESTROY the rest in ${Math.floor(duration * 0.4)} minutes!`,
        `Final ${duration - Math.floor(duration * 0.8) - 5} minutes - MAKE IT PERFECT!`
      ],
      tips: [
        "Your competition finished this YESTERDAY!",
        "Every minute you delay = one minute closer to FAILURE!",
        "Comfort is the enemy of achievement!",
        "You think this is hard? LIFE IS HARD! Deal with it!"
      ],
      motivation: "Medium tasks separate WINNERS from WHINERS. Which are you?",
      threat: "Your future self will DESPISE you if you quit now!",
      insult: "Still procrastinating? Your dreams are laughing at you!"
    },
    hard: {
      steps: [
        `This is BATTLE! Study your enemy "${taskName}" (10 min MAX)`,
        `Plan your ATTACK - be RUTHLESS! (10 minutes)`,
        `ASSAULT the hardest part for ${Math.floor(duration * 0.35)} minutes!`,
        `5-minute recovery - you'll NEED it, weakling!`,
        `OBLITERATE what remains! ${Math.floor(duration * 0.35)} minutes of FURY!`,
        `Victory lap - DOMINATE the details! (remaining time)`
      ],
      tips: [
        "HARD? GOOD! Diamonds form under PRESSURE!",
        "Your ancestors survived WARS. You can handle a TASK!",
        "Start BADLY if you must, but START!",
        "Fear is the mind-killer. KILL IT FIRST!",
        "This separates LEGENDS from LOSERS!"
      ],
      motivation: "This is your EVEREST! Conquer it or live as a COWARD!",
      threat: "Quit now = quit on your ENTIRE future!",
      insult: "Scared of hard work? Success isn't for the WEAK!"
    }
  };

  // Time-based roasts
  const hour = new Date().getHours();
  let timeRoast = '';
  
  if (hour >= 0 && hour < 5) {
    timeRoast = "Working at 3am? Good! Sleep is for QUITTERS!";
  } else if (hour >= 5 && hour < 8) {
    timeRoast = "Early morning GRIND! While losers sleep, WARRIORS work!";
  } else if (hour >= 8 && hour < 12) {
    timeRoast = "Morning already? You should be on task #3 by now!";
  } else if (hour >= 12 && hour < 17) {
    timeRoast = "Afternoon? Half your day is WASTED! MOVE FASTER!";
  } else if (hour >= 17 && hour < 21) {
    timeRoast = "Evening hustle? Better than Netflix, but barely!";
  } else {
    timeRoast = "Night owl or just DISORGANIZED? Doesn't matter - WORK!";
  }

  const brutalQuotes = [
    "Pain is temporary. Quitting lasts FOREVER!",
    "Your comfort zone is a BEAUTIFUL prison. ESCAPE NOW!",
    "Procrastination is the ASSASSINATION of motivation!",
    "You're not tired, you're UNINSPIRED. Find your RAGE!",
    "Success is violent. Attack your task with FURY!"
  ];

  const selectedPlan = plans[difficulty] || plans.medium;
  
  return {
    taskName: taskName,
    duration: duration,
    difficulty: difficulty,
    ...selectedPlan,
    timeRoast: timeRoast,
    brutalQuote: brutalQuotes[Math.floor(Math.random() * brutalQuotes.length)],
    finalWarning: `You have ${duration} minutes. Start NOW or be a DISAPPOINTMENT forever!`,
    countdown: `${duration}:00 and counting DOWN. MOVE!`,
    timestamp: new Date().toISOString()
  };
}
