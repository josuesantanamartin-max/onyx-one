import React from 'react';
import { GripVertical, X } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

interface WidgetWrapperProps {
    widgetId: string;
    isEditMode: boolean;
    children: React.ReactNode;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
    widgetId,
    isEditMode,
    children,
}) => {
    const { removeWidgetFromLayout } = useUserStore();

    return (
        <div className="h-full bg-white dark:bg-onyx-900 rounded-2xl shadow-sm border border-onyx-100 dark:border-onyx-800 overflow-hidden relative group">
            {/* Edit Controls */}
            {isEditMode && (
                <div className="absolute top-3 right-3 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        className="drag-handle p-2 bg-white/90 dark:bg-onyx-800/90 backdrop-blur-sm rounded-lg shadow-sm cursor-move hover:bg-onyx-50 dark:hover:bg-onyx-700 transition-colors"
                        title="Arrastrar"
                    >
                        <GripVertical className="w-4 h-4 text-onyx-400" />
                    </button>

                    <button
                        onClick={() => removeWidgetFromLayout(widgetId)}
                        className="p-2 bg-white/90 dark:bg-onyx-800/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                        title="Eliminar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Widget Content */}
            <div className="h-full overflow-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
};

export default WidgetWrapper;
