import React, { useEffect } from "react";
import AdminSidebar from "./AdminSidebar"; // Updated import
import Header from "./Header";
import StudentHeader from "./StudentHeader"; // New import for StudentHeader
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Layout({ children, pageProps }) {
  const { pathname } = useRouter();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Exclude layout for specific routes
  const noLayoutRoutes = ["/auth/login", "/auth/signup", "/", "/placement-test", "/game"];
  const shouldExcludeLayout = noLayoutRoutes.includes(pathname) || pageProps?.noLayout;

  // Redirect based on user role
  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "ADMIN" && !pathname.startsWith("/admin")) {
        router.push("/admin");
      } else if (role === "STUDENT" && !pathname.startsWith("/dashboard") && pathname !== "/" && pathname !== "/placement-test") {
        router.push("/dashboard");
      }
    } else if (status === "unauthenticated" && !shouldExcludeLayout) {
      router.push("/auth/login");
    }
  }, [status, session, pathname, router, shouldExcludeLayout]);

  if (shouldExcludeLayout) {
    return <>{children}</>;
  }

  const renderSidebarAndHeader = () => {
    if (session?.user?.role === "ADMIN") {
      return (
        <>
          <Head>
            <title>Admin Dashboard</title>
          </Head>
          <AdminSidebar />
          <Header joinUs={true} pathname={pathname} />
        </>
      );
    }
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <StudentHeader joinUs={true} pathname={pathname} /> {/* Use StudentHeader for students */}
      </>
    );
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar and Header */}
      {renderSidebarAndHeader()}
      {/* Main Content */}
      <div className={`${session?.user?.role === "ADMIN" ? "ml-12" : "pt-20 bg-gradient-to-b from-primary/90 to-primary/50"} w-full p-4 overflow-y-auto`}>
      {children}
      </div>
    </div>
  );
}