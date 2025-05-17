import { useEffect, useState } from "react";
import { WordEntry } from "@/types";
import Cookies from "js-cookie";
import { Heart, HeartOff, Volume2 } from "lucide-react";

interface Props {
  allWords: WordEntry[];
}

export default function SearchWords({ allWords }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<WordEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showTranslation, setShowTranslation] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const favFromCookie = Cookies.get("favorites");
    if (favFromCookie) {
      setFavorites(JSON.parse(favFromCookie));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const filtered = allWords.filter(
      (w) =>
        w.English.toLowerCase().includes(lowerTerm) ||
        w.Indonesian.toLowerCase().includes(lowerTerm)
    );

    setResults(filtered);

    const hideTranslation = Cookies.get("hide_translation") === "false";
    const initialShow: Record<string, boolean> = {};
    filtered.forEach((word) => {
      initialShow[word.English] = !hideTranslation;
    });
    setShowTranslation(initialShow);
  }, [searchTerm, allWords]);

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

  const playPronunciation = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  const hideTranslation = Cookies.get("hide_translation") === "true";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
      <h1 className="text-2xl font-bold mb-4 text-center">🔍 Cari Kata</h1>
      <div className="flex justify-between items-center mb-4"></div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari kalimat..."
        className="w-full mb-6 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((w, i) => {
            const isFavorite = favorites.includes(w.English);
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
                  onClick={() =>
                    hideTranslation && toggleTranslation(w.English)
                  }
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
      ) : searchTerm.trim() !== "" ? (
        <div className="text-gray-500 text-center mt-4 italic">
          Tidak ditemukan hasil untuk {searchTerm}
        </div>
      ) : null}
    </div>
  );
}
