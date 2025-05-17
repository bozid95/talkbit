import { useEffect, useState } from "react";
import { WordEntry } from "@/types";
import Cookies from "js-cookie";
import { Heart, HeartOff, Volume2, Shuffle } from "lucide-react";

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

  // Fungsi shuffle untuk shuffle manual
  const shuffleWords = () => {
    const shuffled = [...initialWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);
    setWords(selected);
    Cookies.set("saved_words", JSON.stringify(selected), { expires: 3650 });

    // Reset showTranslation sesuai hide_translation
    const hideTranslation = Cookies.get("hide_translation") === "true";
    const initialShow: Record<string, boolean> = {};
    selected.forEach((word) => {
      initialShow[word.English] = !hideTranslation;
    });
    setShowTranslation(initialShow);

    // Update last_refresh supaya di-refresh manual juga dianggap baru
    Cookies.set("last_refresh", String(Date.now()), { expires: 3650 });
  };

  useEffect(() => {
    const now = Date.now();
    const lastRefresh = Number(Cookies.get("last_refresh") || 0);
    const refreshHours = Number(Cookies.get("refresh_interval") || 6);
    const hideTranslation = Cookies.get("hide_translation") === "true";

    const shouldRefresh = now - lastRefresh > refreshHours * 3600000;

    let selectedWords: WordEntry[] = [];

    if (shouldRefresh) {
      // Shuffle dan ambil limit kata
      const shuffled = [...initialWords].sort(() => Math.random() - 0.5);
      selectedWords = shuffled.slice(0, limit);
      Cookies.set("last_refresh", String(now), { expires: 3650 });
      Cookies.set("saved_words", JSON.stringify(selectedWords), {
        expires: 3650,
      });
    } else {
      // Ambil kata dari cookie, pastikan hanya ambil sesuai limit
      const savedWords = Cookies.get("saved_words");
      if (savedWords) {
        try {
          const parsed: WordEntry[] = JSON.parse(savedWords);
          selectedWords = parsed.slice(0, limit);
        } catch {
          selectedWords = initialWords.slice(0, limit);
        }
      } else {
        selectedWords = initialWords.slice(0, limit);
      }
    }

    setWords(selectedWords);

    // Load favorite dari cookie
    const favFromCookie = Cookies.get("favorites");
    if (favFromCookie) {
      try {
        setFavorites(JSON.parse(favFromCookie));
      } catch {
        setFavorites([]);
      }
    }

    // Set initial show translation sesuai hide_translation
    const initialShow: Record<string, boolean> = {};
    selectedWords.forEach((word) => {
      initialShow[word.English] = !hideTranslation;
    });
    setShowTranslation(initialShow);
  }, [initialWords, limit]);

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

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🎯 Kata/Kalimat Hari Ini</h2>
        <button
          onClick={shuffleWords}
          className="flex items-center space-x-1 px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          aria-label="Shuffle words"
          type="button"
        >
          <Shuffle size={18} />
          <span>Shuffle</span>
        </button>
      </div>
      <ul className="space-y-4">
        {words.map((w, i) => {
          const isFavorite = favorites.includes(w.English);
          const hideTranslation = Cookies.get("hide_translation") === "true";
          const isTranslationShown = hideTranslation
            ? showTranslation[w.English] || false
            : true;

          return (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-blue-50 transition"
            >
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => hideTranslation && toggleTranslation(w.English)}
              >
                <div className="flex items-center space-x-2 text-lg font-medium text-blue-600">
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
