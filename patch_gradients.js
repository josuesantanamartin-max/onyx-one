const fs = require('fs');
const path = require('path');

const dir = 'd:/Users/Josué/Desktop/Aliseus/components/features/finance';
const targetFiles = ['Budgets.tsx', 'Goals.tsx', 'Debts.tsx'];

for (const file of targetFiles) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Button: bg-cyan-900 hover:bg-onyx-800
    content = content.replace(/bg-cyan-900 hover:bg-onyx-800/g, 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700');

    // Selected Item border and background
    content = content.replace(/bg-cyan-900 text-white border-cyan-900/g, 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white border-transparent');

    // Large projection/info box
    content = content.replace(/bg-cyan-900 text-white p-6 rounded-2xl/g, 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white p-6 rounded-2xl');

    // Empty state button (if it doesn't match above)
    // Actually, "bg-cyan-900 hover:bg-black"
    content = content.replace(/bg-cyan-900 hover:bg-black/g, 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700');

    // Progress bar default background 
    // In Goals: 'bg-cyan-900' inside a rounded-full for progress
    // "bg-cyan-900'}`" -> "bg-cyan-200'}`" (since inactive progress part is usually lighter) Wait, let's look at Tus Cuentas: It's `bg-onyx-100 rounded-full h-3 p-1 shadow-inner relative overflow-hidden`. The inner bar is `bg-gradient-to-r from-cyan-500 to-cyan-400`.
    // In Goals.tsx:  ${isCompleted ? 'bg-emerald-400' : isSelected ? 'bg-cyan-400' : 'bg-cyan-900'}
    // Let's replace 'bg-cyan-900'`} with 'bg-gradient-to-r from-cyan-500 to-teal-500'`} (if it's the active part)
    // Actually, it usually goes: isCompleted -> isSelected ? 'bg-cyan-400' : 'bg-cyan-900' (when unselected, it's cyan-900).
    // Let's change `bg-cyan-900'}` to `bg-cyan-300'}` or `bg-cyan-500'}`
    content = content.replace(/(isCompleted \? 'bg-emerald-400' : isSelected \? 'bg-cyan-400' : )'bg-cyan-900'/g, "$1'bg-cyan-500'");
    content = content.replace(/(isCompleted \? 'bg-emerald-500' : isSelected \? 'bg-cyan-500' : )'bg-cyan-900'/g, "$1'bg-cyan-500'");
    content = content.replace(/bg-cyan-900/g, (match, offset) => {
        // Just leave cyan-900 for text, but if it is used for backgrounds and we missed it?
        // Let's check surrounding context.
        const surrounding = content.substring(Math.max(0, offset - 10), Math.min(content.length, offset + 20));
        if (surrounding.includes('bg-cyan-900')) {
            if (surrounding.includes('text-white rounded-lg')) {
                return 'bg-gradient-to-br from-cyan-600 to-teal-600';
            }
        }
        return match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patcher applied to ${file}`);
}
