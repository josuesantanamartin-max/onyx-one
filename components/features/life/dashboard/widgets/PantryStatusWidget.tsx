import React from 'react';
import { useLifeStore } from '../../../../../store/useLifeStore';
import { ShoppingCart } from 'lucide-react';

const PantryStatusWidget: React.FC = () => {
    const { pantryItems, shoppingList } = useLifeStore();
    const lowStockItems = pantryItems.filter(item => item.lowStockThreshold && item.quantity <= item.lowStockThreshold);

    return (
        <div className={`p-6 rounded-[2.5rem] border transition-all h-full ${lowStockItems.length > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30' : 'bg-white dark:bg-onyx-900 border-onyx-100 dark:border-onyx-800 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-4">
                <h4 className={`text-xs font-black uppercase tracking-widest ${lowStockItems.length > 0 ? 'text-red-600' : 'text-onyx-400 dark:text-onyx-500'}`}>Despensa</h4>
                <ShoppingCart className={`w-5 h-5 ${lowStockItems.length > 0 ? 'text-red-500 animate-bounce' : 'text-onyx-200 dark:text-onyx-700'}`} />
            </div>
            <h3 className={`text-3xl font-black mb-1 ${lowStockItems.length > 0 ? 'text-red-600' : 'text-onyx-950 dark:text-white'}`}>
                {lowStockItems.length} <span className="text-sm font-bold opacity-40">Items bajos</span>
            </h3>
            <p className="text-[10px] font-bold text-onyx-400 dark:text-onyx-500 uppercase tracking-widest">
                {shoppingList.length} artículos en la lista de compra
            </p>
        </div>
    );
};

export default PantryStatusWidget;
