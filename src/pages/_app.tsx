import { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import BottomNavbar from "@/components/BottomNavbar";
import Header from "@/components/Header";

// Tambahkan deklarasi global window._Hasync dengan tipe yang tepat
declare global {
  interface Window {
    _Hasync?: Array<[string, string]>;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && !window._Hasync) {
      window._Hasync = window._Hasync || [];
      window._Hasync.push(["Histats.start", "1,4951417,4,0,0,0,00010000"]);
      window._Hasync.push(["Histats.fasi", "1"]);
      window._Hasync.push(["Histats.track_hits", ""]);

      const hs = document.createElement("script");
      hs.type = "text/javascript";
      hs.async = true;
      hs.src = "//s10.histats.com/js15_as.js";
      document.body.appendChild(hs);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <Header />
      <Component {...pageProps} />
      <BottomNavbar />

      {/* Optional: <noscript> fallback untuk non-JS */}
      <noscript>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <img
            src="//sstatic1.histats.com/0.gif?4951417&101"
            alt="Histats"
            style={{ border: 0 }}
          />
        </a>
      </noscript>
    </div>
  );
}
