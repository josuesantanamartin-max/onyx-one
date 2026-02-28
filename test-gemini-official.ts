import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    console.log("Starting test with @google/generative-ai...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Calling generateContent...");
        const result = await model.generateContent("Hola");
        const response = await result.response;
        console.log("Success! Text:", response.text());
    } catch (e: any) {
        console.error("Error encountered:");
        console.error(e.message);
        if (e.status) console.error("Status:", e.status);
    }
}
run();
