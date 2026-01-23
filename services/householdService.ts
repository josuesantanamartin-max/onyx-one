import { supabase } from './supabaseClient';
import { Household, HouseholdMember, PermissionMatrix } from '../types';
import { CreateHouseholdInput } from '../schemas/household.schema';

export const householdService = {
    /**
     * Create a new household with the current user as owner and admin.
     */
    async createHousehold(data: CreateHouseholdInput) {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { data: householdId, error } = await supabase.rpc('create_new_household', {
            household_name: data.name,
            household_currency: data.currency,
        });

        if (error) throw error;
        return householdId;
    },

    /**
     * Get all households the current user is a member of.
     */
    async getMyHouseholds() {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { data, error } = await supabase
            .from('households')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Household[];
    },

    /**
     * Get members of a specific household.
     */
    async getHouseholdMembers(householdId: string) {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { data, error } = await supabase
            .from('household_members')
            .select('*, user:user_id(email, user_metadata)') // Assumes public view or similar, might need adjustment
            .eq('household_id', householdId);

        if (error) throw error;
        // We map user to return a friendly structure if needed, but for now return raw
        return data;
    },

    /**
     * Invite a user to the household by email.
     */
    async inviteMember(householdId: string, email: string, role: string) {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { data, error } = await supabase
            .from('household_invites')
            .insert({
                household_id: householdId,
                email,
                role,
                created_by: (await supabase.auth.getUser()).data.user?.id
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update household permissions.
     */
    async updatePermissions(householdId: string, permissions: PermissionMatrix) {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { error } = await supabase
            .from('households')
            .update({ permissions })
            .eq('id', householdId);

        if (error) throw error;
    },

    /**
     * Leave a household
     */
    async leaveHousehold(householdId: string) {
        if (!supabase) throw new Error('Supabase client not initialized');
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error('User not found');

        const { error } = await supabase
            .from('household_members')
            .delete()
            .eq('household_id', householdId)
            .eq('user_id', userId);

        if (error) throw error;
    },

    /**
     * Send a chat message to the household
     */
    async sendMessage(householdId: string, content: string) {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { error } = await supabase
            .from('household_messages')
            .insert({
                household_id: householdId,
                content,
                user_id: (await supabase.auth.getUser()).data.user?.id
            });

        if (error) throw error;
    },

    /**
     * Get recent messages for the household
     */
    async getMessages(householdId: string, limit = 50) {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { data, error } = await supabase
            .from('household_messages')
            .select('*, user:user_id(email, user_metadata)')
            .eq('household_id', householdId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    }
};

