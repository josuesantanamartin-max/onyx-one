import React from 'react';
import { ArrowLeft, Scale, FileText, AlertTriangle, Copyright } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

interface TermsOfServiceProps {
    onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-gray-900 dark:text-white">
                        <Scale className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                        {language === 'ES' ? 'Términos de Servicio' : 'Terms of Service'}
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {language === 'ES'
                            ? 'Acuerdo de licencia y uso de Aliseus.'
                            : 'Licensing and usage agreement for Aliseus.'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2 font-mono">
                        Last updated: January 16, 2026
                    </p>
                </div>

                <div className="space-y-12 text-gray-600 dark:text-gray-300 leading-relaxed">

                    {/* SECTION 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            1. Acceptance of Terms
                        </h2>
                        <p className="mb-4">
                            {language === 'ES'
                                ? 'Al acceder y utilizar Aliseus ("la Aplicación"), usted acepta estar legalmente vinculado por estos Términos. Si no está de acuerdo con alguna parte de los términos, no podrá acceder a la Aplicación.'
                                : 'By accessing and using Aliseus ("the Application"), you agree to be legally bound by these Terms. If you do not agree with any part of the terms, you may not access the Application.'}
                        </p>
                    </section>

                    {/* SECTION 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Copyright className="w-6 h-6 text-blue-500" />
                            2. Intellectual Property
                        </h2>
                        <p className="mb-4">
                            {language === 'ES'
                                ? 'La Aplicación y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Aliseus y sus licenciantes. La Aplicación está protegida por derechos de autor, marcas registradas y otras leyes tanto de España como de países extranjeros.'
                                : 'The Application and its original content, features, and functionality are and will remain the exclusive property of Aliseus and its licensors. The Application is protected by copyright, trademark, and other laws of both Spain and foreign countries.'}
                        </p>
                    </section>

                    {/* SECTION 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                            3. Limitation of Liability
                        </h2>
                        <p className="mb-4">
                            {language === 'ES'
                                ? 'En ningún caso Aliseus, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de su acceso o uso o de la imposibilidad de acceder o utilizar la Aplicación.'
                                : 'In no event shall Aliseus, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Application.'}
                        </p>
                    </section>

                    <div className="p-6 bg-gray-50 dark:bg-onyx-900 rounded-2xl border border-gray-100 dark:border-onyx-800 mt-12">
                        <p className="text-sm">
                            {language === 'ES'
                                ? 'Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que entren en vigor los nuevos términos.'
                                : 'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.'}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
