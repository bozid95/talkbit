import Head from "next/head";
import FavoriteList from "@/components/FavoriteList";
import { fetchSpreadsheetData } from "@/libs/spreadsheets";
import { WordEntry } from "@/types";

interface FavoritesPageProps {
  allWords: WordEntry[];
}

export default function FavoritesPage({ allWords }: FavoritesPageProps) {
  return (
    <>
      <Head>
        <title>Favorit Saya</title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-5 px-4">
        <div className="max-w-2xl md:max-w-3xl mx-auto">
          <section className="mb-10">
            <FavoriteList allWords={allWords} />
          </section>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  try {
    const allWords = await fetchSpreadsheetData();
    return { props: { allWords }, revalidate: 3600 };
  } catch {
    return { props: { allWords: [] } };
  }
}
