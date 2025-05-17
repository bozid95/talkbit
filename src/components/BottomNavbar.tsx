import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Heart, Search, Settings } from "lucide-react";

export default function BottomNavbar() {
  const router = useRouter();

  const navItems = [
    { href: "/", label: "Home", icon: <Home size={24} /> },
    { href: "/favorites", label: "Favorites", icon: <Heart size={24} /> },
    { href: "/search", label: "Search", icon: <Search size={24} /> },
    { href: "/settings", label: "Settings", icon: <Settings size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 max-w-3xl w-full bg-white border-t border-gray-300 shadow-inner flex justify-around items-center py-2">
      {navItems.map(({ href, label, icon }) => {
        const isActive = router.pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center text-sm ${
              isActive ? "text-blue-600" : "text-gray-600"
            } hover:text-blue-600 transition`}
            aria-current={isActive ? "page" : undefined}
          >
            {icon}
            <span className="mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
