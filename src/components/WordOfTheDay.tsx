import { useEffect, useState } from "react";
import { WordEntry } from "@/types";
import Cookies from "js-cookie";
import { Heart, HeartOff } from "lucide-react";

interface Props {
  initialWords: WordEntry[];
  limit: number;
}

export default function WordOfTheDay({ initialWords, limit }: Props) {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  // Simpan state "show/hide" terjemahan per kata, pakai objek keyed by English word
  const [showTranslation, setShowTranslation] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const shuffled = [...initialWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, limit));

    const favFromCookie = Cookies.get("favorites");
    if (favFromCookie) {
      setFavorites(JSON.parse(favFromCookie));
    }
    // Reset showTranslation saat kata berubah (opsional)
    setShowTranslation({});
  }, [initialWords, limit]);

  const toggleFavorite = (english: string) => {
    let updatedFavorites: string[];
    if (favorites.includes(english)) {
      updatedFavorites = favorites.filter((f) => f !== english);
    } else {
      updatedFavorites = [...favorites, english];
    }

    setFavorites(updatedFavorites);
    Cookies.set("favorites", JSON.stringify(updatedFavorites), { expires: 30 });
  };

  // Toggle show/hide terjemahan untuk kata tertentu
  const toggleTranslation = (english: string) => {
    setShowTranslation((prev) => ({
      ...prev,
      [english]: !prev[english],
    }));
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">🎯 Kata/Kalimat Hari Ini</h2>
      <ul className="space-y-4">
        {words.map((w, i) => {
          const isFavorite = favorites.includes(w.English);
          const isTranslationShown = showTranslation[w.English] || false;

          return (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-blue-50 transition"
            >
              <div
                className="cursor-pointer"
                onClick={() => toggleTranslation(w.English)}
              >
                <div className="text-lg font-medium text-blue-600">
                  {w.English}
                </div>
                {isTranslationShown ? (
                  <div className="text-gray-700 mt-1">{w.Indonesian}</div>
                ) : (
                  <div className="text-gray-400 mt-1 italic">
                    Klik untuk lihat arti
                  </div>
                )}
              </div>

              <button
                onClick={() => toggleFavorite(w.English)}
                className="text-red-500 hover:scale-110 transition"
                aria-label={isFavorite ? "Unfavorite" : "Favorite"}
              >
                {isFavorite ? <Heart className="fill-red-500" /> : <HeartOff />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
