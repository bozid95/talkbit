import SearchWords from "@/components/SearchWord";
import useSWR from "swr";
import Head from "next/head";
import { WordEntry } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SearchPage() {
  const { data, error } = useSWR<WordEntry[]>("/api/words", fetcher);

  if (error) return <div>Gagal memuat data kata.</div>;
  if (!data) return <div>Loading...</div>;

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
