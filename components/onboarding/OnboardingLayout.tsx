import React from 'react';

interface OnboardingLayoutProps {
    children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-onyx-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white dark:bg-onyx-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-onyx-800">
                {/* Logo Header */}
                <div className="p-8 border-b border-gray-100 dark:border-onyx-800 flex justify-center">
                    <h1 className="text-2xl font-black text-onyx-900 dark:text-white tracking-tight">
                        Onyx<span className="text-indigo-600 dark:text-indigo-400">Suite</span>
                    </h1>
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-12 min-h-[500px] flex flex-col">
                    {children}
                </div>
            </div>

            {/* Footer / Legal */}
            <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
                © 2026 Onyx Suite. Configuración inicial segura.
            </div>
        </div>
    );
};

export default OnboardingLayout;
