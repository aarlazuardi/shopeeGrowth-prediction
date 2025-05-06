import Link from "next/link"
import { ArrowRight, BarChart2, Calculator, Database, LineChart } from "lucide-react"

export default function Home() {
  // Ubah array features untuk menggabungkan Data dan Visualisasi
  const features = [
    {
      title: "Data & Visualisasi",
      description: "Kelola dan visualisasikan data pertumbuhan pengguna Anda dengan tabel dan grafik interaktif",
      icon: <Database className="h-10 w-10 text-white" />,
      link: "/data",
    },
    {
      title: "Model Prediksi",
      description: "Terapkan berbagai metode interpolasi numerik untuk memprediksi pertumbuhan masa depan",
      icon: <BarChart2 className="h-10 w-10 text-white" />,
      link: "/prediction",
    },
    {
      title: "Analisis Pertumbuhan",
      description: "Analisis hasil prediksi dan bandingkan metode interpolasi yang berbeda",
      icon: <LineChart className="h-10 w-10 text-white" />,
      link: "/analysis",
    },
    {
      title: "Kalkulator",
      description: "Perhitungan manual",
      icon: <Calculator className="h-10 w-10 text-white" />,
      link: "/calculator",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Prediksi Pertumbuhan <span className="text-[#FF6B00]">Shopee</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Prediksi pertumbuhan pengguna platform Shopee Anda dengan metode interpolasi numerik canggih
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <Link href={feature.link} key={index} className="group">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="bg-[#FF6B00] p-4">{feature.icon}</div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-[#FF6B00] font-medium group-hover:translate-x-1 transition-transform duration-300">
                  Jelajahi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mulai Sekarang</h2>
          <p className="text-gray-600 mb-6">
            Mulai perjalanan prediksi pertumbuhan Anda dengan mengimpor data Anda atau menggunakan dataset sampel kami
            untuk menjelajahi kemampuan platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/data" className="btn-primary flex items-center">
              Impor Data
              <Database className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/data" className="btn-secondary flex items-center">
              Lihat Analisis Sampel
              <LineChart className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
