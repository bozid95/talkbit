// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import BottomNavbar from "@/components/BottomNavbar";
import Header from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <Header />
      <Component {...pageProps} />
      <BottomNavbar />
    </div>
  );
}
