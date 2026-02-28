import React from 'react';
import { LucideIcon, Expand, Shrink, X, GripHorizontal, Maximize2, Columns, LayoutPanelLeft, MonitorPlay } from 'lucide-react';
// We import getColSpanClass statically instead of dynamically requiring it to fix Vite build errors
import { getColSpanClass, WidgetSize } from './WidgetRegistry';

interface BentoTileProps {
    id: string;
    title: string;
    value: string | number;
    subValue?: string | React.ReactNode;
    icon: LucideIcon;
    color?: 'cyan' | 'emerald' | 'rose' | 'amber' | 'blue' | 'teal' | 'onyx';
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
    // The full widget component to render when expanded
    fullWidgetComponent?: React.ReactNode;
    // Optional custom compact content
    customContent?: React.ReactNode;
    className?: string;
    isEditMode?: boolean;
    onRemove?: () => void;
    // For size controls
    size?: string;
    sizeOverride?: string;
    onChangeSize?: (newSize: string) => void;
    // For Drag and Drop Reordering
    onReorderDrop?: (sourceId: string, targetId: string) => void;
}

const colorMap = {
    cyan: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
    rose: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
    teal: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-500/20',
    onyx: 'bg-onyx-50 dark:bg-onyx-500/10 text-onyx-600 dark:text-onyx-400 border-onyx-100 dark:border-onyx-500/20',
};

const BentoTile: React.FC<BentoTileProps> = ({
    id,
    title,
    value,
    subValue,
    icon: Icon,
    color = 'cyan',
    trend,
    trendValue,
    isExpanded,
    onToggleExpand,
    fullWidgetComponent,
    customContent,
    className = '',
    isEditMode = false,
    onRemove,
    size = 'half',
    sizeOverride,
    onChangeSize,
    onReorderDrop,
}) => {
    // Determine the active size and corresponding grid class
    const activeSize = sizeOverride || size;
    const colSpanClass = getColSpanClass(activeSize as WidgetSize);

    // Internal Drag and Drop visual state
    const [isDragOver, setIsDragOver] = React.useState(false);

    if (isExpanded && fullWidgetComponent) {
        return (
            <div className={`
                relative flex flex-col w-full min-h-[400px] 
                bg-white dark:bg-onyx-900 border border-cyan-200 dark:border-cyan-800/50 
                rounded-[2.5rem] shadow-2xl transition-all duration-500
                backdrop-blur-xl
                ${colSpanClass} ${className}
            `}>
                {/* Header for expanded view - Entire header is clickable to contract */}
                <div
                    className="flex items-center justify-between p-5 border-b border-onyx-100 dark:border-onyx-800/60 bg-onyx-50/30 dark:bg-onyx-800/10 rounded-t-[2.5rem] border-dashed cursor-pointer hover:bg-onyx-100/30 dark:hover:bg-onyx-800/30 transition-colors group/header"
                    onClick={onToggleExpand}
                >
                    <div className="flex items-center gap-2">
                        <div className={`p-2.5 rounded-2xl border bg-white dark:bg-onyx-800 shadow-sm ${colorMap[color]}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-onyx-900 dark:text-white uppercase tracking-widest">{title}</span>
                    </div>
                    <div className="p-2 text-onyx-400 group-hover/header:text-onyx-600 dark:group-hover/header:text-onyx-300 transition-colors">
                        <Shrink className="w-4 h-4" />
                    </div>
                </div>
                {/* Full Widget Content */}
                <div className="flex-1 p-2">
                    {fullWidgetComponent}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`
                bg-white dark:bg-onyx-900 border border-onyx-100 dark:border-onyx-800/50 
                rounded-[2rem] p-6 text-left transition-all duration-500
                ${isEditMode ? 'hover:border-cyan-400 dark:hover:border-cyan-500 border-dashed border-2 cursor-grab active:cursor-grabbing' : 'hover:shadow-2xl hover:-translate-y-2 hover:border-cyan-300 dark:hover:border-cyan-500/50 cursor-pointer'}
                ${isDragOver ? 'border-4 border-cyan-500 bg-cyan-50/50 dark:bg-cyan-500/20 scale-[0.98]' : ''}
                ${colSpanClass} ${className}
            `}
            onClick={!isEditMode ? onToggleExpand : undefined}
            draggable={isEditMode}
            onDragStart={(e) => {
                if (isEditMode) {
                    e.dataTransfer.setData('text/plain', id);
                    e.dataTransfer.effectAllowed = 'move';
                    // Optional: Make the dragged element slightly transparent
                    setTimeout(() => {
                        if (e.target instanceof HTMLElement) {
                            e.target.style.opacity = '0.5';
                        }
                    }, 0);
                }
            }}
            onDragEnd={(e) => {
                if (isEditMode && e.target instanceof HTMLElement) {
                    e.target.style.opacity = '1';
                }
                setIsDragOver(false);
            }}
            onDragOver={(e) => {
                if (isEditMode) {
                    e.preventDefault(); // Necessary to allow drop
                    e.dataTransfer.dropEffect = 'move';
                    if (!isDragOver) setIsDragOver(true);
                }
            }}
            onDragLeave={(e) => {
                if (isEditMode) {
                    setIsDragOver(false);
                }
            }}
            onDrop={(e) => {
                if (isEditMode) {
                    e.preventDefault();
                    setIsDragOver(false);
                    const sourceId = e.dataTransfer.getData('text/plain');
                    if (sourceId && sourceId !== id && onReorderDrop) {
                        onReorderDrop(sourceId, id);
                    }
                }
            }}
        >
            {/* Header: Icono y Título */}
            <div className="flex items-start justify-between w-full mb-4">
                <div className={`p-3 rounded-2xl border bg-white dark:bg-onyx-800 shadow-sm ${colorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {isEditMode && onRemove && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Content KPI */}
            {customContent ? (
                <div className="w-full flex-1">
                    {customContent}
                </div>
            ) : (
                <div className="w-full mt-auto">
                    <p className="text-[11px] font-bold text-onyx-400 dark:text-onyx-500 uppercase tracking-widest mb-1">
                        {title}
                    </p>
                    <div className="flex items-end justify-between gap-2">
                        <h3 className="text-2xl font-black text-onyx-900 dark:text-white truncate">
                            {value}
                        </h3>
                        {trend && trendValue && (
                            <div className={`flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' :
                                trend === 'down' ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10' :
                                    'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                                }`}>
                                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                                {trendValue}
                            </div>
                        )}
                    </div>
                    {subValue && (
                        <p className="text-xs text-onyx-500 dark:text-onyx-400 truncate mt-1">
                            {subValue}
                        </p>
                    )}
                </div>
            )}

            {/* Hover Indicators */}
            {!isEditMode && (
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500">
                        <Expand className="w-3.5 h-3.5" />
                    </div>
                </div>
            )}

            {isEditMode && (
                <div className="absolute inset-0 bg-cyan-50/50 dark:bg-cyan-500/5 backdrop-blur-[1px] rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all pointer-events-none">
                    <GripHorizontal className="w-8 h-8 text-cyan-400" />
                </div>
            )}

            {/* Size Controls - Edit Mode */}
            {isEditMode && onChangeSize && (
                <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-white dark:bg-onyx-800 border border-onyx-200 dark:border-onyx-700 shadow-xl rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                    onClick={(e) => e.stopPropagation()} // Prevent triggering drag or expand
                >
                    {[
                        { s: 'kpi', icon: <MonitorPlay className="w-3.5 h-3.5" />, title: 'Pequeño (1/4)' },
                        { s: 'half', icon: <Columns className="w-3.5 h-3.5" />, title: 'Mediano (1/2)' },
                        { s: 'wide', icon: <LayoutPanelLeft className="w-3.5 h-3.5" />, title: 'Ancho (3/4)' },
                        { s: 'full', icon: <Maximize2 className="w-3.5 h-3.5" />, title: 'Completo (4/4)' },
                    ].map(({ s, icon, title }) => (
                        <button
                            key={s}
                            title={title}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChangeSize(s); }}
                            className={`p-1.5 rounded-full transition-colors ${activeSize === s
                                ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400'
                                : 'text-onyx-400 hover:text-onyx-700 hover:bg-onyx-100 dark:hover:text-onyx-300 dark:hover:bg-onyx-700'
                                }`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BentoTile;

