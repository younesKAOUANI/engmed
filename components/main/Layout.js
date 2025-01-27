'use client';
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Layout({ children, pageProps }) {
  const { pathname } = useRouter();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Exclude layout for specific routes
  const noLayoutRoutes = ["/auth/login", "/auth/signup", '/'];
  const shouldExcludeLayout = noLayoutRoutes.includes(pathname) || pageProps?.noLayout;

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated" && !shouldExcludeLayout) {
      console.log(session, 'session')
      // router.push("/auth/login");
    }
  }, [status, shouldExcludeLayout, router]);

  if (shouldExcludeLayout) {
    return <>{children}</>; // Render only the children without Sidebar/Header
  }

  const renderSidebar = (pathname) => {
    if (pathname.startsWith("/admin")) {
      return <Sidebar type="admin" />;
    }
    return <Sidebar type="default" />;
  };

  if (status === "loading") {
    // Optionally, show a loading spinner while session status is loading
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar */}
      {renderSidebar(pathname)}
      {/* Main Content */}
      <div className="ml-[200px] w-full p-4 overflow-y-auto">
        <Header joinUs={true} pathname={pathname} />
        {children}
      </div>
    </div>
  );
}
