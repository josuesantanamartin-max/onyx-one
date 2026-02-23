import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface BentoSectionProps {
    id: string;
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const BentoSection: React.FC<BentoSectionProps> = ({ id, title, icon, children, defaultOpen = true }) => {
    // Intentar leer el estado guardado del localStorage para esta sección
    const storageKey = `onyx_bento_section_${id}`;
    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved !== null ? saved === 'true' : defaultOpen;
    });

    useEffect(() => {
        localStorage.setItem(storageKey, isOpen.toString());
    }, [isOpen, storageKey]);

    return (
        <div className="mb-6 rounded-3xl overflow-hidden bg-white/40 dark:bg-onyx-900/30 border border-onyx-200/50 dark:border-onyx-800/50 backdrop-blur-sm">
            {/* Cabecera / Header del Acordeón */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-onyx-100/50 dark:hover:bg-onyx-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="p-2 rounded-xl bg-onyx-100 dark:bg-onyx-800 text-onyx-500 dark:text-onyx-400">
                            {icon}
                        </div>
                    )}
                    <h2 className="text-lg font-bold text-onyx-900 dark:text-white tracking-tight">
                        {title}
                    </h2>
                </div>

                <div className="p-1.5 rounded-full bg-onyx-100 dark:bg-onyx-800 text-onyx-500 transition-transform duration-300">
                    {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
            </button>

            {/* Contenido Expandible */}
            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
            >
                <div className="p-6 pt-2">
                    {/* Bento Grid layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BentoSection;
