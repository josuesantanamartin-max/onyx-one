import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { language } = useUserStore();

    useEffect(() => {
        const consent = localStorage.getItem('onyx_cookie_consent');
        if (!consent) {
            // Small delay for better UX (don't show immediately on load)
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('onyx_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const text = {
        ES: {
            title: 'Usamos Cookies',
            desc: 'Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y recordar tus preferencias. No vendemos tus datos.',
            accept: 'Aceptar',
            decline: 'Rechazar'
        },
        EN: {
            title: 'We use Cookies',
            desc: 'We use cookies to enhance your experience, analyze traffic, and remember your preferences. We do not sell your data.',
            accept: 'Accept',
            decline: 'Decline'
        },
        FR: {
            title: 'Nous utilisons des Cookies',
            desc: 'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et mémoriser vos préférences.',
            accept: 'Accepter',
            decline: 'Refuser'
        }
    };

    const t = text[language as keyof typeof text] || text['ES'];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in-up">
            <div className="max-w-4xl mx-auto bg-white dark:bg-onyx-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-onyx-800 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-full flex-shrink-0">
                    <Cookie className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {t.desc} <a href="/privacy" className="underline hover:text-indigo-600 transition-colors">Leer Política</a>.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsVisible(false)} // Just dismiss for now, can implement "Rejection" logic
                        className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-onyx-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-onyx-800 transition-colors"
                    >
                        {t.decline}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Check className="w-3 h-3" />
                        {t.accept}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
