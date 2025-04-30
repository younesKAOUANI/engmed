import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Layout({ children, pageProps }) {
  const { pathname } = useRouter();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Exclude layout for specific routes
  const noLayoutRoutes = ["/auth/login", "/auth/signup", "/", "/placement-test"];
  const shouldExcludeLayout = noLayoutRoutes.includes(pathname) || pageProps?.noLayout;

  // Redirect based on user role
  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "ADMIN" && !pathname.startsWith("/admin")) {
        router.push("/admin");
      } else if (role === "STUDENT" && !pathname.startsWith("/dashboard") && pathname !== "/") {
        router.push("/dashboard");
      }
    } else if (status === "unauthenticated" && !shouldExcludeLayout) {
      router.push("/auth/login");
    }
  }, [status, session, pathname, router, shouldExcludeLayout]);

  if (shouldExcludeLayout) {
    return <>{children}</>;
  }

  const renderSidebar = () => {
    if (session?.user?.role === "ADMIN") {
      return (
        <>
          <Head>
            <title>Admin Dashboard</title>
          </Head>
          <Sidebar type="admin" />
        </>
      );
    }
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Sidebar type="default" />
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
      {/* Sidebar */}
      {renderSidebar()}
      {/* Main Content */}
      <div className="ml-[200px] w-full p-4 overflow-y-auto">
        <Header joinUs={true} pathname={pathname} />
        {children}
      </div>
    </div>
  );
}