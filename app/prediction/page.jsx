"use client"

import { useState } from "react"
import { Save, Play, RotateCcw, ChevronDown, ChevronUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import MethodCard from "@/components/MethodCard"
import GrowthChart from "@/components/GrowthChart"

export default function PredictionPage() {
  const [historicalData] = useState([
    { date: "2018", users: 450000, growth: 125000 },
    { date: "2019", users: 680000, growth: 230000 },
    { date: "2020", users: 920000, growth: 240000 },
    { date: "2021", users: 1250000, growth: 330000 },
    { date: "2022", users: 1680000, growth: 430000 },
  ])
  const [predictedData, setPredictedData] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("linear")
  const [forecastYears, setForecastYears] = useState(3)
  const [parameters, setParameters] = useState({
    growthRate: 15,
    seasonality: "moderate",
    retentionImpact: "medium",
    marketingBoost: 0,
  })
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [showMetrics, setShowMetrics] = useState({
    users: true,
    growth: true,
  })

  const runPrediction = () => {
    setIsLoading(true)

    setTimeout(() => {
      // This would be a real prediction algorithm in a production app
      const lastDataPoint = historicalData[historicalData.length - 1]
      const lastDate = lastDataPoint?.date || "2018"
      const lastUsers = Number(lastDataPoint?.users || 100000)
      const lastGrowth = Number(lastDataPoint?.growth || 30000)

      const lastYear = Number.parseInt(lastDate)

      // Generate prediction based on selected method and parameters
      const newPredictions = []

      for (let i = 1; i <= forecastYears; i++) {
        const newYear = lastYear + i
        const newDate = newYear.toString()

        // Different growth calculations based on method
        let growthMultiplier

        if (selectedMethod === "linear") {
          growthMultiplier = 1 + parameters.growthRate / 100
        } else if (selectedMethod === "polynomial") {
          growthMultiplier = Math.pow(1 + parameters.growthRate / 100, 1 + i * 0.1)
        } else if (selectedMethod === "spline") {
          // Add seasonal variation
          const seasonalFactor = 1 + Math.sin((Math.PI * i) / 3) * 0.1
          growthMultiplier = (1 + parameters.growthRate / 100) * seasonalFactor
        } else {
          growthMultiplier = 1 + parameters.growthRate / 100
        }

        // Apply marketing boost if specified
        if (parameters.marketingBoost > 0) {
          growthMultiplier += parameters.marketingBoost / 100
        }

        const growth = Math.round(lastGrowth * Math.pow(growthMultiplier, i))
        const users = Math.round(lastUsers + growth * i * 0.8)

        newPredictions.push({
          date: newDate,
          users,
          growth,
          isPrediction: true,
        })
      }

      setPredictedData(newPredictions)
      setCombinedData([...historicalData, ...newPredictions])
      setIsLoading(false)
    }, 1200)
  }

  const resetPrediction = () => {
    setPredictedData([])
    setCombinedData(historicalData)
  }

  const savePrediction = () => {
    // In a real app, this would save to a database
    alert("Skenario prediksi berhasil disimpan!")
  }

  const handleMetricChange = (metric) => {
    setShowMetrics({
      ...showMetrics,
      [metric]: !showMetrics[metric],
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Laboratorium Prediksi</h1>
      <p className="text-gray-600 mb-8">
        Terapkan metode interpolasi numerik untuk memprediksi pertumbuhan pengguna di masa depan
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="card h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Metode Interpolasi</h2>

            <div className="space-y-4">
              <MethodCard
                title="Interpolasi Linear"
                description="Memprediksi pertumbuhan dengan tingkat konstan berdasarkan data historis"
                accuracy="Sedang"
                isSelected={selectedMethod === "linear"}
                onClick={() => setSelectedMethod("linear")}
              />

              <MethodCard
                title="Interpolasi Polinomial"
                description="Memodelkan pola pertumbuhan yang semakin cepat pada adopsi viral"
                accuracy="Tinggi"
                isSelected={selectedMethod === "polynomial"}
                onClick={() => setSelectedMethod("polynomial")}
              />

              <MethodCard
                title="Interpolasi Spline Kubik"
                description="Menggabungkan pola siklikal dalam akuisisi pengguna"
                accuracy="Sangat Tinggi"
                isSelected={selectedMethod === "spline"}
                onClick={() => setSelectedMethod("spline")}
              />

              <MethodCard
                title="Interpolasi Lagrange"
                description="Menggunakan rumus matematika lanjutan untuk pola kompleks"
                accuracy="Tertinggi"
                isSelected={selectedMethod === "lagrange"}
                onClick={() => setSelectedMethod("lagrange")}
                isPremium={true}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Simulasi Skenario</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Periode Prediksi (Tahun)</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setForecastYears(Math.max(1, forecastYears - 1))}
                    className="p-2 bg-gray-100 rounded-l-md border border-gray-300"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-600 rotate-180" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={forecastYears}
                    onChange={(e) => setForecastYears(Number(e.target.value))}
                    className="w-16 text-center border-y border-gray-300 py-2"
                  />
                  <button
                    onClick={() => setForecastYears(Math.min(10, forecastYears + 1))}
                    className="p-2 bg-gray-100 rounded-r-md border border-gray-300"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Pertumbuhan Tahunan (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={parameters.growthRate}
                  onChange={(e) => setParameters({ ...parameters, growthRate: Number(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dampak Musiman</label>
                <select
                  value={parameters.seasonality}
                  onChange={(e) => setParameters({ ...parameters, seasonality: e.target.value })}
                  className="select-field"
                >
                  <option value="none">Tidak Ada</option>
                  <option value="mild">Ringan</option>
                  <option value="moderate">Sedang</option>
                  <option value="strong">Kuat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dampak Retensi</label>
                <select
                  value={parameters.retentionImpact}
                  onChange={(e) => setParameters({ ...parameters, retentionImpact: e.target.value })}
                  className="select-field"
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex items-center text-gray-700 hover:text-[#FF6B00] font-medium"
              >
                {advancedOpen ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                Parameter Lanjutan
              </button>

              {advancedOpen && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peningkatan Marketing (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={parameters.marketingBoost}
                      onChange={(e) => setParameters({ ...parameters, marketingBoost: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saturasi Pasar</label>
                    <select className="select-field">
                      <option>Rendah</option>
                      <option>Sedang</option>
                      <option>Tinggi</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={runPrediction} disabled={isLoading} className="btn-primary flex items-center">
                {isLoading ? (
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Jalankan Prediksi
              </button>

              <button
                onClick={resetPrediction}
                disabled={predictedData.length === 0}
                className="btn-outline flex items-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </button>

              <button
                onClick={savePrediction}
                disabled={predictedData.length === 0}
                className="btn-secondary flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan Skenario
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Perkiraan Pertumbuhan</h2>

        <div className="mb-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={showMetrics.users}
                onChange={() => handleMetricChange("users")}
                className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              Tampilkan Total Pengguna
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={showMetrics.growth}
                onChange={() => handleMetricChange("growth")}
                className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              Tampilkan Pertambahan Pengguna
            </label>
          </div>
        </div>

        <div className="h-[400px]">
          {combinedData.length > 0 ? (
            <GrowthChart data={combinedData} type="prediction" showLabels={true} showMetrics={showMetrics} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Jalankan prediksi untuk melihat hasil perkiraan
            </div>
          )}
        </div>
      </div>

      {predictedData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Prediksi Pengguna",
              value: predictedData[predictedData.length - 1].users.toLocaleString(),
              change: `+${Math.round((predictedData[predictedData.length - 1].users / historicalData[historicalData.length - 1].users - 1) * 100)}%`,
              color: "text-green-600",
            },
            {
              title: "Prediksi Pertambahan",
              value: predictedData[predictedData.length - 1].growth.toLocaleString(),
              change: `+${Math.round((predictedData[predictedData.length - 1].growth / historicalData[historicalData.length - 1].growth - 1) * 100)}%`,
              color: "text-green-600",
            },
            {
              title: "Tingkat Pertumbuhan",
              value: `${Math.round((predictedData[predictedData.length - 1].growth / predictedData[0].growth - 1) * 100)}%`,
              change: "",
              color: "text-green-600",
            },
            {
              title: "Keyakinan Prediksi",
              value:
                selectedMethod === "lagrange"
                  ? "92%"
                  : selectedMethod === "spline"
                    ? "85%"
                    : selectedMethod === "polynomial"
                      ? "78%"
                      : "70%",
              change: "",
              color: "text-gray-600",
            },
          ].map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                {stat.change && <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Link href="/data" className="btn-secondary flex items-center">
          Kembali ke Data
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>

        <Link href="/analysis" className="btn-primary flex items-center">
          Lanjut ke Analisis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
