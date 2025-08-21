// api/generate-plan.js

export default function handler(req, res) {
  if (req.method === "POST") {
    const { task } = req.body || {}
    res.status(200).json({
      success: true,
      task,
      plan: [
        `Step 1: Break down "${task}" into small parts`,
        "Step 2: Do the easiest part first",
        "Step 3: Take a 5-min break",
        "Step 4: Continue with the next part"
      ]
    })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
