/**
 * This endpoint is dead code — the app uses NextAuth credentials provider.
 * Kept as a stub to avoid 404s on any legacy clients; all actual login
 * goes through /api/auth/[...nextauth].
 */
export default function handler(_req, res) {
  res.status(410).json({ error: "This endpoint is deprecated. Use NextAuth sign-in." });
}
