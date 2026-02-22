
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Read .env manually since we are in a simple script
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("❌ Error reading .env.local:", e.message);
    process.exit(1);
}

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error("❌ Invalid API Key found in .env.local");
    process.exit(1);
}

console.log(`🔑 Testing with API Key: ${apiKey.substring(0, 8)}...`);

const ai = new GoogleGenAI({ apiKey });

async function verifyFinance() {
    console.log("\n💰 [Phase 1] Testing Finance AI Advisor...");
    try {
        const prompt = "Act as a financial advisor. Briefly analyze this data: Income $5000, Rent $1500, Food $800. Single sentence.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text;
        if (text) {
            console.log("   ✅ Finance AI Response:", text.substring(0, 100) + "...");
            return true;
        }
    } catch (e) {
        console.error("   ❌ Finance AI Failed:", e.message);
    }
    return false;
}

async function verifyKitchen() {
    console.log("\n🍳 [Phase 2] Testing Kitchen AI (Recipe Gen)...");
    try {
        const prompt = "Create a JSON recipe for 'Pasta'. Return ONLY JSON.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text;
        if (text) {
            console.log("   ✅ Kitchen AI Response Received (Length: " + text.length + ")");
            return true;
        }
    } catch (e) {
        console.error("   ❌ Kitchen AI Failed:", e.message);
    }
    return false;
}

async function verifyLife() {
    console.log("\n✈️ [Phase 3] Testing Life AI (Trip Planner)...");
    try {
        const prompt = "Plan a weekend trip to Paris. Return raw JSON.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Using Pro for complex tasks as per service file
            contents: prompt,
        });
        const text = response.text;
        if (text) {
            console.log("   ✅ Life AI Response Received (Length: " + text.length + ")");
            return true;
        }
    } catch (e) {
        if (e.message.includes("404") || e.message.includes("not found")) {
            console.log("   ⚠️ Pro model might not be available, retrying with Flash...");
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            if (response.text) {
                console.log("   ✅ Life AI Response Received (Flash fallback)");
                return true;
            }
        }
        console.error("   ❌ Life AI Failed:", e.message);
    }
    return false;
}

async function run() {
    const f = await verifyFinance();
    const k = await verifyKitchen();
    const l = await verifyLife();

    console.log("\n🏁 SUMMARY:");
    console.log(`   Finance: ${f ? '✅ OK' : '❌ FAIL'}`);
    console.log(`   Kitchen: ${k ? '✅ OK' : '❌ FAIL'}`);
    console.log(`   Life:    ${l ? '✅ OK' : '❌ FAIL'}`);

    if (f && k && l) {
        console.log("\n✨ All systems operational!");
    } else {
        console.log("\n⚠️ Some systems failed. Check API key permissions or quotas.");
    }
}

run();
