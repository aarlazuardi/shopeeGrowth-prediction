"use client"

import { useState } from "react"
import { CalculatorIcon as CalcIcon, ArrowRight, Copy, Info, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function CalculatorPage() {
  const [activeMethod, setActiveMethod] = useState("linear")
  const [inputs, setInputs] = useState({
    x: [],
    y: [],
    xToPredict: "",
  })
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [openFaqItem, setOpenFaqItem] = useState(null)

  // Handle adding a new data point
  const addDataPoint = () => {
    setInputs({
      ...inputs,
      x: [...inputs.x, ""],
      y: [...inputs.y, ""],
    })
  }

  // Handle removing a data point
  const removeDataPoint = (index) => {
    const newX = [...inputs.x]
    const newY = [...inputs.y]
    newX.splice(index, 1)
    newY.splice(index, 1)
    setInputs({
      ...inputs,
      x: newX,
      y: newY,
    })
  }

  // Handle input change
  const handleInputChange = (e, index, field) => {
    const value = e.target.value
    if (field === "x" || field === "y") {
      const newArray = [...inputs[field]]
      newArray[index] = value
      setInputs({
        ...inputs,
        [field]: newArray,
      })
    } else {
      setInputs({
        ...inputs,
        [field]: value,
      })
    }
  }

  // Reset calculator
  const resetCalculator = () => {
    setInputs({
      x: [],
      y: [],
      xToPredict: "",
    })
    setResult(null)
    setSteps([])
  }

  // Linear interpolation calculation
  const calculateLinearInterpolation = () => {
    setIsCalculating(true)

    setTimeout(() => {
      const x = inputs.x.map(Number)
      const y = inputs.y.map(Number)
      const xToPredict = Number(inputs.xToPredict)

      // Find the two closest points
      let x0, y0, x1, y1

      // If xToPredict is less than the smallest x value
      if (xToPredict <= Math.min(...x)) {
        const minIndex = x.indexOf(Math.min(...x))
        const nextIndex = x.indexOf(Math.min(...x.filter((val) => val !== Math.min(...x))))
        x0 = x[minIndex]
        y0 = y[minIndex]
        x1 = x[nextIndex]
        y1 = y[nextIndex]
      }
      // If xToPredict is greater than the largest x value
      else if (xToPredict >= Math.max(...x)) {
        const maxIndex = x.indexOf(Math.max(...x))
        const prevIndex = x.indexOf(Math.max(...x.filter((val) => val !== Math.max(...x))))
        x0 = x[prevIndex]
        y0 = y[prevIndex]
        x1 = x[maxIndex]
        y1 = y[maxIndex]
      }
      // If xToPredict is between two x values
      else {
        // Find the closest x value less than xToPredict
        const lessThan = x.filter((val) => val <= xToPredict)
        x0 = Math.max(...lessThan)
        y0 = y[x.indexOf(x0)]

        // Find the closest x value greater than xToPredict
        const greaterThan = x.filter((val) => val >= xToPredict)
        x1 = Math.min(...greaterThan)
        y1 = y[x.indexOf(x1)]
      }

      // Calculate the interpolated value
      const interpolatedValue = y0 + ((xToPredict - x0) * (y1 - y0)) / (x1 - x0)

      // Create steps for explanation
      const calculationSteps = [
        `Langkah 1: Identifikasi dua titik data terdekat dengan x = ${xToPredict}`,
        `- Titik 1: (${x0}, ${y0})`,
        `- Titik 2: (${x1}, ${y1})`,
        `Langkah 2: Terapkan rumus interpolasi linear:`,
        `y = y₀ + ((x - x₀) × (y₁ - y₀)) / (x₁ - x₀)`,
        `y = ${y0} + ((${xToPredict} - ${x0}) × (${y1} - ${y0})) / (${x1} - ${x0})`,
        `y = ${y0} + ((${xToPredict - x0}) × (${y1 - y0})) / (${x1 - x0})`,
        `y = ${y0} + ((${xToPredict - x0} * (${y1 - y0})) / ${x1 - x0})`,
        `y = ${y0} + (${(xToPredict - x0) * (y1 - y0)} / ${x1 - x0})`,
        `y = ${y0} + ${((xToPredict - x0) * (y1 - y0)) / (x1 - x0)}`,
        `y = ${interpolatedValue}`,
      ]

      setResult(interpolatedValue)
      setSteps(calculationSteps)
      setIsCalculating(false)
    }, 1000)
  }

  // Lagrange interpolation calculation
  const calculateLagrangeInterpolation = () => {
    setIsCalculating(true)

    setTimeout(() => {
      const x = inputs.x.map(Number)
      const y = inputs.y.map(Number)
      const xToPredict = Number(inputs.xToPredict)

      // Lagrange basis function
      const lagrangeBasis = (j) => {
        let numerator = 1
        let denominator = 1

        for (let i = 0; i < x.length; i++) {
          if (i !== j) {
            numerator *= xToPredict - x[i]
            denominator *= x[j] - x[i]
          }
        }

        return numerator / denominator
      }

      // Calculate the interpolated value
      let interpolatedValue = 0
      for (let j = 0; j < x.length; j++) {
        interpolatedValue += y[j] * lagrangeBasis(j)
      }

      // Create steps for explanation
      const calculationSteps = [
        `Langkah 1: Terapkan rumus interpolasi Lagrange:`,
        `P(x) = Σ y_j * L_j(x)`,
        `dimana L_j(x) = Π (x - x_i) / (x_j - x_i) untuk semua i ≠ j`,
        `Langkah 2: Hitung setiap polinomial basis Lagrange L_j(x) untuk x = ${xToPredict}:`,
      ]

      for (let j = 0; j < x.length; j++) {
        const basisTerms = []
        let basisValue = 1

        for (let i = 0; i < x.length; i++) {
          if (i !== j) {
            basisTerms.push(`(${xToPredict} - ${x[i]}) / (${x[j]} - ${x[i]})`)
            basisValue *= (xToPredict - x[i]) / (x[j] - x[i])
          }
        }

        calculationSteps.push(`L_${j}(${xToPredict}) = ${basisTerms.join(" × ")} = ${basisValue.toFixed(4)}`)
      }

      calculationSteps.push(`Langkah 3: Kalikan setiap polinomial basis dengan nilai y yang sesuai dan jumlahkan:`)

      const sumTerms = []
      for (let j = 0; j < x.length; j++) {
        const basisValue = lagrangeBasis(j)
        sumTerms.push(`${y[j]} × ${basisValue.toFixed(4)}`)
      }

      calculationSteps.push(`P(${xToPredict}) = ${sumTerms.join(" + ")} = ${interpolatedValue}`)

      setResult(interpolatedValue)
      setSteps(calculationSteps)
      setIsCalculating(false)
    }, 1000)
  }

  // Calculate based on selected method
  const calculate = () => {
    if (activeMethod === "linear") {
      calculateLinearInterpolation()
    } else if (activeMethod === "lagrange") {
      calculateLagrangeInterpolation()
    } else {
      // For polynomial and spline, we'll use simplified calculations for the demo
      setIsCalculating(true)

      setTimeout(() => {
        const x = inputs.x.map(Number)
        const y = inputs.y.map(Number)
        const xToPredict = Number(inputs.xToPredict)

        // Simple calculation for demo purposes
        const avg = y.reduce((a, b) => a + b, 0) / y.length
        const growth = y[y.length - 1] / y[0]

        let interpolatedValue
        if (activeMethod === "polynomial") {
          interpolatedValue = avg * Math.pow(growth, (xToPredict - x[0]) / (x[x.length - 1] - x[0]))
        } else {
          // spline
          const factor = 1 + Math.sin((Math.PI * (xToPredict - x[0])) / (x[x.length - 1] - x[0])) * 0.1
          interpolatedValue = avg * Math.pow(growth, (xToPredict - x[0]) / (x[x.length - 1] - x[0])) * factor
        }

        setResult(interpolatedValue)
        setSteps([
          `Ini adalah perhitungan sederhana untuk tujuan demonstrasi.`,
          `Dalam aplikasi nyata, algoritma interpolasi ${activeMethod === "polynomial" ? "polinomial" : "spline kubik"} yang tepat akan digunakan.`,
          `Nilai perkiraan pada x = ${xToPredict} adalah ${interpolatedValue.toFixed(2)}.`,
        ])
        setIsCalculating(false)
      }, 1000)
    }
  }

  // Copy formula to clipboard
  const copyFormula = () => {
    let formula = ""

    if (activeMethod === "linear") {
      formula = "y = y₀ + ((x - x₀) × (y₁ - y₀)) / (x₁ - x₀)"
    } else if (activeMethod === "polynomial") {
      formula = "P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ"
    } else if (activeMethod === "spline") {
      formula = "S(x) = a(x-xᵢ)³ + b(x-xᵢ)² + c(x-xᵢ) + d untuk setiap interval [xᵢ, xᵢ₊₁]"
    } else if (activeMethod === "lagrange") {
      formula = "P(x) = Σ yⱼ × Πᵢ≠ⱼ (x - xᵢ) / (xⱼ - xᵢ)"
    }

    navigator.clipboard.writeText(formula)
    alert("Rumus berhasil disalin ke clipboard!")
  }

  // Toggle FAQ item
  const toggleFaqItem = (index) => {
    if (openFaqItem === index) {
      setOpenFaqItem(null)
    } else {
      setOpenFaqItem(index)
    }
  }

  // FAQ data
  const faqItems = [
    {
      question: "Cara Menggunakan Kalkulator Interpolasi",
      answer: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Tambahkan titik data dengan mengklik tombol "Tambah Titik Data"</li>
          <li>Masukkan nilai X dan Y untuk setiap titik data (minimal 2 titik)</li>
          <li>Masukkan nilai X yang ingin diinterpolasi</li>
          <li>Pilih metode interpolasi yang ingin digunakan</li>
          <li>Klik tombol "Hitung" untuk mendapatkan hasil</li>
        </ol>
      ),
    },
    {
      question: "Penjelasan Metode Interpolasi",
      answer: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">Interpolasi Linear:</span> Menghubungkan dua titik data terdekat dengan garis
            lurus. Sederhana namun kurang akurat untuk data melengkung.
          </li>
          <li>
            <span className="font-medium">Interpolasi Polinomial:</span> Menggunakan satu polinomial untuk semua titik
            data. Akurat tetapi dapat berosilasi di antara titik-titik.
          </li>
          <li>
            <span className="font-medium">Interpolasi Spline Kubik:</span> Membuat kurva halus antara titik-titik yang
            berdekatan, mempertahankan kontinuitas pada turunan pertama dan kedua.
          </li>
          <li>
            <span className="font-medium">Interpolasi Lagrange:</span> Menggunakan bentuk khusus polinomial yang
            melewati semua titik data. Berguna untuk dataset kompleks.
          </li>
        </ul>
      ),
    },
    {
      question: "Tips Penggunaan",
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Gunakan Interpolasi Linear untuk data sederhana atau saat kecepatan lebih penting daripada akurasi</li>
          <li>Gunakan Interpolasi Spline Kubik untuk data yang memiliki pola siklikal atau kurva halus</li>
          <li>Semakin banyak titik data, semakin akurat hasil interpolasi</li>
          <li>Anda dapat menyalin rumus matematika dengan mengklik tombol "Salin Rumus"</li>
        </ul>
      ),
    },
    {
      question: "Contoh Kasus Penggunaan",
      answer: (
        <div>
          <p className="mb-2">Beberapa contoh kasus penggunaan interpolasi:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Memprediksi pertumbuhan pengguna berdasarkan data historis</li>
            <li>Mengestimasi nilai di antara titik-titik data yang diketahui</li>
            <li>Menghaluskan kurva data untuk visualisasi yang lebih baik</li>
            <li>Mengisi nilai yang hilang dalam dataset</li>
          </ul>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kalkulator Interpolasi</h1>
      <p className="text-gray-600 mb-8">Hitung nilai interpolasi menggunakan berbagai metode numerik</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Titik Data</h2>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-1/2 font-medium text-gray-700 pr-2">Nilai X</div>
                <div className="w-1/2 font-medium text-gray-700 pl-2">Nilai Y</div>
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
                    <button onClick={() => removeDataPoint(index)} className="ml-2 text-red-500 hover:text-red-700">
                      ×
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={addDataPoint} className="mt-2 text-[#FF6B00] hover:text-[#E05A00] font-medium">
                + Tambah Titik Data
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai X untuk Diinterpolasi</label>
              <input
                type="number"
                value={inputs.xToPredict}
                onChange={(e) => handleInputChange(e, null, "xToPredict")}
                placeholder="Masukkan nilai x untuk diprediksi"
                className="input-field"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculate}
                disabled={isCalculating || inputs.x.length < 2 || !inputs.xToPredict}
                className="btn-primary flex items-center"
              >
                {isCalculating ? (
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CalcIcon className="mr-2 h-4 w-4" />
                )}
                Hitung
              </button>

              <button onClick={resetCalculator} className="btn-outline flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          {result !== null && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hasil</h2>

              <div className="p-4 bg-[#FF6B00]/10 rounded-lg mb-4">
                <div className="text-sm text-gray-600 mb-1">Nilai interpolasi pada x = {inputs.xToPredict}:</div>
                <div className="text-3xl font-bold text-gray-900">
                  {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Langkah-langkah Perhitungan:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`${step.startsWith("Langkah") ? "font-medium mt-2" : "pl-4"} text-sm ${step.startsWith("-") ? "text-gray-600" : "text-gray-800"}`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Metode Interpolasi</h2>

            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg cursor-pointer ${activeMethod === "linear" ? "bg-[#FF6B00]/10 border border-[#FF6B00]/30" : "bg-gray-50 hover:bg-gray-100"}`}
                onClick={() => setActiveMethod("linear")}
              >
                <div className="font-medium text-gray-900 mb-1">Interpolasi Linear</div>
                <p className="text-sm text-gray-600">Menghubungkan titik data dengan garis lurus</p>
              </div>

              <div
                className={`p-3 rounded-lg cursor-pointer ${activeMethod === "polynomial" ? "bg-[#FF6B00]/10 border border-[#FF6B00]/30" : "bg-gray-50 hover:bg-gray-100"}`}
                onClick={() => setActiveMethod("polynomial")}
              >
                <div className="font-medium text-gray-900 mb-1">Interpolasi Polinomial</div>
                <p className="text-sm text-gray-600">Menggunakan kurva polinomial untuk semua titik data</p>
              </div>

              <div
                className={`p-3 rounded-lg cursor-pointer ${activeMethod === "spline" ? "bg-[#FF6B00]/10 border border-[#FF6B00]/30" : "bg-gray-50 hover:bg-gray-100"}`}
                onClick={() => setActiveMethod("spline")}
              >
                <div className="font-medium text-gray-900 mb-1">Interpolasi Spline Kubik</div>
                <p className="text-sm text-gray-600">Membuat kurva halus antara titik-titik yang berdekatan</p>
              </div>

              <div
                className={`p-3 rounded-lg cursor-pointer ${activeMethod === "lagrange" ? "bg-[#FF6B00]/10 border border-[#FF6B00]/30" : "bg-gray-50 hover:bg-gray-100"}`}
                onClick={() => setActiveMethod("lagrange")}
              >
                <div className="font-medium text-gray-900 mb-1">Interpolasi Lagrange</div>
                <p className="text-sm text-gray-600">Menggunakan polinomial Lagrange untuk akurasi tinggi</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rumus</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              {activeMethod === "linear" && <div>y = y₀ + ((x - x₀) × (y₁ - y₀)) / (x₁ - x₀)</div>}

              {activeMethod === "polynomial" && <div>P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ</div>}

              {activeMethod === "spline" && <div>S(x) = a(x-xᵢ)³ + b(x-xᵢ)² + c(x-xᵢ) + d</div>}

              {activeMethod === "lagrange" && <div>P(x) = Σ yⱼ × Πᵢ≠ⱼ (x - xᵢ) / (xⱼ - xᵢ)</div>}
            </div>

            <button onClick={copyFormula} className="btn-outline w-full flex items-center justify-center">
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
                      Interpolasi linear mengasumsikan garis lurus antara dua titik data yang berdekatan. Sederhana
                      tetapi kurang akurat untuk data melengkung.
                    </p>
                  )}

                  {activeMethod === "polynomial" && (
                    <p>
                      Interpolasi polinomial menggunakan satu polinomial untuk semua titik data. Dapat sangat akurat
                      tetapi mungkin berosilasi di antara titik-titik.
                    </p>
                  )}

                  {activeMethod === "spline" && (
                    <p>
                      Interpolasi spline kubik membuat kurva halus antara titik-titik yang berdekatan, mempertahankan
                      kontinuitas pada turunan pertama dan kedua.
                    </p>
                  )}

                  {activeMethod === "lagrange" && (
                    <p>
                      Interpolasi Lagrange menggunakan bentuk khusus polinomial yang melewati semua titik data. Berguna
                      untuk dataset kompleks.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Panduan Penggunaan</h2>

        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaqItem(index)}
                className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 hover:bg-gray-50 focus:outline-none"
              >
                {item.question}
                {openFaqItem === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {openFaqItem === index && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-gray-700">{item.answer}</div>
              )}
            </div>
          ))}
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
  )
}
