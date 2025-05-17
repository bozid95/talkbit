import Head from "next/head";
import { useState, useEffect } from "react";
import WordOfTheDay from "@/components/WordOfTheDay";
import Settings from "@/components/Settings";
import { fetchSpreadsheetData } from "@/libs/spreadsheets";
import { WordEntry } from "@/types";
import BottomNavbar from "@/components/BottomNavbar";
import Cookies from "js-cookie";

interface HomeProps {
  data: WordEntry[];
}

export default function Home({ data }: HomeProps) {
  const [limit, setLimit] = useState(10);

  // Sync limit dengan cookie saat mount
  useEffect(() => {
    const savedLimit = Cookies.get("word_limit");
    if (savedLimit) {
      setLimit(Number(savedLimit));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Belajar Bahasa Inggris</title>
      </Head>
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">
            📘 Belajar Bahasa Inggris
          </h1>

          <section className="mb-6">
            <Settings limit={limit} onLimitChange={setLimit} />
            <WordOfTheDay initialWords={data} limit={limit} />
          </section>
        </div>
      </main>
    </>
  );
}

// SSG
export async function getStaticProps() {
  try {
    const data = await fetchSpreadsheetData();
    return { props: { data }, revalidate: 3600 };
  } catch (error) {
    console.error("Error fetching spreadsheet:", error);
    return { props: { data: [] } };
  }
}
