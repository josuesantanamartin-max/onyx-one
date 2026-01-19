import React, { useState } from 'react';
import { Recipe } from '../../../types';
import { Calendar, X, Check } from 'lucide-react';

interface PlanRecipeModalProps {
    recipe: Recipe;
    onClose: () => void;
    onAddToMealPlan: (date: string, meal: 'breakfast' | 'lunch' | 'dinner') => void;
    onAddToShoppingList: () => void;
}

export const PlanRecipeModal: React.FC<PlanRecipeModalProps> = ({
    recipe,
    onClose,
    onAddToMealPlan,
    onAddToShoppingList
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');

    const handleAddToPlan = () => {
        onAddToMealPlan(selectedDate, selectedMeal);
        onAddToShoppingList(); // Also add to shopping list automatically
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Planificar: {recipe.name}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-sm font-bold text-blue-900 mb-2">
                            Al agregar al plan de comidas, los ingredientes faltantes se añadirán automáticamente a tu lista de compra.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Comida</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                                <button
                                    key={meal}
                                    onClick={() => setSelectedMeal(meal)}
                                    className={`p-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${selectedMeal === meal ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {meal === 'breakfast' ? 'Desayuno' : meal === 'lunch' ? 'Almuerzo' : 'Cena'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-emerald-900 mb-2">Ingredientes de la receta:</p>
                        <ul className="space-y-1">
                            {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                                <li key={idx} className="text-xs text-emerald-700 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                    {ing.name} ({ing.quantity} {ing.unit})
                                </li>
                            ))}
                            {recipe.ingredients.length > 5 && (
                                <li className="text-xs text-emerald-600 italic">+ {recipe.ingredients.length - 5} más...</li>
                            )}
                        </ul>
                    </div>

                    <button
                        onClick={handleAddToPlan}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Check className="w-5 h-5" />
                        Agregar al Plan de Comidas
                    </button>
                </div>
            </div>
        </div>
    );
};
