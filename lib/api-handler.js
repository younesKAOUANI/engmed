import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ZodError } from "zod";

/**
 * Prisma error codes we handle explicitly.
 * @see https://www.prisma.io/docs/reference/api-reference/error-reference
 */
const PRISMA_ERRORS = {
  P2002: { status: 409, message: "A record with this value already exists." },
  P2025: { status: 404, message: "Record not found." },
  P2003: { status: 400, message: "Related record not found." },
};

/**
 * Wraps a Next.js API handler with:
 *  - HTTP method allowlist
 *  - Optional authentication check
 *  - Optional role-based access control
 *  - Zod validation error formatting
 *  - Prisma error mapping to HTTP status codes
 *  - Consistent JSON error shape: `{ error: string, details?: unknown }`
 *
 * @example
 * // Require any authenticated user
 * export default apiHandler({ auth: true }, async (req, res, ctx) => { ... });
 *
 * @example
 * // Require ADMIN role, allow GET and DELETE
 * export default apiHandler({ auth: true, role: "ADMIN", methods: ["GET", "DELETE"] }, handler);
 *
 * @param {{ auth?: boolean, role?: string|string[], methods?: string[] }} options
 * @param {(req: import('next').NextApiRequest, res: import('next').NextApiResponse, ctx: { session: import('next-auth').Session|null }) => Promise<void>} handler
 */
export function apiHandler(options = {}, handler) {
  const { auth = false, role, methods } = options;

  return async function wrappedHandler(req, res) {
    // ── Method check ──────────────────────────────────────────────────────────
    if (methods && !methods.includes(req.method)) {
      res.setHeader("Allow", methods);
      return res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }

    // ── Auth check ────────────────────────────────────────────────────────────
    let session = null;
    if (auth || role) {
      session = await getServerSession(req, res, authOptions);
      if (!session?.user?.id) {
        return res.status(401).json({ error: "Authentication required." });
      }
    }

    // ── Role check ────────────────────────────────────────────────────────────
    if (role) {
      const allowed = Array.isArray(role) ? role : [role];
      if (!allowed.includes(session.user.role)) {
        return res.status(403).json({ error: "You do not have permission to perform this action." });
      }
    }

    // ── Execute handler ───────────────────────────────────────────────────────
    try {
      await handler(req, res, { session });
    } catch (err) {
      // Zod validation error
      if (err instanceof ZodError) {
        return res.status(422).json({
          error: "Validation failed.",
          details: err.flatten().fieldErrors,
        });
      }

      // Known Prisma errors
      if (err?.code && PRISMA_ERRORS[err.code]) {
        const { status, message } = PRISMA_ERRORS[err.code];
        return res.status(status).json({ error: message });
      }

      // Unknown — log server-side, return generic message to client
      console.error("[API Error]", req.method, req.url, err);
      return res.status(500).json({ error: "An unexpected error occurred. Please try again." });
    }
  };
}
