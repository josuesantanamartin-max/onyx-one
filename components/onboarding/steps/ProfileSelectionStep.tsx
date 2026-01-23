import React, { useState } from 'react';
import { UserPersona } from '../../../types';
import { useUserStore } from '../../../store/useUserStore';
import { GraduationCap, Briefcase, Users2, Rocket, Laptop, CheckCircle2 } from 'lucide-react';

const PROFILES: { id: UserPersona; title: string; desc: string; icon: any; color: string }[] = [
    {
        id: 'STUDENT',
        title: 'Estudiante',
        desc: 'Gestión simple. Enfocado en presupuesto semanal y ahorro.',
        icon: GraduationCap,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'FREELANCER',
        title: 'Freelancer',
        desc: 'Control de ingresos irregulares, impuestos y gastos deducibles.',
        icon: Laptop,
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'PROFESSIONAL',
        title: 'Profesional',
        desc: 'Gestión de nómina, inversiones y patrimonio neto.',
        icon: Briefcase,
        color: 'from-slate-700 to-slate-900'
    },
    {
        id: 'FAMILY',
        title: 'Familia',
        desc: 'Presupuesto hogar, gastos compartidos e hijos.',
        icon: Users2,
        color: 'from-indigo-500 to-violet-500'
    },
    {
        id: 'ENTREPRENEUR',
        title: 'Emprendedor',
        desc: 'Flujo de caja, separación personal/negocio y métricas.',
        icon: Rocket,
        color: 'from-orange-500 to-red-500'
    }
];

const ProfileSelectionStep: React.FC = () => {
    const { setOnboardingStep, setUserProfile, userProfile } = useUserStore();
    const [selected, setSelected] = useState<UserPersona[]>(userProfile?.persona_type || []);

    const handleSelect = (id: UserPersona) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((p) => p !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleContinue = () => {
        if (selected.length > 0) {
            setUserProfile({
                ...userProfile,
                persona_type: selected
            });

            // If 'FAMILY' is selected, go to Family Setup (Step 2), otherwise skip to Currency (Step 3)
            if (selected.includes('FAMILY')) {
                setOnboardingStep(2);
            } else {
                setOnboardingStep(3);
            }
        }
    };

    return (
        <div className="flex flex-col items-center animate-fade-in-up w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center">
                ¿Cuál te describe mejor?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
                Puedes seleccionar varias opciones. Personalizaremos Onyx según tu perfil.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-10 cursor-pointer">
                {PROFILES.map((profile) => {
                    const isSelected = selected.includes(profile.id);
                    return (
                        <div
                            key={profile.id}
                            onClick={() => handleSelect(profile.id)}
                            className={`relative p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] ${isSelected
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500 shadow-md transform scale-[1.02]'
                                : 'border-gray-100 dark:border-onyx-700 bg-white dark:bg-onyx-800 hover:border-indigo-200 dark:hover:border-indigo-800'
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 text-indigo-600 dark:text-indigo-400 animate-scale-in">
                                    <CheckCircle2 className="w-5 h-5 fill-indigo-100 dark:fill-indigo-900" />
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${profile.color} flex items-center justify-center shadow-md mb-4`}>
                                <profile.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{profile.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                {profile.desc}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between w-full max-w-md">
                <button
                    onClick={() => setOnboardingStep(0)}
                    className="px-6 py-3 text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                    Atrás
                </button>

                <button
                    onClick={handleContinue}
                    disabled={selected.length === 0}
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${selected.length > 0
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-onyx-700 dark:text-gray-500'
                        }`}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default ProfileSelectionStep;
