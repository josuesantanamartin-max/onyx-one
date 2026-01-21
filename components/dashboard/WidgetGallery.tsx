import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { WIDGET_CONFIG } from './WidgetRegistry';

const WidgetGallery: React.FC = () => {
    const { dashboardLayouts, activeLayoutId, addWidgetToLayout } = useUserStore();
    const [searchQuery, setSearchQuery] = useState('');

    const activeLayout = dashboardLayouts.find(l => l.id === activeLayoutId);
    const activeWidgetIds = activeLayout?.widgets.map(w => w.i) || [];

    const availableWidgets = Object.entries(WIDGET_CONFIG).filter(
        ([id]) => !activeWidgetIds.includes(id)
    );

    const filteredWidgets = availableWidgets.filter(([id, config]) =>
        config.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mb-8 p-6 bg-indigo-soft/50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-indigo-primary uppercase tracking-widest">
                    Widgets Disponibles
                </h3>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar widget..."
                        className="pl-10 pr-4 py-2 bg-white dark:bg-onyx-800 border border-onyx-200 dark:border-onyx-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filteredWidgets.map(([id, config]) => (
                    <button
                        key={id}
                        onClick={() => addWidgetToLayout(id)}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-onyx-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-onyx-100 dark:border-onyx-700"
                    >
                        <div className="w-12 h-12 bg-indigo-soft dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                            <Plus className="w-6 h-6 text-indigo-primary" />
                        </div>
                        <span className="text-xs font-bold text-onyx-700 dark:text-onyx-200 text-center">
                            {config.label}
                        </span>
                    </button>
                ))}

                {filteredWidgets.length === 0 && (
                    <div className="col-span-full text-center py-8 text-onyx-400 text-sm">
                        {searchQuery ? 'No se encontraron widgets' : 'Todos los widgets están en uso'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WidgetGallery;
