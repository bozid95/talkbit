import SearchWithFavorites from "@/components/SearchBar";
import { WordEntry } from "@/types";

// Gantilah URL ini dengan data JSON kamu (bisa dari spreadsheet yang dikonversi)
export async function getStaticProps() {
  const res = await fetch("https://example.com/words.json");
  const words: WordEntry[] = await res.json();

  return {
    props: {
      initialWords: words,
    },
    revalidate: 3600, // Rebuild setiap 1 jam
  };
}

export default function SearchPage({
  initialWords,
}: {
  initialWords: WordEntry[];
}) {
  return <SearchWithFavorites initialWords={initialWords} />;
}
