const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for generating plans
app.post('/api/generate-plan', async (req, res) => {
    try {
        const { task } = req.body;
        
        if (!task) {
            return res.status(400).json({ error: 'Task is required' });
        }

        console.log('Generating plan for task:', task);

        // Generate plan using Gemini AI
        const plan = await generatePlanWithAI(task);
        
        res.json(plan);
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ 
            error: 'Failed to generate plan',
            fallback: generateFallbackPlan(req.body.task)
        });
    }
});

async function generatePlanWithAI(task) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `You are a brutal but humorous motivational coach. The user wants to accomplish: "${task}"

Please provide:
1. A brutal but funny motivational message (2-3 sentences, use emojis)
2. A custom action plan with 4-6 specific, actionable steps

Format your response as JSON:
{
  "motivation": "your motivational message here",
  "steps": ["step 1", "step 2", "step 3", "step 4"]
}

Be specific to their task, not generic. Make the motivation brutal but humorous, not mean. Focus on actionable steps that are easy to follow.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('AI Response:', text);
        
        // Try to parse JSON response
        try {
            const parsed = JSON.parse(text);
            return {
                motivation: parsed.motivation,
                steps: parsed.steps
            };
        } catch (parseError) {
            console.error('JSON parsing failed, extracting from text');
            return extractFromText(text, task);
        }
        
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}

function extractFromText(text, task) {
    const lines = text.split('\n').filter(line => line.trim());
    
    const motivation = lines[0] || `Time to stop being a lazy potato and get your ${task} done! 💀`;
    
    const steps = lines.slice(1)
        .filter(line => line.trim() && !line.includes('{') && !line.includes('}'))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    
    if (steps.length === 0) {
        return generateFallbackPlan(task);
    }
    
    return { motivation, steps };
}

function generateFallbackPlan(task) {
    const motivations = [
        `Listen here, you magnificent procrastinator! Your ${task} isn't going to do itself! Stop being a professional excuse maker and start being a goal achiever! ��`,
        `Oh, you want to ${task}? Well, your future self is already disappointed in you! Time to stop being a couch potato and start being a success potato! ��`,
        `Your ${task} is waiting for you, but you're too busy being lazy! Your procrastination skills are impressive, but your achievement skills are non-existent! Time to change that! ⚡`,
        `Excuse me, but your ${task} doesn't care about your feelings! Stop making excuses and start making progress! Your goals are getting tired of waiting! 🥔`
    ];
    
    const motivation = motivations[Math.floor(Math.random() * motivations.length)];
    const steps = generateCustomSteps(task);
    
    return { motivation, steps };
}

function generateCustomSteps(task) {
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('study') || taskLower.includes('learn') || taskLower.includes('read')) {
        return [
            'Clear your desk and remove all distractions',
            'Open your textbook and read one chapter',
            'Take notes on the key points',
            'Review and summarize what you learned',
            'Test yourself with practice questions'
        ];
    } else if (taskLower.includes('work') || taskLower.includes('project') || taskLower.includes('job')) {
        return [
            'Check your email and prioritize tasks',
            'Start with the most important task first',
            'Set a timer for 25 minutes and focus',
            'Take a 5-minute break, then continue',
            'Review your progress and adjust'
        ];
    } else if (taskLower.includes('exercise') || taskLower.includes('workout') || taskLower.includes('gym')) {
        return [
            'Put on your workout clothes',
            'Do a 5-minute warm-up',
            'Start with 10 minutes of cardio',
            'Add strength training exercises',
            'Cool down and stretch'
        ];
    } else if (taskLower.includes('clean') || taskLower.includes('organize') || taskLower.includes('tidy')) {
        return [
            'Pick up trash and put it in the bin',
            'Put away items that are out of place',
            'Wipe down surfaces with a cloth',
            'Vacuum or sweep the floor',
            'Organize one drawer or shelf'
        ];
    } else if (taskLower.includes('write') || taskLower.includes('blog') || taskLower.includes('article')) {
        return [
            'Open a blank document',
            'Write down your main ideas',
            'Start with the first paragraph',
            'Keep writing without editing',
            'Review and polish your work'
        ];
    } else {
        return [
            'Break down your task into smaller parts',
            'Start with the easiest step first',
            'Set a timer for 25 minutes and focus',
            'Take a short break and continue',
            'Review your progress and celebrate small wins'
        ];
    }
}

app.listen(PORT, () => {
    console.log(`🚀 Brutal Pusher server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
    console.log(`🤖 Gemini AI integration ready`);
});

module.exports = app;
