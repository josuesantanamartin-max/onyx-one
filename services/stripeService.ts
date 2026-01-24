import { loadStripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const stripePromise = STRIPE_PUBLISHABLE_KEY
    ? loadStripe(STRIPE_PUBLISHABLE_KEY)
    : null;

// Initialize Supabase Client (if not already available globally, though typically imported from a store or config)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const stripeService = {
    /**
     * Redirects the user to Stripe Checkout to subscribe to a PRO plan.
     * Calls the 'create-checkout-session' Edge Function.
     */
    async redirectToCheckout(priceId: string, userId: string): Promise<void> {
        if (!stripePromise) {
            console.error("Stripe not initialized. Missing VITE_STRIPE_PUBLISHABLE_KEY.");
            throw new Error("Stripe configuration error");
        }

        try {
            console.log(`Initiating checkout for plan: ${priceId} (User: ${userId})`);

            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { priceId, userId, returnUrl: window.location.origin }
            });

            if (error) {
                console.error('Error invoking create-checkout-session:', error);
                throw new Error("Failed to create checkout session");
            }

            if (!data?.url) {
                console.error('No URL returned from checkout session');
                throw new Error("Invalid response from payment server");
            }

            // Redirect to Stripe
            window.location.href = data.url;

        } catch (err) {
            console.error("Payment Error:", err);
            // Re-throw to be handled by the UI (e.g., show a toast)
            throw err;
        }
    },

    /**
     * Redirects to the Stripe Customer Portal for managing subscriptions.
     * Calls the 'create-portal-session' Edge Function.
     */
    async redirectToCustomerPortal(customerId?: string): Promise<void> {
        try {
            console.log(`Redirecting to portal for customer: ${customerId || 'current'}`);

            const { data, error } = await supabase.functions.invoke('create-portal-session', {
                body: { returnUrl: window.location.origin }
            });

            if (error) {
                console.error('Error invoking create-portal-session:', error);
                throw new Error("Failed to create portal session");
            }

            if (!data?.url) {
                throw new Error("No URL returned from portal session");
            }

            window.location.href = data.url;
        } catch (err) {
            console.error("Portal Error:", err);
            throw err;
        }
    },

    /**
     * Helper to check subscription status. 
     * In a real app, this should sync via Webhooks to your Database,
     * so you should query your User Profile table, not Stripe directly from frontend.
     */
    async getSubscriptionStatus(userId: string) {
        // This is just a placeholder. Real status should come from `useUserStore`.
        return null;
    }
};
