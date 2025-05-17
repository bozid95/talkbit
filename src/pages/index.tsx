// src/pages/index.tsx
import Head from "next/head";
import WordOfTheDay from "@/components/WordOfTheDay";
import { fetchSpreadsheetData } from "@/libs/spreadsheets";
import { WordEntry } from "@/types";
import BottomNavbar from "@/components/BottomNavbar";

interface HomeProps {
  data: WordEntry[];
}

export default function Home({ data }: HomeProps) {
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
            <WordOfTheDay initialWords={data} limit={10} />
            <BottomNavbar />
          </section>
        </div>
      </main>
    </>
  );
}

// Fungsi ini berjalan di server saat build (SSG)
export async function getStaticProps() {
  try {
    const data = await fetchSpreadsheetData();
    return { props: { data }, revalidate: 60 * 60 }; // regenerate setiap jam
  } catch (error) {
    console.error("Error fetching spreadsheet:", error);
    return { props: { data: [] } };
  }
}
