import { supabase } from './supabaseClient';
import { RetirementPlan } from '../types';
import { RetirementPlanInput } from '../schemas/retirement.schema';

export const retirementService = {
    async getPlans() {
        if (!supabase) throw new Error('Supabase client not initialized');
        const { data, error } = await supabase
            .from('retirement_plans')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as RetirementPlan[];
    },

    async createPlan(plan: RetirementPlanInput) {
        if (!supabase) throw new Error('Supabase client not initialized');
        const userId = (await supabase.auth.getUser()).data.user?.id;

        const { data, error } = await supabase
            .from('retirement_plans')
            .insert({
                ...plan,
                user_id: userId
            })
            .select()
            .single();

        if (error) throw error;
        return data as RetirementPlan;
    },

    async updatePlan(id: string, updates: Partial<RetirementPlanInput>) {
        if (!supabase) throw new Error('Supabase client not initialized');
        const { data, error } = await supabase
            .from('retirement_plans')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as RetirementPlan;
    },

    async deletePlan(id: string) {
        if (!supabase) throw new Error('Supabase client not initialized');
        const { error } = await supabase
            .from('retirement_plans')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
