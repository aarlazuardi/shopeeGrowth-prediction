"use client";

import { useState, useEffect } from "react";
import {
  CalculatorIcon as CalcIcon,
  ArrowRight,
  Copy,
  Info,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Cloud,
  Cpu,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { API_BASE } from "../../next/lib/api";

// Import Chart.js dynamically to avoid SSR issues
const ChartComponent = dynamic(
  () => import("react-chartjs-2").then((mod) => ({ default: mod.Line })),
  { ssr: false }
);
import "chart.js/auto";

import {
  validateInputs as improvedValidateInputs,
  loadExampleData as improvedLoadExampleData,
  exportResultToCSV as improvedExportResultToCSV,
} from "./improvedFunctions";

export default function CalculatorPage() {
  const [activeMethod, setActiveMethod] = useState("linear");
  const [inputs, setInputs] = useState({
    x: [],
    y: [],
    xToPredict: "",
  });
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [openFaqItem, setOpenFaqItem] = useState(null);
  const [useBackend, setUseBackend] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking"); // "checking", "online", "offline"
  const [showChart, setShowChart] = useState(false);

  // Check if backend is available on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/data/sample`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // Short timeout to check quickly
          signal: AbortSignal.timeout(2000),
        });
        setBackendStatus(response.ok ? "online" : "offline");
      } catch (error) {
        console.error("Backend check failed:", error);
        setBackendStatus("offline");
        setUseBackend(false);
      }
    };

    checkBackendStatus();
  }, []);

  // Handle adding a new data point
  const addDataPoint = () => {
    setInputs({
      ...inputs,
      x: [...inputs.x, ""],
      y: [...inputs.y, ""],
    });
  };

  // Handle removing a data point
  const removeDataPoint = (index) => {
    const newX = [...inputs.x];
    const newY = [...inputs.y];
    newX.splice(index, 1);
    newY.splice(index, 1);
    setInputs({
      ...inputs,
      x: newX,
      y: newY,
    });
  };

  // Handle input change with validation
  const handleInputChange = (e, index, field) => {
    const value = e.target.value;

    // Clear error message when user edits inputs
    if (errorMessage) {
      setErrorMessage(null);
    }

    if (field === "x" || field === "y") {
      const newArray = [...inputs[field]];
      newArray[index] = value;

      // Validate for uniqueness of x values
      if (field === "x" && value) {
        const otherXValues = [...newArray];
        otherXValues.splice(index, 1);
        if (otherXValues.includes(value)) {
          setErrorMessage(
            "Nilai X harus unik. Duplikat nilai tidak diperbolehkan."
          );
        }
      }

      setInputs({
        ...inputs,
        [field]: newArray,
      });
    } else {
      setInputs({
        ...inputs,
        [field]: value,
      });
    }
  };

  // Reset calculator
  const resetCalculator = () => {
    setInputs({
      x: [],
      y: [],
      xToPredict: "",
    });
    setResult(null);
    setSteps([]);
    setErrorMessage(null);
  };

  // Validate inputs before calculating
  const validateInputs = () => {
    const validation = improvedValidateInputs(inputs, activeMethod);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage);
      return false;
    }
    return true;
  };

  // Load example data for the selected method
  const loadExampleData = () => {
    const example = improvedLoadExampleData(activeMethod);
    setInputs(example);
    setResult(null);
    setSteps([]);
    setErrorMessage(null);
  };

  // Main calculate function - uses backend or local based on user preference
  const calculate = () => {
    setErrorMessage(null);

    // Validate inputs first
    if (!validateInputs()) {
      return;
    }

    // Proceed with calculation
    if (useBackend && backendStatus !== "offline") {
      calculateUsingBackend().catch((error) => {
        console.error("Unhandled error in backend calculation:", error);
        calculateLocally();
      });
    } else {
      calculateLocally();
    }
  };

  // Copy formula to clipboard
  const copyFormula = () => {
    let formula = "";

    if (activeMethod === "linear") {
      formula = "y = y₀ + ((x - x₀) × (y₁ - y₀)) / (x₁ - x₀)";
    } else if (activeMethod === "polynomial") {
      formula = "P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ";
    } else if (activeMethod === "spline") {
      formula =
        "S(x) = a(x-xᵢ)³ + b(x-xᵢ)² + c(x-xᵢ) + d untuk setiap interval [xᵢ, xᵢ₊₁]";
    } else if (activeMethod === "lagrange") {
      formula = "P(x) = Σ yⱼ × Πᵢ≠ⱼ (x - xᵢ) / (xⱼ - xᵢ)";
    }

    navigator.clipboard.writeText(formula);
    alert("Rumus berhasil disalin ke clipboard!");
  };

  // Toggle FAQ item
  const toggleFaqItem = (index) => {
    if (openFaqItem === index) {
      setOpenFaqItem(null);
    } else {
      setOpenFaqItem(index);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Kalkulator Interpolasi
      </h1>
      <p className="text-gray-600 mb-8">
        Hitung nilai interpolasi menggunakan berbagai metode numerik
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Titik Data
            </h2>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-1/2 font-medium text-gray-700 pr-2">
                  Nilai X
                </div>
                <div className="w-1/2 font-medium text-gray-700 pl-2">
                  Nilai Y
                </div>
              </div>

              {inputs.x.map((_, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-1/2 pr-2">
                    <input
                      type="number"
                      value={inputs.x[index]}
                      onChange={(e) => handleInputChange(e, index, "x")}
                      placeholder={`x${index}`}
                      className="input-field"
                    />
                  </div>
                  <div className="w-1/2 pl-2 flex">
                    <input
                      type="number"
                      value={inputs.y[index]}
                      onChange={(e) => handleInputChange(e, index, "y")}
                      placeholder={`y${index}`}
                      className="input-field"
                    />
                    <button
                      onClick={() => removeDataPoint(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addDataPoint}
                className="mt-2 text-[#FF6B00] hover:text-[#E05A00] font-medium"
              >
                + Tambah Titik Data
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nilai X untuk Diinterpolasi
              </label>
              <input
                type="number"
                value={inputs.xToPredict}
                onChange={(e) => handleInputChange(e, null, "xToPredict")}
                placeholder="Masukkan nilai x untuk diprediksi"
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Metode Perhitungan
                </label>
                <div className="flex items-center">
                  <span
                    className={`text-xs mr-2 ${
                      !useBackend
                        ? "font-medium text-gray-800"
                        : "text-gray-500"
                    }`}
                  >
                    <Cpu className="inline-block w-3 h-3 mr-1" />
                    Lokal
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useBackend}
                      onChange={() => setUseBackend(!useBackend)}
                      className="sr-only peer"
                      disabled={backendStatus === "offline"}
                    />
                    <div
                      className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer 
                      ${
                        useBackend
                          ? "peer-checked:after:translate-x-full peer-checked:bg-[#FF6B00]"
                          : ""
                      }
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                      ${
                        backendStatus === "offline"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                    ></div>
                  </label>
                  <span
                    className={`text-xs ml-2 ${
                      useBackend ? "font-medium text-gray-800" : "text-gray-500"
                    }`}
                  >
                    <Cloud className="inline-block w-3 h-3 mr-1" />
                    Server
                  </span>
                </div>
              </div>

              {backendStatus === "checking" && (
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <div className="mr-2 h-3 w-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  Mengecek ketersediaan server...
                </div>
              )}

              {backendStatus === "offline" && (
                <div className="mt-1 text-xs text-red-500">
                  Server perhitungan sedang tidak tersedia. Menggunakan
                  perhitungan lokal.
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculate}
                disabled={
                  isCalculating || inputs.x.length < 2 || !inputs.xToPredict
                }
                className="btn-primary flex items-center"
              >
                {isCalculating ? (
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CalcIcon className="mr-2 h-4 w-4" />
                )}
                Hitung
              </button>

              <button
                onClick={resetCalculator}
                className="btn-outline flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </button>

              <button
                onClick={loadExampleData}
                className="text-[#FF6B00] hover:text-[#E05A00] text-sm flex items-center"
              >
                Muat Data Contoh
              </button>
            </div>
          </div>

          {result !== null && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hasil
              </h2>
              <div className="p-4 bg-[#FF6B00]/10 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-600">
                    Nilai interpolasi pada x = {inputs.xToPredict}:
                  </div>
                  <button
                    onClick={exportResultToCSV}
                    className="text-xs text-[#FF6B00] hover:text-[#E05A00]"
                  >
                    Export hasil (.csv)
                  </button>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {result.toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  {useBackend && backendStatus === "online" ? (
                    <>
                      <Cloud className="inline-block w-3 h-3 mr-1" />
                      Dihitung menggunakan API server
                    </>
                  ) : (
                    <>
                      <Cpu className="inline-block w-3 h-3 mr-1" />
                      Dihitung pada browser (client-side)
                    </>
                  )}
                </div>
              </div>

              <div className="flex mb-4 text-sm border-b border-gray-200">
                <div className="px-4 py-2 font-medium border-b-2 border-[#FF6B00] text-[#FF6B00]">
                  Metode:{" "}
                  {activeMethod === "linear"
                    ? "Linear"
                    : activeMethod === "polynomial"
                    ? "Polinomial"
                    : activeMethod === "spline"
                    ? "Spline Kubik"
                    : "Lagrange"}
                </div>
                <div className="px-4 py-2 text-gray-500">
                  {inputs.x.length} titik data
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">
                  Langkah-langkah Perhitungan:
                </h3>
                <button
                  onClick={() => setShowChart(!showChart)}
                  className="text-sm text-[#FF6B00] hover:text-[#E05A00] flex items-center"
                >
                  <LineChart className="w-4 h-4 mr-1" />
                  {showChart ? "Sembunyikan Grafik" : "Tampilkan Grafik"}
                </button>
              </div>

              {showChart && (
                <div className="mb-4 bg-white p-2 border border-gray-200 rounded-lg overflow-hidden">
                  {typeof window !== "undefined" && (
                    <ChartComponent
                      data={{
                        labels: inputs.x.map((x) => Number(x)),
                        datasets: [
                          {
                            label: "Data Asli",
                            data: inputs.y.map((y, i) => ({
                              x: Number(inputs.x[i]),
                              y: Number(y),
                            })),
                            borderColor: "#FF6B00",
                            backgroundColor: "#FF6B00",
                            fill: false,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            type: "linear",
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  )}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`${
                      step.startsWith("Langkah") ? "font-medium mt-2" : "pl-4"
                    } text-sm ${
                      step.startsWith("-")
                        ? "text-gray-600"
                        : step.startsWith("Error:")
                        ? "text-red-600"
                        : "text-gray-800"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Metode Interpolasi
            </h2>

            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg cursor-pointer ${
                  activeMethod === "linear"
                    ? "bg-[#FF6B00]/10 border border-[#FF6B00]/30"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setActiveMethod("linear")}
              >
                <div className="font-medium text-gray-900 mb-1">
                  Interpolasi Linear
                </div>
                <p className="text-sm text-gray-600">
                  Menghubungkan titik data dengan garis lurus
                </p>
              </div>

              <div
                className={`p-3 rounded-lg cursor-pointer ${
                  activeMethod === "polynomial"
                    ? "bg-[#FF6B00]/10 border border-[#FF6B00]/30"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setActiveMethod("polynomial")}
              >
                <div className="font-medium text-gray-900 mb-1">
                  Interpolasi Polinomial
                </div>
                <p className="text-sm text-gray-600">
                  Menggunakan kurva polinomial untuk semua titik data
                </p>
              </div>

              <div
                className={`p-3 rounded-lg cursor-pointer ${
                  activeMethod === "spline"
                    ? "bg-[#FF6B00]/10 border border-[#FF6B00]/30"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setActiveMethod("spline")}
              >
                <div className="font-medium text-gray-900 mb-1">
                  Interpolasi Spline Kubik
                </div>
                <p className="text-sm text-gray-600">
                  Membuat kurva halus antara titik-titik yang berdekatan
                </p>
              </div>

              <div
                className={`p-3 rounded-lg cursor-pointer ${
                  activeMethod === "lagrange"
                    ? "bg-[#FF6B00]/10 border border-[#FF6B00]/30"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setActiveMethod("lagrange")}
              >
                <div className="font-medium text-gray-900 mb-1">
                  Interpolasi Lagrange
                </div>
                <p className="text-sm text-gray-600">
                  Menggunakan polinomial Lagrange untuk akurasi tinggi
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rumus</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              {activeMethod === "linear" && (
                <div>y = y₀ + ((x - x₀) × (y₁ - y₀)) / (x₁ - x₀)</div>
              )}

              {activeMethod === "polynomial" && (
                <div>P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ</div>
              )}

              {activeMethod === "spline" && (
                <div>S(x) = a(x-xᵢ)³ + b(x-xᵢ)² + c(x-xᵢ) + d</div>
              )}

              {activeMethod === "lagrange" && (
                <div>P(x) = Σ yⱼ × Πᵢ≠ⱼ (x - xᵢ) / (xⱼ - xᵢ)</div>
              )}
            </div>

            <button
              onClick={copyFormula}
              className="btn-outline w-full flex items-center justify-center"
            >
              <Copy className="mr-2 h-4 w-4" />
              Salin Rumus
            </button>

            <div className="mt-4 p-4 bg-[#FF6B00]/5 rounded-lg border border-[#FF6B00]/20">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Deskripsi Metode</p>
                  {activeMethod === "linear" && (
                    <p>
                      Interpolasi linear mengasumsikan garis lurus antara dua
                      titik data yang berdekatan. Sederhana tetapi kurang akurat
                      untuk data melengkung.
                    </p>
                  )}

                  {activeMethod === "polynomial" && (
                    <p>
                      Interpolasi polinomial menggunakan satu polinomial untuk
                      semua titik data. Dapat sangat akurat tetapi mungkin
                      berosilasi di antara titik-titik.
                    </p>
                  )}

                  {activeMethod === "spline" && (
                    <p>
                      Interpolasi spline kubik membuat kurva halus antara
                      titik-titik yang berdekatan, mempertahankan kontinuitas
                      pada turunan pertama dan kedua.
                    </p>
                  )}

                  {activeMethod === "lagrange" && (
                    <p>
                      Interpolasi Lagrange menggunakan bentuk khusus polinomial
                      yang melewati semua titik data. Berguna untuk dataset
                      kompleks.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/prediction" className="btn-secondary flex items-center">
          Kembali ke Prediksi
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>

        <Link href="/analysis" className="btn-primary flex items-center">
          Ke Analisis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
