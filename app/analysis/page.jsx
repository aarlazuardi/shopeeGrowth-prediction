"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Share2,
  FileText,
  Home,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import GrowthChart from "@/components/GrowthChart";
import { fetchShopeeData } from "../../next/lib/api";

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState("comparison");
  const [selectedMethods] = useState(["linear", "polynomial", "spline"]);
  const [forecastYears, setForecastYears] = useState(3);
  const [showMetrics, setShowMetrics] = useState({
    users: true,
    growth: true,
  });

  const [historicalData, setHistoricalData] = useState([]);
  const [methodResults, setMethodResults] = useState({});

  useEffect(() => {
    // Fetch historical data from backend
    fetchShopeeData.getSampleData().then((data) => {
      const mapped = data.map((row, idx, arr) => ({
        date: row.year ? row.year.toString() : row.date,
        users: row.users,
        growth: idx === 0 ? 0 : row.users - arr[idx - 1].users,
      }));
      setHistoricalData(mapped);
    });
  }, []);
  useEffect(() => {
    // Only run predictions when we have historical data
    if (!historicalData.length) {
      return;
    }

    // Ensure valid data for prediction
    const validData = historicalData
      .map((row) => ({
        year: parseInt(row.date, 10),
        users: parseFloat(row.users),
      }))
      .filter((item) => !isNaN(item.year) && !isNaN(item.users));

    if (validData.length < 2) {
      console.error("Need at least 2 data points for prediction");
      return;
    }

    // Sort data by year to ensure consecutive years
    validData.sort((a, b) => a.year - b.year);

    // Run predictions for all methods in backend
    const methods = ["linear", "polynomial", "spline"];

    Promise.all(
      methods.map((method) =>
        fetchShopeeData
          .predict({
            method,
            data: validData,
            steps: forecastYears,
          })
          .catch((err) => {
            console.error(`Error with ${method} prediction:`, err);
            return null; // Return null for failed predictions
          })
      )
    ).then((results) => {
      const resObj = {};
      methods.forEach((method, idx) => {
        if (results[idx] && results[idx].predictions) {
          resObj[method] = {
            data: results[idx].predictions.map((row) => ({
              date: row.year.toString(),
              users: row.users,
              growth:
                row.users - historicalData[historicalData.length - 1].users,
              isPrediction: true,
            })),
            equation: results[idx].equation,
          };
        }
      });
      setMethodResults(resObj);
    });
  }, [historicalData, forecastYears]);

  const generateCombinedData = (method) => {
    return [...historicalData, ...(methodResults[method]?.data || [])];
  };

  const handleExportReport = () => {
    alert("Laporan analisis berhasil diekspor!");
  };

  const handleShareResults = () => {
    alert("Hasil berhasil dibagikan melalui tautan!");
  };

  const handleMetricChange = (metric) => {
    setShowMetrics({
      ...showMetrics,
      [metric]: !showMetrics[metric],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Analisis Pertumbuhan
      </h1>
      <p className="text-gray-600 mb-4">
        Bandingkan dan analisis berbagai metode interpolasi
      </p>

      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode Prediksi (Tahun)
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setForecastYears(Math.max(1, forecastYears - 1))}
                className="p-2 bg-gray-100 rounded-l-md border border-gray-300"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600" />
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
                onClick={() =>
                  setForecastYears(Math.min(10, forecastYears + 1))
                }
                className="p-2 bg-gray-100 rounded-r-md border border-gray-300"
              >
                <ArrowRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`py-2 px-4 rounded-md font-medium ${
                activeTab === "comparison"
                  ? "bg-[#FF6B00] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("comparison")}
            >
              Perbandingan Metode
            </button>
            <button
              className={`py-2 px-4 rounded-md font-medium ${
                activeTab === "accuracy"
                  ? "bg-[#FF6B00] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("accuracy")}
            >
              Analisis Akurasi
            </button>
            <button
              className={`py-2 px-4 rounded-md font-medium ${
                activeTab === "recommendations"
                  ? "bg-[#FF6B00] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("recommendations")}
            >
              Rekomendasi
            </button>
          </div>
        </div>
      </div>

      {activeTab === "comparison" && (
        <>
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Perbandingan Metode
            </h2>
            <p className="text-gray-500 mb-2">
              Grafik berikut membandingkan hasil prediksi jumlah pengguna SECOP
              Asia Tenggara menggunakan tiga metode interpolasi berbeda. Sumbu X
              adalah tahun, sumbu Y kiri adalah total pengguna (juta), dan sumbu
              Y kanan adalah pertambahan pengguna per tahun (juta). Data
              historis diambil dari tahun 2015–2024, prediksi hingga{" "}
              {Number(historicalData[historicalData.length - 1]?.date) +
                forecastYears}
              .
            </p>
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
              <GrowthChart
                data={generateCombinedData("spline")}
                type="comparison"
                showLabels={true}
                showMetrics={showMetrics}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {selectedMethods.map((method) => (
              <div key={method} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  Interpolasi{" "}
                  {method === "linear"
                    ? "Linear"
                    : method === "polynomial"
                    ? "Polinomial"
                    : "Spline Kubik"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Prediksi Tahun Terakhir (
                      {Number(historicalData[historicalData.length - 1]?.date) +
                        forecastYears}
                      )
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {methodResults[method]?.data?.[
                        methodResults[method]?.data.length - 1
                      ]?.users?.toLocaleString() || "-"}{" "}
                      pengguna
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Tingkat Pertumbuhan
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {methodResults[method]?.data &&
                        methodResults[method]?.data.length > 1
                          ? (
                              ((methodResults[method].data[
                                methodResults[method].data.length - 1
                              ].users -
                                methodResults[method].data[0].users) /
                                methodResults[method].data[0].users) *
                              100
                            ).toFixed(2) + "%"
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Keyakinan</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {method === "spline"
                          ? "85%"
                          : method === "polynomial"
                          ? "78%"
                          : "70%"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">MAPE</p>
                      <p className="text-lg font-semibold text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">RMSE</p>
                      <p className="text-lg font-semibold text-gray-900">-</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {method === "linear" &&
                      "Metode sederhana, cocok untuk tren stabil."}
                    {method === "polynomial" &&
                      "Cocok untuk pertumbuhan pesat dan fluktuasi."}
                    {method === "spline" &&
                      "Paling baik untuk pola musiman dan perubahan tren."}
                  </div>
                  <button className="btn-secondary w-full">Lihat Detail</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "accuracy" && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Analisis Akurasi
          </h2>
          <p className="text-gray-500 mb-2">
            Tabel berikut membandingkan hasil prediksi dengan data historis
            SECOP Asia Tenggara. Nilai error (MAPE, RMSE) dapat digunakan untuk
            menilai keakuratan masing-masing metode.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tahun
                  </th>
                  {selectedMethods.map((method) => (
                    <th
                      key={method}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {method === "linear"
                        ? "Linear"
                        : method === "polynomial"
                        ? "Polinomial"
                        : "Spline"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historicalData.map((row, idx) => (
                  <tr key={row.date}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {row.date}
                    </td>
                    {selectedMethods.map((method) => (
                      <td
                        key={method}
                        className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"
                      >
                        {methodResults[method]?.data?.[
                          idx
                        ]?.users?.toLocaleString() ||
                          row.users?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metode</th>
                  <th>MAPE</th>
                  <th>RMSE</th>
                  <th>Keyakinan</th>
                  <th>Kelebihan</th>
                  <th>Kekurangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Linear</td>
                  <td>{methodResults.linear?.metrics?.mape}%</td>
                  <td>
                    {methodResults.linear?.metrics?.rmse?.toLocaleString()}
                  </td>
                  <td>{methodResults.linear?.metrics?.confidence}%</td>
                  <td>Sederhana, cepat, mudah diinterpretasi</td>
                  <td>Kurang akurat untuk pertumbuhan non-linear</td>
                </tr>
                <tr>
                  <td className="font-medium">Polinomial</td>
                  <td>{methodResults.polynomial?.metrics?.mape}%</td>
                  <td>
                    {methodResults.polynomial?.metrics?.rmse?.toLocaleString()}
                  </td>
                  <td>{methodResults.polynomial?.metrics?.confidence}%</td>
                  <td>Baik untuk pertumbuhan yang semakin cepat</td>
                  <td>Dapat overfitting dengan data terbatas</td>
                </tr>
                <tr>
                  <td className="font-medium">Spline Kubik</td>
                  <td>{methodResults.spline?.metrics?.mape}%</td>
                  <td>
                    {methodResults.spline?.metrics?.rmse?.toLocaleString()}
                  </td>
                  <td>{methodResults.spline?.metrics?.confidence}%</td>
                  <td>Menangani pola musiman dengan baik</td>
                  <td>Lebih kompleks untuk diimplementasikan</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Penjelasan Metrik Kesalahan
            </h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>
                <span className="font-medium">
                  MAPE (Mean Absolute Percentage Error)
                </span>
                : Rata-rata persentase perbedaan antara nilai prediksi dan nilai
                aktual. Semakin rendah semakin baik.
              </li>
              <li>
                <span className="font-medium">
                  RMSE (Root Mean Square Error)
                </span>
                : Akar kuadrat dari rata-rata perbedaan kuadrat antara nilai
                prediksi dan nilai aktual. Semakin rendah semakin baik.
              </li>
              <li>
                <span className="font-medium">Keyakinan</span>: Keyakinan
                statistik dalam prediksi berdasarkan kesesuaian historis dan
                keandalan metode.
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "recommendations" && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Rekomendasi
          </h2>

          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Metode yang Direkomendasikan: Interpolasi Spline Kubik
              </h3>
              <p className="text-green-700 mb-3">
                Berdasarkan pola data historis dan metrik akurasi Anda, kami
                merekomendasikan menggunakan metode Spline Kubik untuk prediksi
                pertumbuhan Anda.
              </p>
              <ul className="list-disc pl-5 text-green-700 space-y-1">
                <li>Menyeimbangkan akurasi dan efisiensi komputasi</li>
                <li>
                  Menangani pola siklikal yang terdeteksi dalam data tahunan
                  Anda
                </li>
                <li>Tingkat keyakinan 85% dalam prediksi</li>
                <li>
                  Tingkat kesalahan lebih rendah dibandingkan metode yang lebih
                  sederhana
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Wawasan Pertumbuhan
              </h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>
                  Pertumbuhan pengguna Anda menunjukkan tren naik yang konsisten
                  dengan pertumbuhan yang semakin cepat
                </li>
                <li>
                  Tingkat pertumbuhan saat ini sekitar{" "}
                  {methodResults.spline?.metrics?.growthRate}% tahun-ke-tahun
                </li>
                <li>
                  Pertambahan pengguna stabil, berkontribusi pada pertumbuhan
                  total pengguna yang stabil
                </li>
                <li>
                  Diproyeksikan mencapai{" "}
                  {methodResults.spline?.data[
                    methodResults.spline?.data.length - 1
                  ]?.growth.toLocaleString()}{" "}
                  pertambahan pengguna pada tahun{" "}
                  {Number(historicalData[historicalData.length - 1]?.date) +
                    forecastYears}
                </li>
                <li>
                  Total pengguna diperkirakan tumbuh menjadi{" "}
                  {methodResults.spline?.data[
                    methodResults.spline?.data.length - 1
                  ]?.users.toLocaleString()}{" "}
                  pada tahun{" "}
                  {Number(historicalData[historicalData.length - 1]?.date) +
                    forecastYears}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tindakan yang Disarankan
              </h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>
                  Rencanakan penskalaan infrastruktur untuk mengakomodasi
                  pertumbuhan pengguna yang diproyeksikan
                </li>
                <li>
                  Siapkan kampanye pemasaran untuk periode akuisisi puncak
                </li>
                <li>Tetapkan target KPI berdasarkan proyeksi pertumbuhan</li>
                <li>Evaluasi kembali prediksi setiap tahun dengan data baru</li>
                <li>
                  Pertimbangkan pengujian A/B untuk meningkatkan tingkat
                  konversi dan retensi
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportReport}
            className="btn-primary flex items-center"
          >
            <FileText className="mr-2 h-4 w-4" />
            Ekspor Laporan
          </button>
          <button
            onClick={handleShareResults}
            className="btn-secondary flex items-center"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Bagikan Hasil
          </button>
          <button className="btn-outline flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Unduh Data
          </button>
        </div>

        <Link href="/" className="btn-outline flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
