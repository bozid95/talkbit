// src/components/SearchBar.tsx
import { useState } from "react";
import { Search } from "lucide-react"; // Gunakan ikon dari lucide-react

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [input, setInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full mb-6">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={20}
      />
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Cari kata atau terjemahan..."
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
      />
    </div>
  );
}
