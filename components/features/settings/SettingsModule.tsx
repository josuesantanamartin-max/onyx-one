import React, { useState, useRef } from 'react';
import { useUserStore } from '../../../store/useUserStore';
import { useLifeStore } from '../../../store/useLifeStore';
import { useFinanceStore } from '../../../store/useFinanceStore';
import {
  User, CreditCard, Shield, Globe, Lock,
  Check, Coins, Star, Download, Smartphone, Plus, Trash2, Camera, Upload, Layers, Zap, ArrowRight, Pencil, Menu, ExternalLink,
  Calendar, FileJson, Layout, FileText, Key, LogOut
} from 'lucide-react';
import { FamilyMember, CategoryStructure, AutomationRule } from '../../../types';
import PricingSection from './PricingSection';
import { stripeService } from '../../../services/stripeService';
import { supabase } from '../../../services/supabaseClient';
import { DEFAULT_WIDGETS } from '../../../constants';
import PrivacyPolicy from '../../pages/PrivacyPolicy';
import TermsOfService from '../../pages/TermsOfService';
import { HouseholdManager } from '../collaboration/HouseholdManager';
import { MemberManagement } from '../collaboration/MemberManagement';
import { HouseholdChat } from '../collaboration/HouseholdChat';
import PrivacySettings from './PrivacySettings';
import { useSampleData } from '../../../hooks/useSampleData';
import SampleDataSection from './SampleDataSection';
import BackupSettings from './BackupSettings';

interface SettingsModuleProps {
  onMenuClick?: () => void;
}

const TEXTS: any = {
  ES: {
    title: 'Ajustes de la Suite',
    subtitle: 'Configuración Global',
    menu: {
      profile: 'Mi Perfil y Familia',
      general: 'Preferencias',
      categories: 'Categorías',
      automation: 'Automatización',
      subscription: 'Suscripción',
      billing: 'Facturación',
      security: 'Seguridad',
      personalization: 'Personalización',
      privacy: 'Privacidad',
      backups: 'Backups'
    },
    sections: {
      profileDesc: 'Gestiona tu identidad y los miembros de tu unidad familiar.',
      generalDesc: 'Idioma, moneda y configuración regional.',
      persDesc: 'Temas, apariencia y organización del dashboard.',
      catDesc: 'Personaliza tu estructura de ingresos y gastos.',
      autoDesc: 'Crea reglas para automatizar alertas y categorización.',
      subDesc: 'Gestiona tu plan Aliseus.',
      billDesc: 'Métodos de pago y facturas.',
      secDesc: 'Contraseñas, autenticación de dos factores y zona de peligro.'
    },
    personalization: {
      theme: 'Tema de la Interfaz',
      themeDesc: 'Elige cómo se ve Aliseus.',
      layout: 'Diseño del Dashboard',
      layoutDesc: 'Gestiona los widgets de tu pantalla principal.',
      resetLayout: 'Restaurar Diseño Original',
      resetLayoutDesc: 'Vuelve a la configuración inicial de widgets (visible y orden).'
    },
    plan: {
      current: 'Plan Actual',
      pro: 'Onyx Familia',
      free: 'Onyx Basic',
      features: 'Características',
      upgrade: 'Mejorar Plan',
      nextBill: 'Próxima renovación',
      manage: 'Gestionar Suscripción',
      price: '2,99€',
      freq: '/ mes',
      billDate: '12 Oct 2025'
    },
    billing: {
      methods: 'Métodos de Pago',
      add: 'Añadir Método',
      history: 'Historial de Facturas',
      download: 'Descargar'
    },
    featuresList: [
      'Hasta 5 Usuarios',
      'Onyx Vault Compartido',
      'Espacios Compartidos y Roles',
      'Onyx Junior (Modo Niños)',
      'Soporte Prioritario',
      'Modo Offline'
    ],
    resetZone: 'Zona de Peligro',
    resetBtn: 'Restaurar Sistema (Borrar Datos)',
    resetDesc: 'Esto borrará todos los datos locales y recargará la versión de demostración.'
  },
  EN: {
    title: 'Suite Settings',
    subtitle: 'Global Configuration',
    menu: {
      profile: 'My Profile & Family',
      general: 'Preferences',
      categories: 'Categories',
      automation: 'Automation',
      subscription: 'Subscription',
      billing: 'Billing',
      security: 'Security',
      personalization: 'Personalization',
      privacy: 'Privacy'
    },
    sections: {
      profileDesc: 'Manage your identity and family unit members.',
      generalDesc: 'Language, currency and region.',
      persDesc: 'Themes, appearance and dashboard organization.',
      catDesc: 'Customize your income and expense structure.',
      autoDesc: 'Create rules to automate alerts and categorization.',
      subDesc: 'Manage your Aliseus plan.',
      billDesc: 'Payment methods and invoices.',
      secDesc: 'Passwords, 2FA and danger zone.'
    },
    personalization: {
      theme: 'Interface Theme',
      themeDesc: 'Choose how Aliseus looks.',
      layout: 'Dashboard Layout',
      layoutDesc: 'Manage your home screen widgets.',
      resetLayout: 'Reset Original Layout',
      resetLayoutDesc: 'Return to initial widget configuration (visibility and order).'
    },
    plan: {
      current: 'Current Plan',
      pro: 'Onyx Family',
      free: 'Onyx Basic',
      features: 'Features',
      upgrade: 'Upgrade Plan',
      nextBill: 'Next renewal',
      manage: 'Manage Subscription',
      price: '€2.99',
      freq: '/ month',
      billDate: 'Oct 12, 2025'
    },
    billing: {
      methods: 'Payment Methods',
      add: 'Add Method',
      history: 'Invoice History',
      download: 'Download'
    },
    featuresList: [
      'Up to 5 Users',
      'Shared Onyx Vault',
      'Shared Spaces & Roles',
      'Onyx Junior (Kids Mode)',
      'Priority Support',
      'Offline Mode'
    ],
    resetZone: 'Danger Zone',
    resetBtn: 'System Reset (Clear Data)',
    resetDesc: 'This will wipe all local data and reload the demo version.'
  },
  FR: {
    title: 'Paramètres Suite',
    subtitle: 'Configuration Globale',
    menu: {
      profile: 'Mon Profil et Famille',
      general: 'Préférences',
      categories: 'Catégories',
      automation: 'Automatisation',
      subscription: 'Abonnement',
      billing: 'Facturation',
      security: 'Sécurité',
      personalization: 'Personnalisation',
      privacy: 'Confidentialité'
    },
    sections: {
      profileDesc: 'Gérez votre identité et les membres de la famille.',
      generalDesc: 'Langue, devise et région.',
      persDesc: 'Thèmes, apparence et organisation du tableau de bord.',
      catDesc: 'Personnalisez votre structure de revenus et dépenses.',
      autoDesc: 'Créez des règles pour automatiser les alertes.',
      subDesc: 'Gérer votre plan Aliseus.',
      billDesc: 'Méthodes de paiement et factures.',
      secDesc: 'Mots de passe, 2FA et zone de danger.'
    },
    personalization: {
      theme: 'Thème de l\'interface',
      themeDesc: 'Choisissez l\'apparence d\'Aliseus.',
      layout: 'Disposition du tableau de bord',
      layoutDesc: 'Gérez vos widgets d\'écran d\'accueil.',
      resetLayout: 'Rétablir la disposition',
      resetLayoutDesc: 'Revenir à la configuration initiale des widgets.'
    },
    plan: {
      current: 'Plan Actuel',
      pro: 'Onyx Famille',
      free: 'Onyx Basic',
      features: 'Fonctionnalités',
      upgrade: 'Mettre à niveau',
      nextBill: 'Prochain renouvellement',
      manage: 'Gérer l\'abonnement',
      price: '2,99€',
      freq: '/ mois',
      billDate: '12 Oct 2025'
    },
    billing: {
      methods: 'Méthodes de Paiement',
      add: 'Ajouter Méthode',
      history: 'Historique des factures',
      download: 'Télécharger'
    },
    featuresList: [
      'Jusqu\'à 5 Utilisateurs',
      'Onyx Vault Partagé',
      'Espaces Partagés et Rôles',
      'Onyx Junior (Mode Enfants)',
      'Support Prioritaire',
      'Mode Hors Ligne'
    ],
    resetZone: 'Zone de Danger',
    resetBtn: 'Réinitialiser Système',
    resetDesc: 'Ceci effacera toutes les données locales et rechargera la démo.'
  }
};

const SettingsModule: React.FC<SettingsModuleProps> = ({ onMenuClick }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const categoryFormRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Legal Pages State
  const [activeLegalPage, setActiveLegalPage] = useState<'PRIVACY' | 'TERMS' | null>(null);

  // Store Hooks
  const {
    language, setLanguage,
    currency, setCurrency,
    theme, setTheme,
    setDashboardWidgets,
    automationRules, setAutomationRules,
    subscription,
    userProfile, setUserProfile
  } = useUserStore();

  const { familyMembers, setFamilyMembers } = useLifeStore();
  const { categories, setCategories } = useFinanceStore();

  // NEW: Calculate Stats for Profile
  const totalTransactions = useFinanceStore(state => state.transactions.length);
  const totalGoals = useFinanceStore(state => state.goals.length);
  const totalRecipes = useLifeStore(state => state.weeklyPlans.reduce((acc, plan) => acc + plan.meals.length, 0)); // Approx activity
  const joinDate = userProfile?.id ? 'Enero 2025' : 'Oct 2024'; // Mock for now or from DB

  const handleExportData = () => {
    const data = {
      userProfile: useUserStore.getState().userProfile,
      finance: {
        transactions: useFinanceStore.getState().transactions,
        accounts: useFinanceStore.getState().accounts,
        budgets: useFinanceStore.getState().budgets,
        goals: useFinanceStore.getState().goals,
        debts: useFinanceStore.getState().debts,
        categories: useFinanceStore.getState().categories,
      },
      life: {
        pantryItems: useLifeStore.getState().pantryItems,
        shoppingList: useLifeStore.getState().shoppingList,
        familyMembers: useLifeStore.getState().familyMembers,
        weeklyPlans: useLifeStore.getState().weeklyPlans,
      },
      settings: {
        language: useUserStore.getState().language,
        currency: useUserStore.getState().currency,
        automationRules: useUserStore.getState().automationRules,
      },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onyx_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Family Form
  const [isFamilyFormOpen, setIsFamilyFormOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'PARENT' | 'CHILD'>('CHILD');
  const [newMemberBirth, setNewMemberBirth] = useState('');
  const [newMemberImage, setNewMemberImage] = useState<string>('');

  // Category Form
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [newSubCat, setNewSubCat] = useState('');

  // Profile Edit State
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfileAvatar, setEditProfileAvatar] = useState('');

  // Init profile edit state when opening modal
  const handleOpenProfileEdit = () => {
    setEditProfileName(userProfile?.full_name || '');
    setEditProfileAvatar(userProfile?.avatar_url || '');
    setIsProfileEditOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!supabase) return;

      const updates = {
        full_name: editProfileName,
        avatar_url: editProfileAvatar,
      };

      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;

      // Update local store
      setUserProfile({
        ...userProfile,
        ...updates
      });

      setIsProfileEditOpen(false);
      alert('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar perfil: ' + error.message);
    }
  };

  // --- DELETE ACCOUNT LOGIC ---
  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      language === 'ES'
        ? "POR FAVOR ESCRIBE 'DELETE' PARA CONFIRMAR EL BORRADO DE TU CUENTA. ESTA ACCIÓN ES IRREVERSIBLE."
        : "PLEASE TYPE 'DELETE' TO CONFIRM ACCOUNT DELETION. THIS ACTION IS IRREVERSIBLE."
    );

    if (confirmation === 'DELETE') {
      const t = TEXTS[language as string] || TEXTS['ES'];
      // Simulation for MVP
      localStorage.clear();
      alert(language === 'ES' ? 'Cuenta eliminada. Hasta siempre.' : 'Account deleted. Goodbye.');
      window.location.reload();
    }
  };

  // Rule Form
  const [newRuleTrigger, setNewRuleTrigger] = useState<AutomationRule['trigger']>('TRANSACTION_OVER_AMOUNT');
  const [newRuleThreshold, setNewRuleThreshold] = useState('100');
  const [newRuleAction, setNewRuleAction] = useState<AutomationRule['action']>('SEND_ALERT');

  const t = TEXTS[language as string] || TEXTS['ES'];

  const handleResetSystem = () => {
    const confirmText = window.prompt(`Escribe CONFIRMAR para proceder:\n\nWARNING: ${t.resetDesc}`);
    if (confirmText === "CONFIRMAR") {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMemberImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;
    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName,
      relationship: newMemberRole === 'PARENT' ? 'Madre/Padre' : 'Hijo/a',
      role: newMemberRole,
      avatar: newMemberImage || (newMemberRole === 'PARENT' ? '👤' : '👶'),
      birthDate: newMemberBirth,
      balance: 0,
      weeklyAllowance: newMemberRole === 'CHILD' ? 5 : 0,
      growthHistory: []
    };
    setFamilyMembers((prev) => [...prev, newMember]);
    setIsFamilyFormOpen(false);
    setNewMemberName('');
    setNewMemberBirth('');
    setNewMemberImage('');
  };

  const handleDeleteMember = (id: string) => {
    const confirmText = window.prompt("Escribe ELIMINAR para borrar el historial de este miembro.");
    if (confirmText === "ELIMINAR") {
      setFamilyMembers((prev) => prev.filter(m => m.id !== id));
    }
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return '--';
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleEditCategoryClick = (cat: CategoryStructure) => {
    setEditingCatId(cat.id);
    setNewCatName(cat.name);
    setNewCatType(cat.type);
    setNewSubCat(cat.subCategories.join(', '));
    categoryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const subCategoriesList = newSubCat
      ? newSubCat.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    if (editingCatId) {
      setCategories((prev) => prev.map(c => c.id === editingCatId ? {
        ...c,
        name: newCatName,
        type: newCatType,
        subCategories: subCategoriesList
      } : c));
    } else {
      const newCat: CategoryStructure = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCatName,
        type: newCatType,
        subCategories: subCategoriesList
      };
      setCategories((prev) => [...prev, newCat]);
    }
    resetCategoryForm();
  };

  const resetCategoryForm = () => {
    setEditingCatId(null);
    setNewCatName('');
    setNewSubCat('');
    setNewCatType('EXPENSE');
  };

  const handleDeleteCategory = (id: string) => {
    const confirmText = window.prompt("Escribe ELIMINAR para borrar esta categoría.");
    if (confirmText === "ELIMINAR") {
      setCategories((prev) => prev.filter(c => c.id !== id));
    }
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();

    let name = '';
    if (newRuleTrigger === 'TRANSACTION_OVER_AMOUNT') name = `Alerta gasto > ${newRuleThreshold}€`;
    if (newRuleTrigger === 'TRIP_CREATED') name = `Auto-categoría Viajes`;

    const newRule: AutomationRule = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      trigger: newRuleTrigger,
      threshold: parseFloat(newRuleThreshold),
      action: newRuleAction,
      isActive: true
    };

    setAutomationRules((prev) => [...prev, newRule]);
  };

  const handleToggleRule = (id: string) => {
    setAutomationRules((prev) => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleDeleteRule = (id: string) => {
    setAutomationRules((prev) => prev.filter(r => r.id !== id));
  };

  const renderSidebar = () => (
    <div className="w-full md:w-64 bg-white/80 dark:bg-onyx-950/80 backdrop-blur-xl border-r border-gray-100 dark:border-onyx-800 flex-shrink-0 md:h-full overflow-y-auto">
      <div className="p-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{t.title}</h2>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{t.subtitle}</p>
      </div>
      <nav className="px-4 space-y-2 pb-8">
        {[
          { id: 'profile', icon: User, label: t.menu.profile },
          { id: 'general', icon: Globe, label: t.menu.general },
          { id: 'personalization', icon: Layout, label: t.menu.personalization },
          { id: 'privacy', icon: Lock, label: t.menu.privacy },
          { id: 'categories', icon: Layers, label: t.menu.categories },
          { id: 'automation', icon: Zap, label: t.menu.automation },
          { id: 'subscription', icon: Star, label: t.menu.subscription },
          { id: 'billing', icon: CreditCard, label: t.menu.billing },
          { id: 'security', icon: Shield, label: t.menu.security },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden group ${activeSection === item.id
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl shadow-gray-200 dark:shadow-none translate-x-1'
              : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-onyx-900 hover:text-gray-700 dark:hover:text-white hover:translate-x-1 border border-transparent hover:border-gray-100 dark:hover:border-onyx-800'
              }`}
          >
            {activeSection === item.id && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>}
            <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-rose-400 dark:text-rose-500' : 'group-hover:text-gray-700 dark:group-hover:text-gray-300'} transition-colors relative z-10`} />
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  if (activeLegalPage === 'PRIVACY') {
    return <PrivacyPolicy onBack={() => setActiveLegalPage(null)} />;
  }

  if (activeLegalPage === 'TERMS') {
    return <TermsOfService onBack={() => setActiveLegalPage(null)} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="max-w-3xl space-y-8 animate-fade-in pb-12">

            {/* 1. PREMIUM HEADER */}
            <div className="relative mb-8 animate-fade-in rounded-[2.5rem] overflow-hidden bg-gray-900 dark:bg-onyx-950 border border-gray-800 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-gray-900"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-center gap-8">
                <div className="relative group cursor-pointer" onClick={handleOpenProfileEdit}>
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 p-2 rounded-full backdrop-blur-md shadow-2xl relative">
                    <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden relative">
                      {userProfile?.avatar_url ? (
                        <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <User className="w-16 h-16" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 p-3 bg-indigo-500 rounded-full text-white shadow-lg border-4 border-gray-900 hover:bg-indigo-400 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-center md:text-left flex-1">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r rounded-full mb-3 shadow-lg ${subscription.plan === 'FAMILIA' ? 'from-amber-400 to-orange-500 shadow-orange-500/20' : subscription.plan === 'PERSONAL' ? 'from-indigo-400 to-violet-500 shadow-indigo-500/20' : 'from-gray-400 to-gray-500 shadow-gray-500/20'}`}>
                    <Star className="w-3 h-3 text-white fill-white" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">
                      {subscription.plan === 'FAMILIA' ? 'Onyx Premium' : subscription.plan === 'PERSONAL' ? 'Onyx Pro' : 'Onyx Basic'}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-3 drop-shadow-md">
                    {userProfile?.full_name || 'Usuario Onyx'}
                  </h2>
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 text-gray-300 font-medium text-sm">
                    <span className="text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-lg backdrop-blur-md border border-indigo-500/30 text-xs">
                      @{userProfile?.email?.split('@')[0] || 'onyx_user'}
                    </span>
                    <span className="hidden md:inline text-gray-500">•</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{userProfile?.email || 'user@aliseus.com'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PREMIUM STATS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-gray-100 dark:border-onyx-800 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{totalTransactions}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Transacciones</span>
              </div>
              <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-gray-100 dark:border-onyx-800 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{totalGoals}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Metas Logradas</span>
              </div>
              <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-gray-100 dark:border-onyx-800 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{familyMembers.length}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Miembros</span>
              </div>
              <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-gray-100 dark:border-onyx-800 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter pt-1 pb-1">{joinDate}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Desde</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 3. HOUSEHOLD & COLLABORATION (Real) */}
            <div className="space-y-12">
              {/* Bóveda de Datos */}
              <div className="bg-gray-900 dark:bg-onyx-950 p-8 md:p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2 block">Bóveda de Seguridad</span>
                    <h4 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3 mb-3">
                      <Shield className="w-8 h-8 text-emerald-500" /> Exportar Datos
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium max-w-lg">
                      Eres el único dueño de tu información. Genera un paquete cifrado con todo tu historial financiero,
                      configuraciones familiares y registros de Aliseus.
                    </p>
                  </div>
                  <div className="w-full md:w-auto shrink-0">
                    <button onClick={handleExportData} className="w-full md:w-auto px-8 py-5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                      <Download className="w-5 h-5" /> Descargar JSON
                    </button>
                  </div>
                </div>
              </div>

              {/* Household Management */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gestión del Hogar</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <HouseholdManager />
                    <MemberManagement />
                  </div>
                  <div className="lg:h-[600px]">
                    <HouseholdChat />
                  </div>
                </div>
              </div>
            </div>


            {/* EDIT PROFILE MODAL (Styled) */}
            {isProfileEditOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <form onSubmit={handleUpdateProfile} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-fade-in-up relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                  <div className="relative z-10 -mt-2">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full p-2 shadow-lg mb-4">
                      <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden relative">
                        {editProfileAvatar ? <img src={editProfileAvatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-4 text-gray-300" />}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-center text-gray-900 mb-6">Editar Tu Perfil</h3>
                  </div>

                  <div className="space-y-5 relative z-10">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Nombre Completo</label>
                      <input
                        type="text"
                        value={editProfileName}
                        onChange={e => setEditProfileName(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">URL Avatar</label>
                      <input
                        type="text"
                        value={editProfileAvatar}
                        onChange={e => setEditProfileAvatar(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-8 relative z-10">
                    <button
                      type="button"
                      onClick={() => setIsProfileEditOpen(false)}
                      className="px-4 py-3 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        );

      case 'general':
        return (
          <div className="max-w-3xl space-y-8 animate-fade-in pb-12">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{t.menu.general}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">{t.sections.generalDesc}</p>
            </div>

            <div className="bg-white dark:bg-onyx-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-onyx-800 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Idioma / Language</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Preferencias de Idioma</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['ES', 'EN', 'FR'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as any)}
                    className={`py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 ${language === lang
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                      : 'bg-gray-50 dark:bg-onyx-950 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-onyx-800 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {lang === 'ES' ? 'Español' : lang === 'EN' ? 'English' : 'Français'}
                    {language === lang && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-onyx-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-onyx-800 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Moneda Principal</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Divisa de Referencia</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['EUR', 'USD', 'GBP'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr as any)}
                    className={`py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 ${currency === curr
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 dark:shadow-none'
                      : 'bg-gray-50 dark:bg-onyx-950 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-onyx-800 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {curr}
                    {currency === curr && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'personalization':
        return (
          <div className="max-w-3xl space-y-8 animate-fade-in pb-12">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{t.menu.personalization}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">{t.sections.persDesc}</p>
            </div>

            {/* Theme Section */}
            <div className="bg-white dark:bg-onyx-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-onyx-800 transition-all hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t.personalization.theme}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t.personalization.themeDesc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light Mode', icon: '☀️', color: 'from-amber-100 to-orange-50 text-amber-600 border-amber-200' },
                  { id: 'dark', label: 'Dark Mode', icon: '🌙', color: 'from-indigo-950 to-gray-900 text-indigo-300 border-indigo-900' },
                  { id: 'system', label: 'System', icon: '💻', color: 'from-gray-100 to-gray-50 dark:from-onyx-800 dark:to-onyx-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-onyx-700' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id as any)}
                    className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-4 transition-all duration-300 active:scale-95 group overflow-hidden relative ${theme === mode.id || (theme === 'system' && mode.id === 'system')
                      ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-200/50 dark:shadow-none'
                      : 'border-transparent bg-gray-50 dark:bg-onyx-950 hover:bg-white dark:hover:bg-onyx-800 hover:shadow-xl hover:border-gray-200 dark:hover:border-onyx-700'
                      }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-50 ${mode.color}`}></div>
                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner bg-white/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500`}>
                      {mode.icon}
                    </div>
                    <span className={`relative z-10 text-[10px] font-black uppercase tracking-widest ${theme === mode.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {mode.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Layout Section */}
            <div className="bg-white dark:bg-onyx-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-onyx-800 transition-all hover:shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t.personalization.layout}</h4>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">{t.personalization.layoutDesc}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de resetear el diseño del dashboard?')) setDashboardWidgets(DEFAULT_WIDGETS);
                  }}
                  className="shrink-0 px-6 py-4 bg-gray-100 dark:bg-onyx-800 hover:bg-gray-200 dark:hover:bg-onyx-700 text-gray-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                >
                  Restaurar por Defecto
                </button>
              </div>
            </div>

            {/* Sample Data Management */}
            <div className="pt-4">
              <SampleDataSection />
            </div>
          </div>
        );

      case 'privacy':
        return <PrivacySettings />;

      case 'categories':
        return (
          <div className="max-w-4xl space-y-8 animate-fade-in pb-12">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{t.menu.categories}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">{t.sections.catDesc}</p>
            </div>

            {/* Category Form */}
            <form
              ref={categoryFormRef}
              onSubmit={handleSaveCategory}
              className="bg-white dark:bg-onyx-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-onyx-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-6"
            >
              <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  {editingCatId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                {editingCatId ? 'Editar Categoría' : 'Nueva Categoría'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-onyx-950 border border-gray-200 dark:border-onyx-700 rounded-2xl font-black focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-900 dark:text-white transition-all shadow-inner"
                    placeholder="Ej: Transporte"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tipo</label>
                  <div className="flex bg-gray-50 dark:bg-onyx-950 p-1.5 rounded-2xl border border-gray-200 dark:border-onyx-700 shadow-inner h-[58px]">
                    <button
                      type="button"
                      onClick={() => setNewCatType('EXPENSE')}
                      className={`flex-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all h-full flex items-center justify-center ${newCatType === 'EXPENSE' ? 'bg-white dark:bg-onyx-800 shadow-sm text-rose-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                      Gasto
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCatType('INCOME')}
                      className={`flex-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all h-full flex items-center justify-center ${newCatType === 'INCOME' ? 'bg-white dark:bg-onyx-800 shadow-sm text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                      Ingreso
                    </button>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Subcategorías (CSV)</label>
                  <input
                    type="text"
                    value={newSubCat}
                    onChange={(e) => setNewSubCat(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-onyx-950 border border-gray-200 dark:border-onyx-700 rounded-2xl font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-900 dark:text-white transition-all shadow-inner"
                    placeholder="Gasolina, Metro, Taxi..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-onyx-800">
                {editingCatId && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-onyx-950 hover:bg-gray-100 dark:hover:bg-onyx-800 rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200/50 dark:shadow-none hover:bg-indigo-500 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Check className="w-5 h-5" />
                  {editingCatId ? 'Actualizar Categoría' : 'Guardar Categoría'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              {/* EXPENSE CATEGORIES */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 dark:border-onyx-800 pb-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Gastos</h4>
                </div>
                <div className="space-y-4">
                  {categories.filter(c => c.type === 'EXPENSE').map(cat => (
                    <div key={cat.id} className="group bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-gray-100 dark:border-onyx-800 hover:border-rose-200 dark:hover:border-rose-900/50 transition-all shadow-sm hover:shadow-xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{cat.name}</h5>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{cat.subCategories.length} subcategorías</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditCategoryClick(cat)}
                            className="p-3 text-gray-400 bg-gray-50 dark:bg-onyx-950 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-3 text-gray-400 bg-gray-50 dark:bg-onyx-950 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.subCategories.map((sub, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gray-50 dark:bg-onyx-950 shadow-inner text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-200 dark:border-onyx-800">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INCOME CATEGORIES */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 dark:border-onyx-800 pb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Ingresos</h4>
                </div>
                <div className="space-y-4">
                  {categories.filter(c => c.type === 'INCOME').map(cat => (
                    <div key={cat.id} className="group bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-gray-100 dark:border-onyx-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all shadow-sm hover:shadow-xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{cat.name}</h5>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{cat.subCategories.length} subcategorías</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditCategoryClick(cat)}
                            className="p-3 text-gray-400 bg-gray-50 dark:bg-onyx-950 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-3 text-gray-400 bg-gray-50 dark:bg-onyx-950 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.subCategories.map((sub, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gray-50 dark:bg-onyx-950 shadow-inner text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-200 dark:border-onyx-800">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'automation':
        return (
          <div className="max-w-4xl space-y-8 animate-fade-in pb-12">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{t.menu.automation}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">{t.sections.autoDesc}</p>
            </div>

            {/* New Rule Form */}
            <form onSubmit={handleAddRule} className="bg-gray-900 dark:bg-onyx-950 border border-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
              <h4 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3 mb-8 relative z-10">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
                  <Zap className="w-6 h-6" />
                </div>
                Nueva Regla Automática
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 ml-1">Disparador</label>
                  <select
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value as any)}
                    className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-2xl font-black text-white outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 hover:bg-gray-800 transition-colors shadow-inner appearance-none"
                  >
                    <option value="TRANSACTION_OVER_AMOUNT">Transacción mayor de...</option>
                    <option value="TRIP_CREATED">Nuevo viaje creado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 ml-1">Valor Limitante</label>
                  <input
                    type="number"
                    value={newRuleThreshold}
                    onChange={(e) => setNewRuleThreshold(e.target.value)}
                    className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-2xl font-black text-white outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 hover:bg-gray-800 transition-colors shadow-inner"
                    placeholder="100.00"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full h-[58px] bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 transition-all active:scale-95 flex items-center justify-center gap-3">
                    <Plus className="w-5 h-5" /> Crear Regla
                  </button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-1 gap-4 pt-4">
              <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-onyx-800 pb-4 mb-2 flex items-center gap-3">
                <Layers className="w-6 h-6 text-indigo-500" /> Mis Reglas Activas
              </h4>
              {automationRules.map((rule) => (
                <div key={rule.id} className={`p-6 rounded-[2.5rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group ${rule.isActive
                  ? 'bg-white dark:bg-onyx-900 border-indigo-100 dark:border-indigo-900/50 shadow-xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-1'
                  : 'bg-gray-50 dark:bg-onyx-950 border-gray-200 dark:border-onyx-800 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                  }`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-inner ${rule.isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-200 dark:bg-onyx-800 text-gray-400'
                      }`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{rule.name}</h5>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-[0.75rem] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 shadow-sm">
                          {rule.trigger}
                        </span>
                        {rule.threshold && <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-onyx-800 px-3 py-1.5 rounded-[0.75rem] shadow-inner"> {'>'} {rule.threshold}€</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 bg-gray-50 dark:bg-onyx-950 p-2.5 rounded-2xl border border-gray-200 dark:border-onyx-800 shadow-inner">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`relative w-16 h-8 rounded-xl transition-all duration-300 shadow-inner ${rule.isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-onyx-700'
                        }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-lg transition-transform duration-300 shadow-sm ${rule.isActive ? 'left-9' : 'left-1'
                        }`} />
                    </button>
                    <div className="w-px h-8 bg-gray-200 dark:bg-onyx-800"></div>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {automationRules.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-onyx-900 rounded-[2.5rem] border border-gray-100 dark:border-onyx-800 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-onyx-950 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-onyx-800 shadow-inner">
                    <Zap className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Sin reglas automáticas</h4>
                  <p className="text-sm font-medium text-gray-400 max-w-sm mx-auto leading-relaxed">Automatiza tus finanzas creando tu primera regla inteligente para alertas y categorización.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="max-w-4xl space-y-8 animate-fade-in pb-12">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{t.menu.subscription}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Gestiona tu plan de Aliseus</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-rose-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 group-hover:bg-rose-500/20 transition-colors duration-700"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md mb-4 shadow-inner">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">
                      {subscription.status === 'ACTIVE' ? 'Suscripción Activa' : subscription.status === 'NONE' ? (language === 'ES' ? 'Básico' : 'Basic') : subscription.status}
                    </span>
                  </div>
                  <h4 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                    Onyx {subscription.plan === 'FAMILIA' ? 'Premium' : subscription.plan === 'PERSONAL' ? 'Pro' : 'Basic'}
                  </h4>
                  <p className="text-indigo-200 font-medium">Tu plan actual está activo hasta el {subscription.expiryDate || '12 Oct 2026'}</p>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                  <button onClick={() => stripeService.createPortalSession()} className="px-8 py-4 bg-white text-indigo-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-gray-50 transition-all active:scale-95 text-center flex items-center justify-center gap-2">
                    Gestionar en Stripe <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="px-8 py-4 bg-indigo-800/50 text-indigo-200 border border-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-800 transition-all text-center">
                    Cambiar Plan
                  </button>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-indigo-700/50 pt-8">
                <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 backdrop-blur-sm">
                  <h5 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Próximo Cobro</h5>
                  <p className="text-2xl font-black text-white">2,99€ <span className="text-sm font-medium text-indigo-300">/ mes ({subscription.plan})</span></p>
                </div>
                <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 backdrop-blur-sm">
                  <h5 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Método de Pago</h5>
                  <p className="text-2xl font-black text-white flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-indigo-400" /> VISA **** 4242
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-8 border-t border-indigo-700/50">
                <h5 className="font-bold text-indigo-200 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" /> Beneficios de tu plan
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  {t.featuresList.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-sm font-medium text-indigo-100">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="max-w-4xl space-y-8 animate-fade-in pb-12">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{t.menu.billing}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">{t.sections.billDesc}</p>
            </div>

            <div className="space-y-6">
              <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-onyx-800 pb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-indigo-500" /> Método de Pago
              </h4>
              <div className="bg-white dark:bg-onyx-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-onyx-800 shadow-xl shadow-gray-200/40 dark:shadow-none space-y-6 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-12 bg-gray-50 dark:bg-onyx-950 rounded-xl flex items-center justify-center border border-gray-200 dark:border-onyx-800 shadow-inner group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                      <span className="font-black text-lg text-indigo-600 dark:text-indigo-400 italic flex items-center justify-center">VISA</span>
                    </div>
                    <div>
                      <h5 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        Visa terminada en <span className="text-indigo-500">4242</span>
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase tracking-widest rounded-md border border-emerald-200 dark:border-emerald-800">Default</span>
                      </h5>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Expira: 12/28</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gray-50 dark:bg-onyx-950 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-onyx-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-inner hover:shadow-md shrink-0">
                    Actualizar
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-onyx-800 pt-6">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Añadir otro método</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 py-4 bg-white dark:bg-onyx-900 border border-gray-200 dark:border-onyx-700 text-gray-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-onyx-800 transition-colors shadow-sm">
                      <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 dark:invert" alt="Apple Pay" />
                      Apple Pay
                    </button>
                    <button className="flex items-center justify-center gap-3 py-4 bg-[#003087] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#002266] transition-colors shadow-sm">
                      <img src="https://www.svgrepo.com/show/475667/paypal-color.svg" className="w-5 h-5" alt="PayPal" />
                      PayPal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-onyx-800 pb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-500" /> Historial de Facturas
              </h4>
              <div className="bg-white dark:bg-onyx-900 rounded-[2.5rem] border border-gray-100 dark:border-onyx-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden">
                {[1, 2, 3].map((i) => {
                  const months = language === 'ES' ? ['Oct', 'Nov', 'Dic'] : language === 'FR' ? ['Oct', 'Nov', 'Déc'] : ['Oct', 'Nov', 'Dec'];
                  return (
                    <div key={i} className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 dark:border-onyx-800 last:border-0 hover:bg-gray-50 dark:hover:bg-onyx-950/50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-onyx-950 rounded-xl flex items-center justify-center border border-gray-200 dark:border-onyx-800 shadow-inner group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                          <Download className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <div>
                          <h5 className="text-base font-black text-gray-900 dark:text-white mb-2">Factura #{1000 + i}</h5>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-800 shadow-sm">
                            <Check className="w-3 h-3" /> {months[i - 1]} 12, 2026
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-xl font-black text-gray-900 dark:text-white">{t.plan.price}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="max-w-4xl space-y-8 animate-fade-in pb-12">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{t.menu.security}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">{t.sections.secDesc}</p>
            </div>

            <div className="space-y-6">
              <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-onyx-800 pb-4 flex items-center gap-3">
                <Key className="w-6 h-6 text-indigo-500" /> Autenticación
              </h4>
              <div className="bg-white dark:bg-onyx-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-onyx-800 shadow-xl shadow-gray-200/40 dark:shadow-none space-y-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-gray-100 dark:border-onyx-800 gap-4 group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800/50 shadow-inner group-hover:border-purple-200 transition-colors">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        Autenticación 2FA
                        <span className="px-3 py-1 bg-gray-100 dark:bg-onyx-800 text-gray-500 dark:text-gray-400 text-[9px] uppercase tracking-widest rounded-lg border border-gray-200 dark:border-onyx-700 shadow-sm">Inactiva</span>
                      </h5>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 max-w-sm leading-relaxed">Protege tu cuenta con verificación móvil de dos pasos.</p>
                    </div>
                  </div>
                  <div className="w-14 h-8 bg-gray-200 dark:bg-onyx-800 rounded-full p-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-onyx-700 transition-colors shadow-inner flex shrink-0">
                    <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <button className="flex-1 px-6 py-4 bg-gray-50 dark:bg-onyx-950 text-indigo-600 dark:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors border border-gray-200 dark:border-onyx-800 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-inner hover:shadow-md text-left flex justify-between items-center group">
                    Actualizar Contraseña
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  </button>
                  <button className="flex-1 px-6 py-4 bg-gray-50 dark:bg-onyx-950 text-rose-600 dark:text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/40 transition-colors border border-gray-200 dark:border-onyx-800 hover:border-rose-200 dark:hover:border-rose-800 shadow-inner hover:shadow-md text-left flex justify-between items-center group">
                    Cerrar todas las sesiones
                    <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            </div>

            {/* LEGAL SECTION */}
            <div className="space-y-6 pt-4">
              <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-onyx-800 pb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-indigo-500" />
                {language === 'ES' ? 'Legal y Cumplimiento' : 'Legal & Compliance'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setActiveLegalPage('PRIVACY')} className="p-8 bg-white dark:bg-onyx-900 rounded-[2rem] border border-gray-100 dark:border-onyx-800 text-left hover:border-indigo-200 dark:hover:border-indigo-800 transition-all shadow-xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-1 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors"></div>
                  <Globe className="w-8 h-8 text-indigo-500 mb-4" />
                  <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight block mb-2">Privacy Policy</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data usage & rights</span>
                </button>
                <button onClick={() => setActiveLegalPage('TERMS')} className="p-8 bg-white dark:bg-onyx-900 rounded-[2rem] border border-gray-100 dark:border-onyx-800 text-left hover:border-indigo-200 dark:hover:border-indigo-800 transition-all shadow-xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-1 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors"></div>
                  <FileText className="w-8 h-8 text-indigo-500 mb-4" />
                  <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight block mb-2">Terms of Service</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Licensing & agreement</span>
                </button>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="mt-12 pt-8 border-t border-rose-100 dark:border-rose-900/30">
              <div className="bg-rose-50 dark:bg-rose-900/10 p-8 md:p-10 rounded-[2.5rem] border border-rose-200 dark:border-rose-900/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 transition-colors"></div>
                <h4 className="text-2xl font-black text-rose-950 dark:text-rose-400 tracking-tighter mb-3 relative z-10">{t.resetZone}</h4>
                <p className="text-sm font-medium text-rose-800 dark:text-rose-300 mb-8 max-w-2xl leading-relaxed relative z-10">
                  {language === 'ES'
                    ? 'Eliminar tu cuenta borrará permanentemente todos tus datos de nuestros servidores y de este dispositivo. No podrás recuperar esta información, ten cuidado.'
                    : 'Deleting your account will permanently wipe all your data from our servers and this device. You will not be able to recover this information.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <button onClick={handleResetSystem} className="px-8 py-4 bg-white dark:bg-onyx-950 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors shadow-sm text-center">
                    {t.resetBtn}
                  </button>
                  <button onClick={handleDeleteAccount} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-200 dark:shadow-none transition-all active:scale-95 text-center flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    {language === 'ES' ? 'ELIMINAR CUENTA' : 'DELETE ACCOUNT'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-50 dark:bg-onyx-950 relative">
      <header className="md:hidden bg-white dark:bg-onyx-950 border-b border-gray-100 dark:border-onyx-800 p-4 flex justify-between items-center z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-2"><h2 className="font-bold text-lg text-gray-900 dark:text-white">{t.title}</h2></div><button onClick={onMenuClick} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"><Menu className="w-6 h-6" /></button>
      </header>
      <div className="hidden md:block h-full">{renderSidebar()}</div>
      <div className="md:hidden flex overflow-x-auto p-2 bg-white dark:bg-onyx-950 border-b border-gray-200 dark:border-onyx-800 gap-2 shrink-0">{[{ id: 'profile', icon: User, label: t.menu.profile }, { id: 'general', icon: Globe, label: t.menu.general }, { id: 'categories', icon: Layers, label: t.menu.categories }, { id: 'automation', icon: Zap, label: t.menu.automation }, { id: 'subscription', icon: Star, label: t.menu.subscription }, { id: 'billing', icon: CreditCard, label: t.menu.billing }].map((item) => (<button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-bold border transition-colors flex items-center gap-2 ${activeSection === item.id ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-onyx-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-onyx-800'}`}><item.icon className="w-3 h-3" />{item.label}</button>))}</div>
      <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">{renderContent()}</div>
    </div>
  );
};

export default SettingsModule;
