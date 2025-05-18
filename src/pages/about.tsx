"use client";

import Head from "next/head";
import useSWR from "swr";
import ContributorList from "@/components/About";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AboutPage() {
  const { data: team, error, isLoading } = useSWR("/api/contributors", fetcher);

  return (
    <>
      <Head>
        <title>Tentang Kami</title>
      </Head>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Tentang Kami</h1>
        <p className="text-gray-700 mb-6">
          Aplikasi ini dikembangkan pada awalnya hanya untuk keperluan belajar
          saya sendiri, dengan beberapa fitur :
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>📖 Kalimat dan kata sehari-hari yang berguna.</li>
          <li>🔊 Fitur text-to-speech untuk pelafalan.</li>
          <li>❤️ Penandaan favorit untuk diulang belajar.</li>
          <li>🎲 Kata acak harian untuk variasi belajar.</li>
          <li>🔍 Pencarian kata cepat dan efisien.</li>
        </ul>
        <p>
          tetapi jika ada saran untuk meningkatkan fitur, silakan hubungi saya,
          bagi teman-teman yang ingin ikut berkontribusi menambahkan data
          kalimat bisa akses link spreadsheet ini :{" "}
          <a
            className="inline-block bg-blue-400 text-white px-3 py-1 rounded-full hover:bg-blue-800 transition"
            href="https://docs.google.com/spreadsheets/d/1hafGD9jmP-7NCwhAZ1I45s0D4RBl4t-gS2UlNBMMEvo/edit?hl=id&gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Link Spreadsheet Data Kalimat
          </a>{" "}
          dan jika nama teman ingin muncul di daftar kontributor bisa memasukan
          namanya di sheet kedua ya..
        </p>
        <br />
        <p>Terimakasih untuk para kontributor dalam aplikasi ini:</p>

        {isLoading && (
          <p className="text-gray-500 mt-4">Memuat kontributor...</p>
        )}
        {error && (
          <p className="text-red-500 mt-4">Gagal memuat data kontributor.</p>
        )}
        {team && <ContributorList team={team} />}
      </div>
    </>
  );
}
