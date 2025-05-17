// src/components/WordSearch.tsx
import { useState } from "react";
import { WordEntry } from "@/types";
import SearchBar from "./SearchBar";

interface Props {
  allWords: WordEntry[];
}

export default function WordSearch({ allWords }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WordEntry[]>([]);

  const handleSearch = (q: string) => {
    setQuery(q);
    const lower = q.trim().toLowerCase();

    if (!lower) {
      setResults([]);
      return;
    }

    const filtered = allWords.filter(
      (w) =>
        w.English.toLowerCase().includes(lower) ||
        w.Indonesian.toLowerCase().includes(lower)
    );

    setResults(filtered);
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-2">🔍 Cari Kata/Kalimat</h2>
      <SearchBar onSearch={handleSearch} />

      {query && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Ditemukan {results.length} hasil
          </p>
          {results.length === 0 ? (
            <p className="text-gray-500 italic">Tidak ditemukan.</p>
          ) : (
            <ul className="grid gap-2">
              {results.map((w, i) => (
                <li key={i} className="bg-white p-3 rounded shadow">
                  <strong>{w.English}</strong> – {w.Indonesian}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
