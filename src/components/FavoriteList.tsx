import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { WordEntry } from "@/types";
import { Heart, HeartOff, Volume2 } from "lucide-react";

interface Props {
  allWords: WordEntry[];
}

export default function FavoriteList({ allWords }: Props) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteWords, setFavoriteWords] = useState<WordEntry[]>([]);
  const [showTranslation, setShowTranslation] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const favKeys = Cookies.get("favorites");
    const hideTranslation = Cookies.get("hide_translation") === "true";

    if (favKeys) {
      const favList: string[] = JSON.parse(favKeys);
      setFavorites(favList);

      const matched = allWords.filter((w) => favList.includes(w.English));
      setFavoriteWords(matched);

      const show: Record<string, boolean> = {};
      matched.forEach((w) => {
        show[w.English] = !hideTranslation;
      });
      setShowTranslation(show);
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

    // Update list
    const updatedWords = allWords.filter((w) =>
      updatedFavorites.includes(w.English)
    );
    setFavoriteWords(updatedWords);
  };

  const toggleTranslation = (english: string) => {
    setShowTranslation((prev) => ({
      ...prev,
      [english]: !prev[english],
    }));
  };

  const playPronunciation = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech tidak didukung di browser ini.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">❤️ Favorit Saya</h1>

      {favoriteWords.length > 0 ? (
        <ul className="space-y-4">
          {favoriteWords.map((w) => {
            const isFavorite = favorites.includes(w.English);
            const isShown = showTranslation[w.English] ?? true;

            return (
              <li
                key={w.English}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-blue-50 transition shadow-sm"
              >
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() => toggleTranslation(w.English)}
                >
                  <div className="flex items-center space-x-3 text-lg font-medium text-blue-600">
                    <span>{w.English}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPronunciation(w.English);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label={`Play ${w.English}`}
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>
                  {isShown ? (
                    <p className="text-gray-700 mt-1">{w.Indonesian}</p>
                  ) : (
                    <p className="text-gray-400 mt-1 italic select-none">
                      Klik untuk lihat arti
                    </p>
                  )}
                </div>

                <button
                  onClick={() => toggleFavorite(w.English)}
                  className="text-red-500 hover:scale-110 transition"
                  aria-label={isFavorite ? "Unfavorite" : "Favorite"}
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
