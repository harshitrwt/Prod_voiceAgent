import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
app.use(express.static(path.join(_dirname, "public")));

const VOICE_PLATFORM_URL = process.env.VOICE_PLATFORM_URL;
const VOICE_PLATFORM_API_KEY = process.env.VOICE_PLATFORM_API_KEY;

app.post("/api/voice-token", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  try {
    if (!VOICE_PLATFORM_URL || !VOICE_PLATFORM_API_KEY) {
      return res.status(500).json({
        error: "Missing VOICE_PLATFORM_URL or VOICE_PLATFORM_API_KEY in .env",
      });
    }

    // TODO: Authenticate the caller before minting tokens.

    const r = await fetch(`${VOICE_PLATFORM_URL}/api/v1/token`, {
      method: "POST",
      headers: {
        "X-API-Key": VOICE_PLATFORM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participant_name: "Web User" }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return res.status(r.status).json({ error: "Token request failed", detail });
    }

    const data = await r.json();

    res.json({
      rtc_url: data.rtc_url || data.livekit_url,
      token: data.token,
      expires_in: data.expires_in,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to mint token" });
  }
});

app.listen(3000, () => console.log("Open http://localhost:3000"));