import SearchWords from "@/components/SearchWord";
import { fetchSpreadsheetData } from "@/libs/spreadsheets";
import { WordEntry } from "@/types";

export async function getStaticProps() {
  const data = await fetchSpreadsheetData();
  return {
    props: { data },
    revalidate: 3600,
  };
}

export default function SearchPage({ data }: { data: WordEntry[] }) {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">🔍 Cari Kata</h1>
        <SearchWords allWords={data} />
      </div>
    </main>
  );
}
