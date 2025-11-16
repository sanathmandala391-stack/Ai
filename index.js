const express = require("express");
const cors = require("cors");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(cors({
    origin:[
        "https:sanathai.vercel.app"
    ],
       methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
));
dotEnv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo DB Connected Successfully..."))
    .catch((err) => console.log(err));

const PORT = 7000

app.get("/", (req, res) => {
    res.send("Welcome to the Sanath_AI");
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message; // FIXED ✔

        if (!userMessage) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Correct OpenAI API format
        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: userMessage,
        });

        const aiReply = response.output_text;

        return res.json({ reply: aiReply });

    } catch (err) {
        console.log("AI ERROR:", err);
        return res.status(500).json("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log("Server Started Successfully on Port", PORT);
});

