require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ContactMessage = require("./models/ContactMessage");

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, "..", "frontend");

app.use(express.json());
app.use(express.static(frontendDir));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "portfolio-backend",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/projects", (req, res) => {
    res.json([
        {
            id: "localbasket",
            title: "LocalBasket",
            summary: "E-commerce platform for local vendors with inventory and sales management.",
            stack: ["HTML", "CSS", "JavaScript", "MySQL"],
            url: "https://localbasket.co.in"
        },
        {
            id: "admin-dashboard",
            title: "Vishwakarma Enterprises Admin",
            summary: "Operations dashboard with management workflows and business reporting.",
            stack: ["Node.js", "Dashboard", "Analytics"]
        },
        {
            id: "nutraceuticals-platform",
            title: "Nutraceuticals Review Platform",
            summary: "Structured research platform for documenting and reviewing nutraceutical compounds.",
            stack: ["Research", "Documentation", "Web App"]
        }
    ]);
});

app.get("/api/messages", async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Unable to load messages right now." });
    }
});

app.post("/api/contact", async (req, res) => {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!name || name.length < 2) {
        return res.status(400).json({ error: "Please enter a valid name." });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!message || message.length < 10) {
        return res.status(400).json({ error: "Message should be at least 10 characters long." });
    }

    try {
        const entry = await ContactMessage.create({
            name,
            email,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Thanks for reaching out. Your message has been saved.",
            entry
        });
    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong while saving your message."
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Portfolio server running on http://localhost:${PORT}`);
});
