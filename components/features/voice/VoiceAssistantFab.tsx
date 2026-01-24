import React, { useState, useEffect } from 'react';
import { useVoiceAssistant } from '../../../hooks/useVoiceAssistant';
import { Mic, MicOff, Sparkles, X, ChevronRight, Activity } from 'lucide-react';

export const VoiceAssistantFab: React.FC = () => {
    const { isListening, isProcessing, lastTranscript, lastAction, error, listen, stop } = useVoiceAssistant();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Auto-expand when listening starts
    useEffect(() => {
        if (isListening) setIsExpanded(true);
    }, [isListening]);

    // Show result panel when action arrives
    useEffect(() => {
        if (lastAction) {
            setShowResult(true);
            const timer = setTimeout(() => setShowResult(false), 5000); // Auto hide after 5s
            return () => clearTimeout(timer);
        }
    }, [lastAction]);

    const handleToggle = () => {
        if (isListening) {
            stop();
        } else {
            listen();
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 pointer-events-none">

            {/* Transcript / Feedback Panel */}
            {(isExpanded || showResult) && (
                <div className="pointer-events-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 w-80 animate-slideUp">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-gray-800 dark:text-gray-200">Onyx Assistant</span>
                        </div>
                        <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="min-h-[60px] flex items-center justify-center text-center p-2">
                        {isListening ? (
                            <div className="flex flex-col items-center gap-2">
                                <Activity className="w-6 h-6 text-indigo-500 animate-pulse" />
                                <span className="text-sm text-gray-500">Escuchando... {lastTranscript}</span>
                            </div>
                        ) : isProcessing ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-gray-500">Procesando con IA...</span>
                            </div>
                        ) : lastAction ? (
                            <div className="text-left w-full">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Acción Detectada</p>
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">{lastAction.type}</p>
                                    <p className="text-xs text-green-600 dark:text-green-400 truncate">
                                        {JSON.stringify(lastAction.payload)}
                                    </p>
                                </div>
                            </div>
                        ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                        ) : (
                            <p className="text-sm text-gray-400 italic">"Intenta decir: Añadir gasto de 50 euros"</p>
                        )}
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={handleToggle}
                className={`pointer-events-auto p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-200'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-110'
                    }`}
            >
                {isListening ? (
                    <MicOff className="w-6 h-6 text-white" />
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}
            </button>
        </div>
    );
};
