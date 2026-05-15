import React, { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import StudentHeader from "./StudentHeader";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Head from "next/head";
import { ToastProvider } from "@/components/ui/Toast";

const NO_LAYOUT_ROUTES = ["/auth/login", "/auth/signup", "/", "/placement-test", "/game", "/game/crosswords"];

export default function Layout({ children }) {
  const { pathname } = useRouter();
  const { data: session, status } = useSession();
  const router = useRouter();
  const shouldExcludeLayout = NO_LAYOUT_ROUTES.includes(pathname);

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      if (role === "ADMIN" && !pathname.startsWith("/admin")) {
        router.push("/admin");
      } else if (role === "STUDENT" && !pathname.startsWith("/dashboard") && !NO_LAYOUT_ROUTES.includes(pathname)) {
        router.push("/dashboard");
      }
    } else if (status === "unauthenticated" && !shouldExcludeLayout) {
      router.push("/auth/login");
    }
  }, [status, session, pathname, router, shouldExcludeLayout]);

  if (shouldExcludeLayout) {
    return (
      <ToastProvider>
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </ToastProvider>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-paper">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="body-sm text-ink-500">Loading…</p>
        </div>
      </div>
    );
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <ToastProvider>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="flex bg-paper min-h-screen">
        {isAdmin && <AdminSidebar />}
        <div className={`flex flex-col flex-1 min-w-0 ${isAdmin ? "ml-60" : ""}`}>
          {!isAdmin && <StudentHeader />}
          <main
            id="main-content"
            className={`flex-1 overflow-y-auto p-6 ${!isAdmin ? "pt-24" : "pt-6"}`}
          >
            <div className="max-w-content mx-auto w-full">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
