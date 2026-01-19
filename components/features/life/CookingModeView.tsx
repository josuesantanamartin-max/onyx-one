import React, { useState, useEffect } from 'react';
import { Recipe } from '../../../types';
import { ChevronLeft, ChevronRight, X, Clock, Check, ChefHat, Maximize2, Minimize2 } from 'lucide-react';

interface CookingModeViewProps {
    recipe: Recipe;
    onClose: () => void;
}

export const CookingModeView: React.FC<CookingModeViewProps> = ({ recipe, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(recipe.instructions.length).fill(false));
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showIngredients, setShowIngredients] = useState(true);

    // Timer state
    const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds(prev => {
                    if (prev === null || prev <= 1) {
                        setIsTimerRunning(false);
                        // Play sound or notification
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);

    const toggleStepComplete = (index: number) => {
        const newCompleted = [...completedSteps];
        newCompleted[index] = !newCompleted[index];
        setCompletedSteps(newCompleted);

        // Auto-advance to next step if marking as complete and not the last step
        if (!completedSteps[index] && index < recipe.instructions.length - 1) {
            setTimeout(() => {
                setCurrentStep(index + 1);
            }, 300);
        }
    };

    const startTimer = (minutes: number) => {
        setTimerSeconds(minutes * 60);
        setIsTimerRunning(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const extractTimeFromStep = (step: string): number | null => {
        // Try to extract time from step text (e.g., "10 minutos", "5 min")
        const match = step.match(/(\d+)\s*(minuto|min|minute)/i);
        return match ? parseInt(match[1]) : null;
    };

    const currentStepText = recipe.instructions[currentStep];
    const suggestedTime = extractTimeFromStep(currentStepText);

    return (
        <div className={`fixed inset-0 z-[200] bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col ${isFullscreen ? '' : 'p-4'}`}>
            {/* Header */}
            <div className="bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <ChefHat className="w-6 h-6 text-emerald-400" />
                    <p className="text-sm text-gray-400 font-bold">Paso {currentStep + 1} de {recipe.instructions.length}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden gap-6 p-8 md:p-12">
                {/* Main Content - Steps */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Recipe Name Panel */}
                    <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <ChefHat className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black">{recipe.name}</h2>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-3xl mb-8">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                                style={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 mb-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl font-black">{currentStep + 1}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl md:text-3xl font-bold leading-relaxed">{currentStepText}</p>
                            </div>
                        </div>

                        {/* Timer Section */}
                        {suggestedTime && (
                            <div className="mt-6 p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-orange-400" />
                                    <span className="text-sm font-bold">Tiempo sugerido: {suggestedTime} min</span>
                                </div>
                                <button
                                    onClick={() => startTimer(suggestedTime)}
                                    disabled={isTimerRunning}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 rounded-lg text-sm font-bold transition-colors"
                                >
                                    Iniciar Timer
                                </button>
                            </div>
                        )}

                        {/* Active Timer Display */}
                        {timerSeconds !== null && timerSeconds >= 0 && (
                            <div className="mt-4 p-6 bg-blue-500/20 border border-blue-500/30 rounded-xl text-center">
                                <div className="text-5xl font-black mb-2 text-blue-400">{formatTime(timerSeconds)}</div>
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-bold"
                                    >
                                        {isTimerRunning ? 'Pausar' : 'Reanudar'}
                                    </button>
                                    <button
                                        onClick={() => { setTimerSeconds(null); setIsTimerRunning(false); }}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-bold"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Complete Step Checkbox */}
                        <button
                            onClick={() => toggleStepComplete(currentStep)}
                            className={`mt-6 w-full p-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${completedSteps[currentStep] ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
                        >
                            <Check className="w-5 h-5" />
                            {completedSteps[currentStep] ? 'Paso Completado' : 'Marcar como Completado'}
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentStep(Math.min(recipe.instructions.length - 1, currentStep + 1))}
                            disabled={currentStep === recipe.instructions.length - 1}
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            Siguiente
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Ingredients Panel - Right Side */}
                <div className="w-96 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                            <ChefHat className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black">Ingredientes</h3>
                    </div>
                    <ul className="space-y-3">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <span className="text-gray-300 font-medium">{ing.name}</span>
                                <span className="font-bold text-white ml-2">{ing.quantity} {ing.unit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
