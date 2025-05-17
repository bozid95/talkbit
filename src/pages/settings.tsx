// src/pages/settings.tsx
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Head from "next/head";
import router from "next/router";

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

    alert("Pengaturan disimpan!");
    router.push("/"); // arahkan kembali ke halaman utama
  };

  return (
    <>
      <Head>
        <title>Pengaturan</title>
      </Head>
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">⚙️ Pengaturan</h1>

        <div className="mb-4">
          <label className="block font-medium mb-2">
            Jumlah Kata per Hari:
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded-xl"
          >
            {[5, 10, 15, 20].map((val) => (
              <option key={val} value={val}>
                {val} kata
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hideTranslation}
              onChange={(e) => setHideTranslation(e.target.checked)}
            />
            <span>Sembunyikan terjemahan (tampilkan saat diklik)</span>
          </label>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">
            Refresh Kalimat Setiap:
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded-xl"
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
          className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600"
        >
          Simpan Pengaturan
        </button>
      </main>
    </>
  );
}
