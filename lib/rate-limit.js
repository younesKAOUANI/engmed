/**
 * Simple in-memory rate limiter.
 *
 * Suitable for single-instance deployments. For multi-instance (e.g. Vercel
 * serverless), swap the Map for a Redis store (upstash/ratelimit is a drop-in).
 *
 * @example
 * // Allow 5 requests per 60 seconds per IP
 * const limiter = rateLimit({ limit: 5, windowMs: 60_000 });
 * export default apiHandler({}, async (req, res) => {
 *   const result = limiter.check(req);
 *   if (!result.success) return res.status(429).json({ error: result.message });
 *   ...
 * });
 */

/**
 * @typedef {{ limit: number, windowMs: number }} RateLimitOptions
 * @typedef {{ success: boolean, remaining: number, message?: string }} RateLimitResult
 */

/**
 * @param {RateLimitOptions} options
 * @returns {{ check: (req: import('next').NextApiRequest) => RateLimitResult }}
 */
export function rateLimit({ limit = 10, windowMs = 60_000 } = {}) {
  /** @type {Map<string, { count: number, resetAt: number }>} */
  const store = new Map();

  // Clean up expired entries every 5 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of store) {
      if (val.resetAt < now) store.delete(key);
    }
  }, 5 * 60_000).unref?.();

  return {
    /**
     * @param {import('next').NextApiRequest} req
     * @returns {RateLimitResult}
     */
    check(req) {
      const ip =
        (req.headers["x-forwarded-for"] ?? "").toString().split(",")[0].trim() ||
        req.socket?.remoteAddress ||
        "unknown";
      const now     = Date.now();
      const entry   = store.get(ip) ?? { count: 0, resetAt: now + windowMs };

      if (entry.resetAt < now) {
        entry.count   = 0;
        entry.resetAt = now + windowMs;
      }

      entry.count += 1;
      store.set(ip, entry);

      const remaining = Math.max(0, limit - entry.count);
      if (entry.count > limit) {
        return {
          success:   false,
          remaining: 0,
          message:   `Too many requests. Please try again in ${Math.ceil((entry.resetAt - now) / 1000)} seconds.`,
        };
      }
      return { success: true, remaining };
    },
  };
}

/** Pre-configured limiter for auth endpoints (stricter). */
export const authLimiter = rateLimit({ limit: 10, windowMs: 15 * 60_000 });
