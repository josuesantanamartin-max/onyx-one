import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Server, Cookie } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

interface PrivacyPolicyProps {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    const { language } = useUserStore();

    return (
        <div className="bg-white dark:bg-onyx-950 min-h-full p-6 md:p-12 animate-fade-in custom-scrollbar overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">
                        {language === 'ES' ? 'Volver a Ajustes' : 'Back to Settings'}
                    </span>
                </button>

                <div className="mb-12">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                        {language === 'ES' ? 'Política de Privacidad' : 'Privacy Policy'}
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {language === 'ES'
                            ? 'En Aliseus, la privacidad no es una opción, es la base de nuestra arquitectura.'
                            : 'At Aliseus, privacy is not an option, it is the foundation of our architecture.'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2 font-mono">
                        Last updated: January 16, 2026
                    </p>
                </div>

                <div className="space-y-12 text-gray-600 dark:text-gray-300 leading-relaxed">

                    {/* SECTION 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-indigo-500" />
                            1. Data Collection & Local First
                        </h2>
                        <p className="mb-4">
                            {language === 'ES'
                                ? 'Aliseus opera bajo una filosofía "Local First" (Primero Local). Esto significa que la gran mayoría de sus datos financieros y personales se almacenan exclusivamente en el almacenamiento local de su dispositivo (LocalStorage/IndexedDB) y no se transmiten a nuestros servidores a menos que active explícitamente las funciones de sincronización en la nube.'
                                : 'Aliseus operates under a "Local First" philosophy. This means that the vast majority of your financial and personal data is stored exclusively in your device\'s local storage (LocalStorage/IndexedDB) and is not transmitted to our servers unless you explicitly enable cloud synchronization features.'}
                        </p>
                    </section>

                    {/* SECTION 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Server className="w-6 h-6 text-emerald-500" />
                            2. Cloud Synchronization (Supabase)
                        </h2>
                        <p className="mb-4">
                            {language === 'ES'
                                ? 'Si opta por crear una cuenta y sincronizar sus datos, utilizamos Supabase (un proveedor de Backend-as-a-Service seguro y compatible con GDPR) para almacenar sus datos cifrados. Aliseus no vende, alquila ni comparte sus datos personales con terceros para fines publicitarios.'
                                : 'If you choose to create an account and sync your data, we use Supabase (a secure, GDPR-compliant Backend-as-a-Service provider) to store your encrypted data. Aliseus does not sell, rent, or share your personal data with third parties for advertising purposes.'}
                        </p>
                    </section>

                    {/* SECTION 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Eye className="w-6 h-6 text-purple-500" />
                            3. AI Usage (Google Gemini)
                        </h2>
                        <p className="mb-4">
                            {language === 'ES'
                                ? 'Para proporcionar funciones inteligentes (como el análisis de gastos y sugerencias de recetas), enviamos fragmentos anonimizados de sus datos a la API de Google Gemini. Estos datos son efímeros y no se utilizan para reentrenar los modelos públicos de Google. Usted tiene el control total para desactivar estas funciones de IA en cualquier momento.'
                                : 'To provide intelligent features (such as expense analysis and recipe suggestions), we send anonymized snippets of your data to the Google Gemini API. This data is ephemeral and is not used to retrain Google\'s public models. You have full control to disable these AI features at any time.'}
                        </p>
                    </section>

                    {/* SECTION 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Cookie className="w-6 h-6 text-orange-500" />
                            4. Cookies & Storage
                        </h2>
                        <p className="mb-4">
                            {language === 'ES'
                                ? 'Utilizamos almacenamiento local estrictamente necesario para recordar su sesión, sus preferencias de idioma y tema (oscuro/claro). No utilizamos cookies de rastreo de terceros.'
                                : 'We use strictly necessary local storage to remember your session, language preferences, and theme (dark/light). We do not use third-party tracking cookies.'}
                        </p>
                    </section>

                    <div className="p-6 bg-gray-50 dark:bg-onyx-900 rounded-2xl border border-gray-100 dark:border-onyx-800 mt-12">
                        <p className="font-bold text-gray-900 dark:text-white mb-2">
                            {language === 'ES' ? 'Contacto y Derechos ARCO' : 'Contact & GDPR Rights'}
                        </p>
                        <p className="text-sm">
                            {language === 'ES'
                                ? 'Para ejercer sus derechos de acceso, rectificación, cancelación u oposición, contacte a: privacy@aliseus.com'
                                : 'To exercise your rights of access, rectification, cancellation, or opposition, contact: privacy@aliseus.com'}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
