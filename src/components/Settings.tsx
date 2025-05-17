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
    <div className="mb-6">
      <label className="block text-gray-700 mb-2 font-medium">
        Tampilkan berapa kata per hari:
      </label>
      <select
        value={localLimit}
        onChange={handleChange}
        className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
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
