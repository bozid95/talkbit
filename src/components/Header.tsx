// components/Header.tsx
interface HeaderProps {
  title?: string;
}

export default function Header({ title = "TalkBit APP" }: HeaderProps) {
  return (
    <header className="bg-white shadow-md rounded-b-2xl py-4 mb-6 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-blue-600">{title}</h1>
      </div>
    </header>
  );
}
