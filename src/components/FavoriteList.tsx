// src/components/FavoriteList.tsx
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { WordEntry } from "@/types";
import { Heart, HeartOff } from "lucide-react";

interface Props {
  allWords: WordEntry[];
}

export default function FavoriteList({ allWords }: Props) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteWords, setFavoriteWords] = useState<WordEntry[]>([]);

  useEffect(() => {
    const favKeys = Cookies.get("favorites");
    if (favKeys) {
      const favList: string[] = JSON.parse(favKeys);
      setFavorites(favList);
      const matched = allWords.filter((w) => favList.includes(w.English));
      setFavoriteWords(matched);
    }
  }, [allWords]);

  const toggleFavorite = (english: string) => {
    let updatedFavorites: string[];
    if (favorites.includes(english)) {
      updatedFavorites = favorites.filter((f) => f !== english);
    } else {
      updatedFavorites = [...favorites, english];
    }
    setFavorites(updatedFavorites);
    Cookies.set("favorites", JSON.stringify(updatedFavorites), { expires: 30 });

    // Update favoriteWords untuk update UI
    const updatedWords = allWords.filter((w) =>
      updatedFavorites.includes(w.English)
    );
    setFavoriteWords(updatedWords);
  };

  return (
    <div>
      {favoriteWords.length > 0 ? (
        <ul className="space-y-4">
          {favoriteWords.map((w, i) => {
            const isFavorite = favorites.includes(w.English);
            return (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-blue-50 transition"
              >
                <div>
                  <div className="text-lg font-medium text-blue-600">
                    {w.English}
                  </div>
                  <div className="text-gray-700 mt-1">{w.Indonesian}</div>
                </div>
                <button
                  onClick={() => toggleFavorite(w.English)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  {isFavorite ? (
                    <Heart className="fill-red-500" />
                  ) : (
                    <HeartOff />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-gray-500 italic">
          Belum ada kata atau kalimat favorit.
        </p>
      )}
    </div>
  );
}
