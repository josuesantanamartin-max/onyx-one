import React from 'react';
import { Save, X } from 'lucide-react';

interface EditModeToolbarProps {
    onSave: () => void;
    onCancel: () => void;
}

const EditModeToolbar: React.FC<EditModeToolbarProps> = ({
    onSave,
    onCancel,
}) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shadow-sm"
            >
                <Save className="w-4 h-4" />
                Guardar
            </button>

            <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-onyx-200 dark:bg-onyx-700 text-onyx-700 dark:text-onyx-200 rounded-xl font-bold text-sm hover:bg-onyx-300 dark:hover:bg-onyx-600 transition-colors"
            >
                <X className="w-4 h-4" />
                Cancelar
            </button>
        </div>
    );
};

export default EditModeToolbar;
