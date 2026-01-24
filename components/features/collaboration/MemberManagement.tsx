import React, { useState, useEffect } from 'react';
import { useHouseholdStore } from '../../../store/useHouseholdStore';
import { UserPlus, Shield, X, Mail, Users } from 'lucide-react';
import Toast from '../../common/Toast';

export const MemberManagement: React.FC = () => {
    const { activeHouseholdId, members, fetchMembers, inviteMember } = useHouseholdStore();
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
    const [showInviteForm, setShowInviteForm] = useState(false);

    useEffect(() => {
        if (activeHouseholdId) {
            fetchMembers(activeHouseholdId);
        }
    }, [activeHouseholdId]);

    const handleInvite = async () => {
        if (!inviteEmail.trim() || !activeHouseholdId) return;
        try {
            await inviteMember(inviteEmail, inviteRole);
            setInviteEmail('');
            setShowInviteForm(false);
            // Optionally show toast success
        } catch (e) {
            console.error("Failed to invite", e);
        }
    };

    if (!activeHouseholdId) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Miembros
                </h2>
                <button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Invitar
                </button>
            </div>

            {/* Invite Form */}
            {showInviteForm && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Invitar Nuevo Miembro</h3>
                        <button onClick={() => setShowInviteForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div className="flex gap-2">
                            {(['ADMIN', 'MEMBER', 'VIEWER'] as const).map(role => (
                                <button
                                    key={role}
                                    onClick={() => setInviteRole(role)}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-all ${inviteRole === role ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-50'}`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleInvite}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Enviar Invitación
                        </button>
                    </div>
                </div>
            )}

            {/* Members List */}
            <div className="space-y-4">
                {members.map((member: any) => (
                    <div key={member.user_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                {member.user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                                    {member.user?.email || 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    {member.role === 'ADMIN' && <Shield className="w-3 h-3 text-amber-500" />}
                                    {member.role}
                                </p>
                            </div>
                        </div>

                        {/* Actions could go here (Remove, Change Role) if user is Admin */}
                    </div>
                ))}
            </div>
        </div>
    );
};
