import { useEffect, useState } from "react";
import { WordEntry } from "@/types";
import Cookies from "js-cookie";
import { Heart, HeartOff, Volume2 } from "lucide-react"; // ikon speaker

interface Props {
  initialWords: WordEntry[];
  limit: number;
}

export default function WordOfTheDay({ initialWords, limit }: Props) {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
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

  const toggleTranslation = (english: string) => {
    setShowTranslation((prev) => ({
      ...prev,
      [english]: !prev[english],
    }));
  };

  // Fungsi untuk play suara kata Inggris
  const playPronunciation = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // bahasa Inggris US
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech tidak didukung di browser ini.");
    }
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
                className="flex flex-col cursor-pointer"
                onClick={() => toggleTranslation(w.English)}
              >
                <div className="flex items-center space-x-2 text-lg font-medium text-blue-600">
                  <span>{w.English}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // supaya gak trigger toggle terjemahan juga
                      playPronunciation(w.English);
                    }}
                    aria-label={`Play pronunciation of ${w.English}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Volume2 size={20} />
                  </button>
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
