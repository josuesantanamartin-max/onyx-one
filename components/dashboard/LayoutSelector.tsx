import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

const LayoutSelector: React.FC = () => {
    const { dashboardLayouts, activeLayoutId, setActiveLayout } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);

    const activeLayout = dashboardLayouts.find(l => l.id === activeLayoutId);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-onyx-900 border border-onyx-200 dark:border-onyx-700 rounded-xl text-sm font-bold hover:bg-onyx-50 dark:hover:bg-onyx-800 transition-colors shadow-sm"
            >
                <span className="text-onyx-700 dark:text-onyx-200">{activeLayout?.name || 'Seleccionar Layout'}</span>
                <ChevronDown className="w-4 h-4 text-onyx-400" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-onyx-900 border border-onyx-200 dark:border-onyx-700 rounded-xl shadow-lg z-50 overflow-hidden">
                        {dashboardLayouts.map((layout) => (
                            <button
                                key={layout.id}
                                onClick={() => {
                                    setActiveLayout(layout.id);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-onyx-50 dark:hover:bg-onyx-800 transition-colors text-left"
                            >
                                <div>
                                    <div className="font-bold text-sm text-onyx-900 dark:text-white">
                                        {layout.name}
                                    </div>
                                    {layout.description && (
                                        <div className="text-xs text-onyx-400 mt-0.5">
                                            {layout.description}
                                        </div>
                                    )}
                                </div>
                                {layout.id === activeLayoutId && (
                                    <Check className="w-4 h-4 text-indigo-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default LayoutSelector;
