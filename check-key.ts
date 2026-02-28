import * as dotenv from 'dotenv';
dotenv.config();
const key = process.env.VITE_GEMINI_API_KEY || '';
console.log(`Key length: ${key.length}`);
console.log(`Key starts-with-AIza: ${key.startsWith('AIza')}`);
console.log(`Key has-newlines: ${key.includes('\n') || key.includes('\r')}`);
console.log(`Key has-spaces: ${key.includes(' ')}`);
