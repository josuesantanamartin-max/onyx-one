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

    // Another variation of Selected Item
    content = content.replace(/bg-cyan-900 text-white border-onyx-950/g, 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white border-transparent');

    // Large projection/info box
    content = content.replace(/bg-cyan-900 text-white p-6 rounded-2xl/g, 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-cyan-900/10');

    // Empty state button
    content = content.replace(/bg-cyan-900 hover:bg-black/g, 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700');

    // Progress bar default background 
    content = content.replace(/(isCompleted \? 'bg-emerald-400' : isSelected \? 'bg-cyan-400' : )'bg-cyan-900'/g, "$1'bg-cyan-500'");

    // Icons
    content = content.replace(/bg-cyan-900 text-white rounded-lg/g, 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white rounded-lg');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patcher applied to ${file}`);
}
