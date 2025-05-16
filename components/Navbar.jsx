"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((v) => !v);

  // Daftar menu utama
  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Data & Visualisasi", href: "/data" },
    { name: "Prediksi", href: "/prediction" },
    { name: "Analisis", href: "/analysis" },
    { name: "Kalkulator", href: "/calculator" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-[#FF6B00] font-bold text-xl">Se</span>
              <span className="text-gray-800 font-bold text-xl">COP</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#FF6B00] px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
            <div className="relative ml-3 group">
              <button className="flex items-center text-gray-700 hover:text-[#FF6B00] px-3 py-2 rounded-md text-sm font-medium">
                Sumber Data
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <Link
                  href="/sumber-data"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sumber Data
                </Link>
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#FF6B00] focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#FF6B00] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/sumber-data"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF6B00] hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Sumber Data
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
