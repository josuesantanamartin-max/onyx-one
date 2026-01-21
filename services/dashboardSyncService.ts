import { supabase } from './supabaseClient';
import { DashboardLayout } from '../types';

export class DashboardSyncService {
    private syncInProgress = false;
    private pendingSync: DashboardLayout[] | null = null;

    /**
     * Carga layouts del usuario desde Supabase
     */
    async loadUserLayouts(userId: string): Promise<DashboardLayout[]> {
        try {
            const { data, error } = await supabase
                .from('user_dashboard_layouts')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                return [];
            }

            return data.map(row => ({
                id: row.layout_id,
                name: row.name,
                description: row.description || undefined,
                isDefault: row.is_default,
                widgets: row.widgets,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));
        } catch (error) {
            console.error('Error loading layouts from Supabase:', error);
            return [];
        }
    }

    /**
     * Guarda un layout en Supabase
     */
    async saveLayout(userId: string, layout: DashboardLayout): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('user_dashboard_layouts')
                .upsert({
                    user_id: userId,
                    layout_id: layout.id,
                    name: layout.name,
                    description: layout.description || null,
                    is_default: layout.isDefault,
                    widgets: layout.widgets,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id,layout_id'
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error saving layout to Supabase:', error);
            return false;
        }
    }

    /**
     * Sincroniza múltiples layouts con debounce
     */
    async syncLayouts(userId: string, layouts: DashboardLayout[]): Promise<boolean> {
        // Si ya hay una sincronización en progreso, guardar para después
        if (this.syncInProgress) {
            this.pendingSync = layouts;
            return true;
        }

        this.syncInProgress = true;

        try {
            // Sincronizar todos los layouts
            const promises = layouts.map(layout => this.saveLayout(userId, layout));
            await Promise.all(promises);

            // Si hay sincronización pendiente, ejecutarla
            if (this.pendingSync) {
                const pending = this.pendingSync;
                this.pendingSync = null;
                await this.syncLayouts(userId, pending);
            }

            return true;
        } catch (error) {
            console.error('Error syncing layouts to Supabase:', error);
            return false;
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Marca un layout como activo
     */
    async setActiveLayout(userId: string, layoutId: string): Promise<boolean> {
        try {
            // Desactivar todos los layouts
            await supabase
                .from('user_dashboard_layouts')
                .update({ is_active: false })
                .eq('user_id', userId);

            // Activar el seleccionado
            const { error } = await supabase
                .from('user_dashboard_layouts')
                .update({ is_active: true })
                .eq('user_id', userId)
                .eq('layout_id', layoutId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error setting active layout in Supabase:', error);
            return false;
        }
    }

    /**
     * Elimina un layout
     */
    async deleteLayout(userId: string, layoutId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('user_dashboard_layouts')
                .delete()
                .eq('user_id', userId)
                .eq('layout_id', layoutId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting layout from Supabase:', error);
            return false;
        }
    }

    /**
     * Obtiene el layout activo del usuario
     */
    async getActiveLayout(userId: string): Promise<DashboardLayout | null> {
        try {
            const { data, error } = await supabase
                .from('user_dashboard_layouts')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true)
                .single();

            if (error) throw error;

            if (!data) return null;

            return {
                id: data.layout_id,
                name: data.name,
                description: data.description || undefined,
                isDefault: data.is_default,
                widgets: data.widgets,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            };
        } catch (error) {
            console.error('Error getting active layout from Supabase:', error);
            return null;
        }
    }
}

export const dashboardSyncService = new DashboardSyncService();
