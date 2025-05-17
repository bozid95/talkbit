import Cookies from "js-cookie";
import { useState, useEffect } from "react";

interface Props {
  limit: number;
  onLimitChange: (newLimit: number) => void;
}

export default function Settings({ limit, onLimitChange }: Props) {
  const [localLimit, setLocalLimit] = useState(limit);

  useEffect(() => {
    setLocalLimit(limit);
  }, [limit]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLocalLimit(newLimit);
    onLimitChange(newLimit);
    Cookies.set("word_limit", String(newLimit), { expires: 30 });
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">⚙️ Pengaturan</h1>
      <label className="block text-gray-700 mb-3 font-semibold text-lg">
        Tampilkan berapa kata per hari:
      </label>
      <select
        value={localLimit}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {[5, 10, 15, 20].map((val) => (
          <option key={val} value={val}>
            {val} kata
          </option>
        ))}
      </select>
    </div>
  );
}
