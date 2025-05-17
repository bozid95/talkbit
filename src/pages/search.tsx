import SearchWords from "@/components/SearchWord";
import { fetchSpreadsheetData } from "@/libs/spreadsheets";
import { WordEntry } from "@/types";
import Head from "next/head";

export async function getStaticProps() {
  const data = await fetchSpreadsheetData();
  return {
    props: { data },
    revalidate: 3600,
  };
}

export default function SearchPage({ data }: { data: WordEntry[] }) {
  return (
    <>
      <Head>
        <title>Pencarian</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          <SearchWords allWords={data} />
        </div>
      </main>
    </>
  );
}
