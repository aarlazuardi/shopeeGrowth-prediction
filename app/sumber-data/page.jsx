"use client";

import { Card } from "@/components/ui/card";

const sumberData = [
  {
    title: "Statista: Shopee Annual Active Users Southeast Asia",
    url: "https://www.statista.com/statistics/1129415/shopee-annual-active-users-southeast-asia/",
    description:
      "Statistik jumlah pengguna aktif tahunan Shopee di Asia Tenggara.",
  },
  {
    title: "Sea Group Annual Reports",
    url: "https://www.sea.com/investor/annualreports",
    description:
      "Laporan tahunan resmi Sea Group (induk Shopee) yang memuat data pengguna dan keuangan.",
  },
  {
    title: "CNBC Indonesia: Berapa Pengguna Shopee di RI?",
    url: "https://www.cnbcindonesia.com/tech/20231010140013-37-487181/berapa-pengguna-shopee-di-ri-ini-jawabannya",
    description:
      "Berita dan analisis pertumbuhan pengguna Shopee di Indonesia.",
  },
  {
    title: "Liputan6: Berapa Jumlah Pengguna Shopee di Indonesia?",
    url: "https://www.liputan6.com/tekno/read/5459642/berapa-jumlah-pengguna-shopee-di-indonesia",
    description: "Berita jumlah pengguna Shopee di Indonesia.",
  },
];

export default function SumberDataPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Sumber Data</h1>
      <p className="mb-6 text-gray-600">
        Berikut adalah sumber data utama yang digunakan dalam aplikasi ini,
        termasuk statistik pengguna Shopee Asia Tenggara dan Indonesia:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sumberData.map((item, idx) => (
          <Card key={idx} className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-[#FF6B00]">
              {item.title}
            </h2>
            <p className="mb-2 text-gray-700">{item.description}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Lihat Sumber
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
