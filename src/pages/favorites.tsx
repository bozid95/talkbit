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
      <main className="min-h-screen bg-gray-50 p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">❤️ Favorit Saya</h1>
        <FavoriteList allWords={allWords} />
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
