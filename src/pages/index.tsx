import Head from "next/head";
import { useState, useEffect } from "react";
import useSWR from "swr";
import WordOfTheDay from "@/components/WordOfTheDay";
import { WordEntry } from "@/types";
import Cookies from "js-cookie";

// Fungsi shuffle array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fetcher untuk SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [limit, setLimit] = useState(10);
  const [shuffledWords, setShuffledWords] = useState<WordEntry[] | null>(null);

  const { data, error, isLoading } = useSWR<WordEntry[]>(
    "/api/words",
    fetcher,
    {
      refreshInterval: 60000, // refresh setiap 60 detik (opsional)
    }
  );

  useEffect(() => {
    // Ambil limit dari cookie
    const savedLimit = Cookies.get("word_limit");
    if (savedLimit) {
      const parsed = Number(savedLimit);
      if (!isNaN(parsed) && parsed > 0) {
        setLimit(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      // Shuffle data sekali ketika data baru datang
      const shuffled = shuffleArray(data);
      setShuffledWords(shuffled);
    }
  }, [data]);

  if (error) return <p className="text-red-500">Gagal memuat data..</p>;
  if (isLoading || !shuffledWords) return <p>Memuat...</p>;

  return (
    <>
      <Head>
        <title>TalkBit</title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-5 px-4">
        <div className="max-w-2xl md:max-w-3xl mx-auto">
          <section className="mb-10">
            <WordOfTheDay initialWords={shuffledWords} limit={limit} />
          </section>
        </div>
      </main>
    </>
  );
}
