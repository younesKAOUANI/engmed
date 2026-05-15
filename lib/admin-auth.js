import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Server-side props guard for admin pages.
 *
 * Usage in any admin page:
 *   export { adminServerSideProps as getServerSideProps } from "@/lib/admin-auth";
 *
 * Redirects unauthenticated visitors to /auth/login and non-admin users to /dashboard.
 * Returns the session as a prop so admin pages can access it without a client request.
 */
export async function adminServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/auth/login", permanent: false } };
  }

  if (session.user.role !== "ADMIN") {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }

  return {
    props: {
      session: {
        user: {
          id:    session.user.id,
          name:  session.user.name,
          email: session.user.email,
          role:  session.user.role,
        },
      },
    },
  };
}
