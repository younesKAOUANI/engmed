import Layout from "@/components/main/Layout";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
export default function App({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return <SessionProvider session={pageProps.session}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </SessionProvider>
}
