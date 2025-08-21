// server.js
import express from "express"
import dotenv from "dotenv"

dotenv.config() // 加载 .env 文件里的 API_KEY 等配置

const app = express()

// 让服务器能解析 JSON 请求体
app.use(express.json())

// 测试根路径
app.get("/", (req, res) => {
  res.send("🚀 BrutalPusher server is running")
})

/**
 * API: /api/generate-plan
 * 用来生成计划（目前是简单返回，后面可以接 Gemini）
 */
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { task } = req.body || {}

    if (!task) {
      return res.status(400).json({ success: false, error: "Missing task" })
    }

    // 先返回一个 mock（假计划）
    // 以后这里可以接入 @google/generative-ai
    const fakePlan = [
      `Step 1: Break down "${task}" into small parts`,
      "Step 2: Do the easiest part first",
      "Step 3: Take a 5-min break",
      "Step 4: Continue with the next part"
    ]

    res.json({
      success: true,
      task,
      plan: fakePlan
    })
  } catch (err) {
    console.error("❌ Error in /api/generate-plan:", err)
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// 启动服务器
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`)
})
