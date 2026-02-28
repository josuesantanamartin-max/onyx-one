import {
    PiggyBank, Utensils, Heart, Calendar, ArrowRight, Check,
    Zap, Shield, Play, Home, Plane, Lock, Sparkles,
    Layers, ArrowLeft, ChevronRight, Globe, Users, ChevronDown, TrendingDown, CreditCard, LayoutDashboard,
    Smartphone, BarChart3, Fingerprint, Cloud, LogIn
} from 'lucide-react';
import React from 'react';
import { Language } from '../../../types';

type ProductKey = 'finance' | 'vida' | 'dashboard';

// Helper components
export const WalletIconMock = ({ className }: { className?: string }) => <CreditCard className={className} />;

export const LANDING_TEXTS = {
    ES: {
        heroBadge: "Aliseus: Sistema Integral Inteligente",
        heroTitle: "Aliseus",
        heroSubtitle: "La tranquilidad de tu familia.\nDeja de usar 10 apps diferentes. Pásate al sistema que lo conecta todo.",
        ctaStart: "Empezar Ahora",
        ctaDemo: "Probar Demo (Sin Cuenta)",
        pillarsTitle: "El Ecosistema Aliseus",
        pillarsSubtitle: "No son apps sueltas. Son módulos conectados por un cerebro central.",
        ecosystemTag: "Aliseus Sync™",
        ecosystemTitle: "Tu centro de mando\nhiper-conectado.",
        ecosystemDesc: "Imagina que tu calendario de cenas sabe tu presupuesto de supermercado. Aliseus lo hace posible. Una visión 360° de tu vida en tiempo real.",
        benefitsTitle: "Diseñado para la Tranquilidad Mental",
        benefitsSubtitle: "Recupera el control de tu tiempo y tu dinero con una herramienta profesional.",
        pricingTitle: "Inversión Inteligente",
        pricingSubtitle: "14 días de prueba gratis. Después, elige tu plan.",
        promoBadge: "🔥 14 días de prueba gratuita con acceso completo",

        // Billing Toggles
        billingMonthly: "Mensual",
        billingAnnual: "Anual",
        savePercent: "Ahorra ~45%",

        // TIER 1: TRIAL
        trialPlan: "Prueba Gratuita",
        trialPrice: "0€",
        trialPeriod: "14 días",
        trialDesc: "Acceso total para probar Aliseus sin compromiso.",
        trialCta: "Empezar Gratis",

        // TIER 2: PERSONAL
        personalPlan: "Personal",
        personalPriceMonthly: "2,99€",
        personalPriceAnnual: "19,99€",
        personalDesc: "Todo el poder de Aliseus para un solo usuario.",
        personalCta: "Empezar Personal",

        // TIER 3: FAMILY
        familyPlan: "Familia",
        familyPriceMonthly: "3,99€",
        familyPriceAnnual: "24,99€",
        familyDesc: "Hasta 5 miembros con colaboración en tiempo real.",
        familyCta: "Empezar Familia",

        // Features
        featUser1: "1 Usuario",
        featUser5: "Hasta 5 Usuarios",
        featAccess: "Acceso Total",
        featVault: "Bóveda Segura",
        featShared: "Espacios Compartidos",
        featJunior: "Modo Junior",
        featPriority: "Soporte Prioritario",

        btnEnter: "Entrar",
        backToSuite: "Volver al Sistema",
        startWith: "Explorar",
        navPillars: "Módulos",
        navEco: "Dashboard",
        navPricing: "Precios",
        perYear: "/ año",
        perMonth: "/ mes",
        singlePayment: "Pago Anual Único",
        loginGoogle: "Continuar con Google",
        loginApple: "Continuar con Apple",
        footerPrivacy: "Privacidad",
        footerTerms: "Términos",
        footerTwitter: "Twitter"
    },
    EN: {
        heroBadge: "Aliseus: Integral Smart System",
        heroTitle: "Aliseus",
        heroSubtitle: "Peace of mind for your family.\nStop using 10 different apps. Switch to the system that connects it all.",
        ctaStart: "Get Started",
        ctaDemo: "Try Demo (No Account)",
        pillarsTitle: "The Aliseus Ecosystem",
        pillarsSubtitle: "Not just apps. Modules connected by a central brain.",
        ecosystemTag: "Aliseus Sync™",
        ecosystemTitle: "Your hyper-connected\ncommand center.",
        ecosystemDesc: "Imagine your dinner calendar knowing your grocery budget. Aliseus makes it possible. A 360° view of your life in real-time.",
        benefitsTitle: "Designed for Peace of Mind",
        benefitsSubtitle: "Reclaim control of your time and money with a professional tool.",
        pricingTitle: "Smart Investment",
        pricingSubtitle: "14-day free trial with full access. Then choose your plan.",
        promoBadge: "🔥 14-day free trial with full access",

        // Billing Toggles
        billingMonthly: "Monthly",
        billingAnnual: "Annual",
        savePercent: "Save ~45%",

        // TIER 1: TRIAL
        trialPlan: "Free Trial",
        trialPrice: "€0",
        trialPeriod: "14 days",
        trialDesc: "Full access to try Aliseus, no commitment.",
        trialCta: "Start Free",

        // TIER 2: PERSONAL
        personalPlan: "Personal",
        personalPriceMonthly: "€2.99",
        personalPriceAnnual: "€19.99",
        personalDesc: "All the power of Aliseus for a single user.",
        personalCta: "Start Personal",

        // TIER 3: FAMILY
        familyPlan: "Family",
        familyPriceMonthly: "€3.99",
        familyPriceAnnual: "€24.99",
        familyDesc: "Up to 5 members with real-time collaboration.",
        familyCta: "Start Family",

        // Features
        featUser1: "1 User",
        featUser5: "Up to 5 Users",
        featAccess: "Full Access",
        featVault: "Secure Vault",
        featShared: "Shared Spaces",
        featJunior: "Junior Mode",
        featPriority: "Priority Support",

        btnEnter: "Log In",
        backToSuite: "Back to System",
        startWith: "Explore",
        navPillars: "Modules",
        navEco: "Dashboard",
        navPricing: "Pricing",
        perYear: "/ year",
        perMonth: "/ month",
        singlePayment: "Single Annual Payment",
        loginGoogle: "Continue with Google",
        loginApple: "Continue with Apple",
        footerPrivacy: "Privacy",
        footerTerms: "Terms",
        footerTwitter: "Twitter"
    },
    FR: {
        heroBadge: "Aliseus : Système Intégral Intelligent",
        heroTitle: "Aliseus",
        heroSubtitle: "La tranquillité pour votre famille.\nArrêtez d'utiliser 10 applications différentes. Passez au système qui connecte tout.",
        ctaStart: "Commencer",
        ctaDemo: "Démo (Sans Compte)",
        pillarsTitle: "L'Écosystème Aliseus",
        pillarsSubtitle: "Pas seulement des applications. Des modules connectés par un cerveau central.",
        ecosystemTag: "Aliseus Sync™",
        ecosystemTitle: "Votre centre de commande\nhyper-connecté.",
        ecosystemDesc: "Imaginez que votre calendrier de dîners connaisse votre budget d'épicerie. Aliseus le rend possible. Une vue à 360° de votre vie en temps réel.",
        benefitsTitle: "Conçu pour la Tranquillité d'Esprit",
        benefitsSubtitle: "Reprenez le contrôle de votre temps et de votre argent avec un outil professionnel.",
        pricingTitle: "Investissement Intelligent",
        pricingSubtitle: "14 jours d'essai gratuit avec accès complet. Ensuite, choisissez votre plan.",
        promoBadge: "🔥 14 jours d'essai gratuit avec accès complet",

        // Billing Toggles
        billingMonthly: "Mensuel",
        billingAnnual: "Annuel",
        savePercent: "Économisez ~45%",

        // TIER 1: TRIAL
        trialPlan: "Essai Gratuit",
        trialPrice: "0€",
        trialPeriod: "14 jours",
        trialDesc: "Accès complet pour tester Aliseus sans engagement.",
        trialCta: "Commencer Gratuit",

        // TIER 2: PERSONAL
        personalPlan: "Personnel",
        personalPriceMonthly: "2,99€",
        personalPriceAnnual: "19,99€",
        personalDesc: "Toute la puissance d'Aliseus pour un seul utilisateur.",
        personalCta: "Commencer Personnel",

        // TIER 3: FAMILY
        familyPlan: "Famille",
        familyPriceMonthly: "3,99€",
        familyPriceAnnual: "24,99€",
        familyDesc: "Jusqu'à 5 membres avec collaboration en temps réel.",
        familyCta: "Commencer Famille",

        // Features
        featUser1: "1 Utilisateur",
        featUser5: "Jusqu'à 5 Utilisateurs",
        featAccess: "Accès Complet",
        featVault: "Coffre Sécurisé",
        featShared: "Espaces Partagés",
        featJunior: "Mode Junior",
        featPriority: "Support Prioritaire",

        btnEnter: "Connexion",
        backToSuite: "Retour au Système",
        startWith: "Explorer",
        navPillars: "Modules",
        navEco: "Dashboard",
        navPricing: "Tarifs",
        perYear: "/ an",
        perMonth: "/ mois",
        singlePayment: "Paiement Annuel Unique",
        loginGoogle: "Continuer avec Google",
        loginApple: "Continuer avec Apple",
        footerPrivacy: "Confidentialité",
        footerTerms: "Conditions",
        footerTwitter: "Twitter"
    }
};

export const PRODUCT_DETAILS_BY_LANG: Record<Language, Record<ProductKey, any>> = {
    ES: {
        finance: {
            title: "Módulo Finanzas",
            subtitle: "Patrimonio Inteligente",
            description: "No es solo un control de gastos. Es tu CFO personal.",
            features: [
                { title: "Smart Categorization", desc: "La IA entiende si es 'Ocio' o 'Necesidad' automáticamente." },
                { title: "Deuda Zero", desc: "Estrategias Avalancha y Bola de Nieve para eliminar pasivos." },
                { title: "Simulador de Futuro", desc: "¿Qué pasa si invierto 100€ más al mes? Aliseus te lo dice." },
                { title: "Límites Reales", desc: "Presupuestos con IA que se adaptan a tu día a día." },
                { title: "Importación CSV", desc: "Importa extractos bancarios y vincúlalos a tus cuentas." },
                { title: "Análisis Predictivo", desc: "Proyecciones a 3, 6 y 12 meses de tu flujo de caja." },
                { title: "Simulador de Jubilación", desc: "Calcula cuánto necesitas ahorrar para tu retiro." }
            ],
            integrations: ["Proyecta impacto de viajes en tu ahorro", "Sincroniza tickets de compra de cocina", "Calcula coste real de cada receta"]
        },
        vida: {
            title: "Módulo Vida",
            subtitle: "Tu Hogar en Autopilot",
            description: "Recupera 5 horas a la semana automatizando las tareas invisibles.",
            features: [
                { title: "Chef IA", desc: "Genera menús semanales basados en lo que tienes en la nevera." },
                { title: "Despensa Inteligente", desc: "Inventario con alertas de caducidad y sugerencias de recetas." },
                { title: "Lista de Compra", desc: "Se genera automáticamente al añadir recetas al menú." },
                { title: "Viajes con IA", desc: "Itinerarios completos con presupuesto y documentos integrados." },
                { title: "Bóveda Encriptada", desc: "Tus contratos y pasaportes, seguros y a mano." },
                { title: "Calendario Familiar", desc: "Eventos, cumpleaños y citas de toda la familia." },
                { title: "Academia Junior", desc: "Enseña a tus hijos el valor del dinero jugando." }
            ],
            integrations: ["Descuenta ingredientes comprados del presupuesto", "Planifica comidas según eventos de agenda", "Gestiona sobras para reducir desperdicio"]
        },
        dashboard: {
            title: "Aura",
            subtitle: "La presencia que lo envuelve todo",
            description: "Aura, la brisa suave que lo impregna todo sin esfuerzo. Tu dashboard personal que emana claridad sobre cada aspecto de tu vida: finanzas, hogar y tiempo, en una sola respiración.",
            features: [
                { title: "Mañana Inteligente", desc: "Resumen diario: qué pagar, qué comer y dónde ir." },
                { title: "Widgets Personalizables", desc: "Drag & drop para componer tu Aura exactamente como la necesitas." },
                { title: "Aliseus Insights", desc: "Análisis proactivo que detecta patrones y te avisa antes de que sean un problema." },
                { title: "Modo Colaborativo", desc: "Hasta 5 miembros con roles y permisos. Una sola Aura para toda la familia." },
                { title: "Navegación Total", desc: "Salta de revisar una factura a planear un viaje en 1 click. Todo al alcance." },
                { title: "Aliseus Brain", desc: "Insights proactivos: 'Gastas mucho en café este mes'. Tu brisa personal de claridad." }
            ],
            integrations: ["El aura que envuelve y conecta Finanzas, Vida y Cocina", "Sincronización en tiempo real con todos tus módulos"]
        }
    },
    EN: {
        finance: {
            title: "Finance Module",
            subtitle: "Intelligent Wealth",
            description: "Not just expense tracking. It's your personal CFO.",
            features: [
                { title: "Smart Categorization", desc: "AI understands if it's 'Leisure' or 'Necessity' automatically." },
                { title: "Zero Debt", desc: "Avalanche and Snowball strategies to eliminate liabilities." },
                { title: "Future Simulator", desc: "What if I invest €100 more? Aliseus tells you." },
                { title: "Real Limits", desc: "AI-powered budgets that adapt to your day." },
                { title: "CSV Import", desc: "Import bank statements and link them to your accounts." },
                { title: "Predictive Analysis", desc: "Cash flow projections at 3, 6 and 12 months." },
                { title: "Retirement Simulator", desc: "Calculate how much you need to save for retirement." }
            ],
            integrations: ["Projects travel impact on savings", "Syncs kitchen grocery receipts", "Calculates real cost per recipe"]
        },
        vida: {
            title: "Life Module",
            subtitle: "Home on Autopilot",
            description: "Reclaim 5 hours a week simply by automating invisible tasks.",
            features: [
                { title: "AI Chef", desc: "Generates weekly menus based on what's in your fridge." },
                { title: "Smart Pantry", desc: "Inventory with expiry alerts and recipe suggestions." },
                { title: "Shopping List", desc: "Auto-generated when you add recipes to your menu." },
                { title: "AI Travel Planner", desc: "Full itineraries with budget and integrated documents." },
                { title: "Encrypted Vault", desc: "Your contracts and passports, safe and handy." },
                { title: "Family Calendar", desc: "Events, birthdays and appointments for the whole family." },
                { title: "Junior Academy", desc: "Teach your kids the value of money through play." }
            ],
            integrations: ["Deducts ingredients from budget", "Plans meals based on calendar events", "Manages leftovers to reduce waste"]
        },
        dashboard: {
            title: "Aura",
            subtitle: "The presence that surrounds everything",
            description: "Aura, the gentle breeze that permeates everything effortlessly. Your personal dashboard that radiates clarity across every aspect of your life: finances, home and time, in a single glance.",
            features: [
                { title: "Smart Morning", desc: "Daily digest: what to pay, what to eat, where to go." },
                { title: "Customizable Widgets", desc: "Drag & drop to compose your Aura exactly as you need it." },
                { title: "Aliseus Insights", desc: "Proactive analysis that detects patterns and alerts you before they become a problem." },
                { title: "Collaborative Mode", desc: "Up to 5 members with roles and permissions. One Aura for the whole family." },
                { title: "Total Navigation", desc: "Jump from checking a bill to planning a trip in 1 click. Everything within reach." },
                { title: "Aliseus Brain", desc: "Proactive insights: 'High coffee spending this month'. Your personal breeze of clarity." }
            ],
            integrations: ["The aura that wraps and connects Finance, Life and Kitchen", "Real-time sync across all your modules"]
        }
    },
    FR: {
        finance: {
            title: "Module Finances",
            subtitle: "Patrimoine Intelligent",
            description: "Plus qu'un suivi de dépenses. Votre DAF personnel.",
            features: [
                { title: "Catégorisation IA", desc: "L'IA comprend si c'est 'Loisir' ou 'Nécessité'." },
                { title: "Dette Zéro", desc: "Stratégies Avalanche et Boule de Neige pour éliminer les passifs." },
                { title: "Simulateur Futur", desc: "Et si j'investis 100€ de plus ? Aliseus vous le dit." },
                { title: "Limites Réelles", desc: "Budgets IA adaptés à votre quotidien." },
                { title: "Import CSV", desc: "Importez des relevés bancaires et associez-les à vos comptes." },
                { title: "Analyse Prédictive", desc: "Projections de trésorerie à 3, 6 et 12 mois." },
                { title: "Simulateur Retraite", desc: "Calculez combien épargner pour votre retraite." }
            ],
            integrations: ["Projette l'impact voyage sur l'épargne", "Synchro tickets cuisine", "Calcule le coût réel par recette"]
        },
        vida: {
            title: "Module Vie",
            subtitle: "Maison en Autopilote",
            description: "Gagnez 5h par semaine en automatisant l'invisible.",
            features: [
                { title: "Chef IA", desc: "Menus hebdomadaires basés sur le contenu du frigo." },
                { title: "Garde-manger Intelligent", desc: "Inventaire avec alertes péremption et suggestions." },
                { title: "Liste de Courses", desc: "Générée automatiquement en ajoutant des recettes." },
                { title: "Planificateur Voyage IA", desc: "Itinéraires complets avec budget et documents." },
                { title: "Coffre Chiffré", desc: "Contrats et passeports, sûrs et à portée de main." },
                { title: "Calendrier Familial", desc: "Événements, anniversaires et rendez-vous." },
                { title: "Académie Junior", desc: "Apprenez la valeur de l'argent par le jeu." }
            ],
            integrations: ["Déduit ingrédients du budget", "Planifie repas selon agenda", "Gère les restes pour réduire le gaspillage"]
        },
        dashboard: {
            title: "Aura",
            subtitle: "La présence qui enveloppe tout",
            description: "Aura, la brise douce qui imprègne tout sans effort. Votre tableau de bord personnel qui irradie la clarté sur chaque aspect de votre vie : finances, maison et temps, en un seul souffle.",
            features: [
                { title: "Matin Malin", desc: "Résumé : à payer, à manger, où aller." },
                { title: "Widgets Personnalisables", desc: "Glissez-déposez pour composer votre Aura exactement comme vous en avez besoin." },
                { title: "Aliseus Insights", desc: "Analyse proactive qui détecte les tendances avant qu'elles ne deviennent un problème." },
                { title: "Mode Collaboratif", desc: "Jusqu'à 5 membres avec rôles. Une seule Aura pour toute la famille." },
                { title: "Navigation Totale", desc: "Passez d'une facture à un voyage en 1 clic. Tout à portée de main." },
                { title: "Cerveau Aliseus", desc: "Insights proactifs : 'Trop de café ce mois-ci'. Votre brise personnelle de clarté." }
            ],
            integrations: ["L'aura qui relie Finances, Vie et Cuisine", "Synchronisation en temps réel dans tous vos modules"]
        }
    }
};
