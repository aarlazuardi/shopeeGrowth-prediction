"use client"

import { useState, useEffect } from "react"
import { Download, Upload, Save, Plus, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"
import GrowthChart from "@/components/GrowthChart"

export default function DataPage() {
  const [data, setData] = useState([
    { id: 1, date: "2018", users: 450000, growth: 125000 },
    { id: 2, date: "2019", users: 680000, growth: 230000 },
    { id: 3, date: "2020", users: 920000, growth: 240000 },
    { id: 4, date: "2021", users: 1250000, growth: 330000 },
    { id: 5, date: "2022", users: 1680000, growth: 430000 },
  ])
  const [editCell, setEditCell] = useState(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [chartType, setChartType] = useState("dual")
  const [showLabels, setShowLabels] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState("all")
  const [startYear, setStartYear] = useState("2018")
  const [endYear, setEndYear] = useState("2022")
  const [filteredData, setFilteredData] = useState(data)
  const [showMetrics, setShowMetrics] = useState({
    users: true,
    growth: true,
  })

  useEffect(() => {
    if (dateRange === "custom") {
      setFilteredData(data.filter((item) => item.date >= startYear && item.date <= endYear))
    } else if (dateRange === "last3") {
      const sortedData = [...data].sort((a, b) => a.date - b.date)
      setFilteredData(sortedData.slice(-3))
    } else if (dateRange === "last5") {
      const sortedData = [...data].sort((a, b) => a.date - b.date)
      setFilteredData(sortedData.slice(-5))
    } else {
      setFilteredData(data)
    }
  }, [data, dateRange, startYear, endYear])

  const handleCellClick = (rowId, field) => {
    setEditCell({ rowId, field })
  }

  const handleCellChange = (e, rowId, field) => {
    const value = e.target.value
    const updatedData = data.map((row) => {
      if (row.id === rowId) {
        return { ...row, [field]: field === "date" ? value : Number(value) }
      }
      return row
    })
    setData(updatedData)
  }

  const handleCellBlur = () => {
    setEditCell(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCellBlur()
    }
  }

  const addNewRow = () => {
    const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1
    const lastDate = data.length > 0 ? data[data.length - 1].date : "2018"
    const newYear = Number.parseInt(lastDate) + 1

    setData([
      ...data,
      {
        id: newId,
        date: newYear.toString(),
        users: 0,
        growth: 0,
      },
    ])
  }

  const deleteRow = (id) => {
    setData(data.filter((row) => row.id !== id))
  }

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: "", type: "" }), 3000)
  }

  const handleSave = () => {
    showMessage("Data berhasil disimpan!", "success")
  }

  const handleImport = () => {
    showMessage("CSV berhasil diimpor!", "success")
  }

  const handleExport = () => {
    showMessage("Data berhasil diekspor ke CSV!", "success")
  }

  const handleExportImage = () => {
    alert("Gambar grafik berhasil diekspor!")
  }

  const handleMetricChange = (metric) => {
    setShowMetrics({
      ...showMetrics,
      [metric]: !showMetrics[metric],
    })
  }

  const formatValue = (value) => {
    return value.toLocaleString()
  }

  const getAvailableYears = () => {
    return [...new Set(data.map((item) => item.date))].sort()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Data & Visualisasi</h1>
      <p className="text-gray-600 mb-8">Kelola dan visualisasikan data pertumbuhan pengguna Anda</p>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Data Table Section - 5 columns */}
        <div className="lg:col-span-5">
          <div className="card mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex flex-wrap gap-3">
                <button onClick={handleImport} className="btn-primary flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Impor CSV
                </button>

                <button onClick={handleExport} className="btn-secondary flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Ekspor CSV
                </button>

                <button onClick={handleSave} className="btn-outline flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Data
                </button>
              </div>

              <button
                onClick={addNewRow}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Baris
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tahun</th>
                    <th>Pengguna</th>
                    <th>Pertambahan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td>
                        {editCell?.rowId === row.id && editCell?.field === "date" ? (
                          <input
                            type="text"
                            value={row.date}
                            onChange={(e) => handleCellChange(e, row.id, "date")}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            className="input-field"
                            autoFocus
                          />
                        ) : (
                          <div onClick={() => handleCellClick(row.id, "date")} className="editable-cell">
                            {row.date}
                          </div>
                        )}
                      </td>
                      <td>
                        {editCell?.rowId === row.id && editCell?.field === "users" ? (
                          <input
                            type="number"
                            value={row.users}
                            onChange={(e) => handleCellChange(e, row.id, "users")}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            className="input-field"
                            autoFocus
                          />
                        ) : (
                          <div onClick={() => handleCellClick(row.id, "users")} className="editable-cell">
                            {formatValue(row.users)}
                          </div>
                        )}
                      </td>
                      <td>
                        {editCell?.rowId === row.id && editCell?.field === "growth" ? (
                          <input
                            type="number"
                            value={row.growth}
                            onChange={(e) => handleCellChange(e, row.id, "growth")}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            className="input-field"
                            autoFocus
                          />
                        ) : (
                          <div onClick={() => handleCellClick(row.id, "growth")} className="editable-cell">
                            {formatValue(row.growth)}
                          </div>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Panduan Data</h2>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Masukkan data tahunan untuk prediksi pertumbuhan yang akurat</li>
                <li>Kolom "Pengguna" menunjukkan total pengguna pada tahun tersebut</li>
                <li>Kolom "Pertambahan" menunjukkan jumlah pengguna baru pada tahun tersebut</li>
                <li>Semua sel dapat diedit - klik pada sel untuk mengubah nilainya</li>
                <li>Gunakan fitur Impor/Ekspor untuk bekerja dengan dataset Anda sendiri</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualization Section - 7 columns */}
        <div className="lg:col-span-7">
          <div className="card">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">Tren Pertumbuhan Pengguna</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="select-field">
                  <option value="dual">Grafik Ganda</option>
                  <option value="bar">Diagram Batang</option>
                  <option value="line">Grafik Garis</option>
                </select>

                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="select-field">
                  <option value="all">Semua Waktu</option>
                  <option value="last3">3 Tahun Terakhir</option>
                  <option value="last5">5 Tahun Terakhir</option>
                  <option value="custom">Kustom</option>
                </select>

                <button onClick={handleExportImage} className="btn-primary flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Ekspor
                </button>
              </div>
            </div>

            {dateRange === "custom" && (
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Awal</label>
                  <select value={startYear} onChange={(e) => setStartYear(e.target.value)} className="select-field">
                    {getAvailableYears().map((year) => (
                      <option key={`start-${year}`} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Akhir</label>
                  <select value={endYear} onChange={(e) => setEndYear(e.target.value)} className="select-field">
                    {getAvailableYears().map((year) => (
                      <option key={`end-${year}`} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

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

            <div className="h-[400px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin"></div>
                </div>
              ) : (
                <GrowthChart data={filteredData} type={chartType} showLabels={showLabels} showMetrics={showMetrics} />
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Opsi Grafik</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      checked={showLabels}
                      onChange={() => setShowLabels(!showLabels)}
                      className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    Tampilkan Label Data
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Statistik</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Total Pengguna</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {filteredData.length > 0 ? filteredData[filteredData.length - 1].users.toLocaleString() : "0"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Pertumbuhan Tahunan</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {filteredData.length > 1
                        ? `${(((filteredData[filteredData.length - 1].users / filteredData[0].users) ** (1 / (filteredData.length - 1)) - 1) * 100).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="/prediction" className="btn-primary flex items-center">
          Lanjut ke Prediksi
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
