import Cookies from "js-cookie";
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [limit, setLimit] = useState(10);
  const [hideTranslation, setHideTranslation] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(6); // jam

  useEffect(() => {
    const savedLimit = Number(Cookies.get("word_limit") || 10);
    const savedHide = Cookies.get("hide_translation") === "true";
    const savedInterval = Number(Cookies.get("refresh_interval") || 24);

    setLimit(savedLimit);
    setHideTranslation(savedHide);
    setRefreshInterval(savedInterval);
  }, []);

  const saveSettings = () => {
    Cookies.set("word_limit", String(limit), { expires: 3650 });
    Cookies.set("hide_translation", String(hideTranslation), { expires: 3650 });
    Cookies.set("refresh_interval", String(refreshInterval), { expires: 3650 });

    Cookies.remove("saved_words");
    Cookies.remove("last_refresh");

    alert("Pengaturan disimpan!");
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Pengaturan</title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-5 px-4">
        {/* Limit kata per hari */}
        <div className="mb-6">
          <label className="block font-semibold mb-3 text-gray-700">
            Jumlah Kata per Hari:
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {[5, 10, 15, 20].map((val) => (
              <option key={val} value={val}>
                {val} kata
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox sembunyikan terjemahan */}
        <div className="mb-6">
          <label className="inline-flex items-center space-x-3 cursor-pointer text-gray-700 font-semibold">
            <input
              type="checkbox"
              checked={hideTranslation}
              onChange={(e) => setHideTranslation(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span>Sembunyikan terjemahan (tampilkan saat diklik)</span>
          </label>
        </div>

        {/* Refresh interval */}
        <div className="mb-8">
          <label className="block font-semibold mb-3 text-gray-700">
            Refresh Kalimat Setiap:
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {[1, 3, 6, 12, 24].map((hour) => (
              <option key={hour} value={hour}>
                {hour} jam
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={saveSettings}
          className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-semibold"
        >
          Simpan Pengaturan
        </button>
      </main>
    </>
  );
}
