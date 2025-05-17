import { useCallback, useEffect, useState } from "react";
import { WordEntry } from "@/types";
import Cookies from "js-cookie";
import { Heart, HeartOff, Volume2, RefreshCw } from "lucide-react";

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

  const playPronunciation = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech tidak didukung di browser ini.");
    }
  };

  // Fungsi shuffle kata & update cookie
  const shuffleWords = useCallback(() => {
    const shuffled = [...initialWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);
    setWords(selected);
    Cookies.set("saved_words", JSON.stringify(selected), { expires: 3650 });
    Cookies.set("last_refresh", String(Date.now()), { expires: 3650 });

    const hideTranslation = Cookies.get("hide_translation") === "true";
    const initialShow: Record<string, boolean> = {};
    selected.forEach((word) => {
      initialShow[word.English] = !hideTranslation;
    });
    setShowTranslation(initialShow);
  }, [initialWords, limit]);

  // Load saved_words dari cookie saat mount dan validasi dengan limit
  useEffect(() => {
    const saved = Cookies.get("saved_words");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as WordEntry[];
        // Jika jumlah kata yang tersimpan sesuai limit, gunakan itu
        if (parsed.length === limit) {
          setWords(parsed);

          const hideTranslation = Cookies.get("hide_translation") === "true";
          const initialShow: Record<string, boolean> = {};
          parsed.forEach((word) => {
            initialShow[word.English] = !hideTranslation;
          });
          setShowTranslation(initialShow);
          return; // keluar supaya shuffleWords tidak dipanggil
        }
      } catch (e) {
        console.error("Gagal parse saved_words:", e);
      }
    }
    // Kalau cookie tidak ada atau invalid / tidak sesuai limit, shuffle ulang
    shuffleWords();
  }, [limit, shuffleWords, initialWords]);

  // Load favorites dari cookie sekali saja saat mount
  useEffect(() => {
    const favFromCookie = Cookies.get("favorites");
    if (favFromCookie) {
      try {
        setFavorites(JSON.parse(favFromCookie));
      } catch {
        // ignore error
      }
    }
  }, []);

  const toggleFavorite = (english: string) => {
    let updatedFavorites: string[] = [];
    if (favorites.includes(english)) {
      updatedFavorites = favorites.filter((f) => f !== english);
    } else {
      updatedFavorites = [...favorites, english];
    }
    setFavorites(updatedFavorites);
    Cookies.set("favorites", JSON.stringify(updatedFavorites), {
      expires: 3650,
    });
  };

  const toggleTranslation = (english: string) => {
    setShowTranslation((prev) => ({
      ...prev,
      [english]: !prev[english],
    }));
  };

  const hideTranslation = Cookies.get("hide_translation") === "true";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🎯 Kalimat Hari Ini
      </h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-600">Kata Pilihan</h2>
        <button
          onClick={shuffleWords}
          title="Shuffle kata"
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <ul className="space-y-4">
        {words.map((w) => {
          const isFavorite = favorites.includes(w.English);
          const isTranslationShown = hideTranslation
            ? showTranslation[w.English] || false
            : true;

          return (
            <li
              key={w.English}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-blue-50 transition shadow-sm"
            >
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => hideTranslation && toggleTranslation(w.English)}
              >
                <div className="flex items-center space-x-3 text-lg font-medium text-blue-600">
                  <span>{w.English}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPronunciation(w.English);
                    }}
                    aria-label={`Play pronunciation of ${w.English}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
                {isTranslationShown ? (
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
                {isFavorite ? <Heart className="fill-red-500" /> : <HeartOff />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
