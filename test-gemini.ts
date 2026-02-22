import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
// Load .env
dotenv.config();

async function run() {
    console.log("Starting test...");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
        console.log("Calling generateContent...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // trying stable model
            contents: 'Say hello in Spanish',
        });
        console.log("Success! Text:", response.text);
    } catch (e: any) {
        console.error("Error encountered:");
        console.error(e.message);
        if (e.status) console.error("Status:", e.status);
        console.error(JSON.stringify(e, null, 2));
    }
}
run();
