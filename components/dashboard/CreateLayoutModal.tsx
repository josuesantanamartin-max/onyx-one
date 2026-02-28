import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

interface CreateLayoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
}

const CreateLayoutModal: React.FC<CreateLayoutModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name, description);
            setName('');
            setDescription('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-onyx-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-cyan-soft dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-cyan-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-onyx-950 dark:text-white">
                            Crear Layout
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-onyx-100 dark:hover:bg-onyx-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-onyx-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-onyx-700 dark:text-onyx-200 mb-2">
                            Nombre del Layout
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Mi Dashboard Personalizado"
                            className="w-full px-4 py-3 bg-onyx-50 dark:bg-onyx-800 border border-onyx-200 dark:border-onyx-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-primary text-onyx-900 dark:text-white"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-onyx-700 dark:text-onyx-200 mb-2">
                            Descripción (opcional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe para qué usarás este layout..."
                            rows={3}
                            className="w-full px-4 py-3 bg-onyx-50 dark:bg-onyx-800 border border-onyx-200 dark:border-onyx-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-primary resize-none text-onyx-900 dark:text-white"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-onyx-200 dark:bg-onyx-700 text-onyx-700 dark:text-onyx-200 rounded-xl font-bold hover:bg-onyx-300 dark:hover:bg-onyx-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-cyan-primary text-white rounded-xl font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Crear Layout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLayoutModal;

