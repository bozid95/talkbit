import Head from "next/head";
import { useState, useEffect } from "react";
import WordOfTheDay from "@/components/WordOfTheDay";
import { fetchSpreadsheetData } from "@/libs/spreadsheets";
import { WordEntry } from "@/types";
import Cookies from "js-cookie";

interface HomeProps {
  data: WordEntry[];
}

export default function Home({ data }: HomeProps) {
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const savedLimit = Cookies.get("word_limit");
    if (savedLimit) {
      const parsed = Number(savedLimit);
      if (!isNaN(parsed) && parsed > 0) {
        setLimit(parsed);
      }
    }
  }, []);

  // Fungsi update limit sekaligus simpan ke cookie

  return (
    <>
      <Head>
        <title>TalkBit</title>
      </Head>
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">TalkBit APP</h1>

          <section className="mb-6">
            <WordOfTheDay initialWords={data} limit={limit} />
          </section>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  try {
    const data = await fetchSpreadsheetData();
    return { props: { data }, revalidate: 3600 };
  } catch (error) {
    console.error("Error fetching spreadsheet:", error);
    return { props: { data: [] } };
  }
}
