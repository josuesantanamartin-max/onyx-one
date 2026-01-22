/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Max requests per window
}

const defaultConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
};

/**
 * Clean up expired entries
 */
function cleanupExpiredEntries() {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

// Run cleanup every minute
setInterval(cleanupExpiredEntries, 60 * 1000);

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // No entry or expired entry
    if (!entry || now > entry.resetTime) {
        const resetTime = now + config.windowMs;
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime,
        });

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime,
        };
    }

    // Entry exists and is valid
    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
    };
}

/**
 * Reset rate limit for an identifier
 */
export function resetRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
}

/**
 * Get rate limit status without incrementing
 */
export function getRateLimitStatus(
    identifier: string,
    config: RateLimitConfig = defaultConfig
): { remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
        return {
            remaining: config.maxRequests,
            resetTime: now + config.windowMs,
        };
    }

    return {
        remaining: Math.max(0, config.maxRequests - entry.count),
        resetTime: entry.resetTime,
    };
}
