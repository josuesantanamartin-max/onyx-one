// ─────────────────────────────────────────────────────────────────────────────
//  Aliseus — Notification Types
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType = 'warning' | 'danger' | 'success' | 'info';
export type NotificationModule = 'finance' | 'life' | 'system';
export type NotificationCategory =
    | 'budget'
    | 'goal'
    | 'debt'
    | 'pantry'
    | 'trip'
    | 'shopping'
    | 'system';

export interface OnyxNotification {
    /** Deterministic ID based on rule + entity, prevents duplicates */
    id: string;
    type: NotificationType;
    module: NotificationModule;
    category: NotificationCategory;
    title: string;
    message: string;
    /** Label for the CTA button shown on the notification card */
    actionLabel?: string;
    /** Where to navigate when the user clicks the action button */
    actionTarget?: { app: string; tab?: string };
    read: boolean;
    createdAt: string; // ISO string
    dismissedAt?: string;
}
