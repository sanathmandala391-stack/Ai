const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS FIX
app.use(cors({
    origin: [
        "https://sanathai.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ✅ OpenAI Setup
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo DB Connected Successfully..."))
    .catch((err) => console.log("Mongo Error:", err));

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("✅ Sanath AI Backend Running...");
});

// ✅ CHAT API (FIXED)
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ message: "Message is required" });
        }

        // 🔥 USE STABLE API
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: userMessage }
            ],
        });

        const aiReply = response.choices[0].message.content;

        return res.json({ reply: aiReply });

    } catch (err) {
        console.log("❌ AI ERROR:", err.message);

        return res.status(500).json({
            error: "Internal Server Error",
            details: err.message
        });
    }
});

// ✅ PORT
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log("🚀 Server running on port", PORT);
});
