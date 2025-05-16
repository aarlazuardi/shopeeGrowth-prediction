/**
 * File ini berisi fungsi-fungsi perhitungan interpolasi yang telah diperbaiki
 * untuk meningkatkan akurasi dan kinerja kalkulator interpolasi.
 */

/**
 * Melakukan interpolasi linear dengan penanganan kasus yang lebih baik
 * @param {Array<number>} xValues - Nilai-nilai x
 * @param {Array<number>} yValues - Nilai-nilai y
 * @param {number} xToPredict - Nilai x yang akan diprediksi
 * @returns {Object} Hasil interpolasi dan langkah perhitungan
 */
export const improvedLinearInterpolation = (xValues, yValues, xToPredict) => {
  // Create sorted arrays (to handle data in any order)
  const indices = Array.from({ length: xValues.length }, (_, i) => i).sort(
    (a, b) => xValues[a] - xValues[b]
  );
  const sortedX = indices.map((i) => xValues[i]);
  const sortedY = indices.map((i) => yValues[i]);

  // Find the two closest points
  let x0, y0, x1, y1;

  // Case 1: x is exactly at a data point
  const exactIndex = sortedX.indexOf(xToPredict);
  if (exactIndex !== -1) {
    // Return the exact y value with minimal steps
    const interpolatedValue = sortedY[exactIndex];
    const steps = [
      `Langkah 1: Nilai x = ${xToPredict} terdapat langsung dalam data`,
      `Titik tersebut adalah (${xToPredict}, ${interpolatedValue})`,
      `Langkah 2: Karena nilai x langsung ditemukan, tidak perlu interpolasi`,
      `y = ${interpolatedValue}`,
    ];

    return { interpolatedValue, steps };
  }

  // Case 2: Extrapolation or interpolation needed
  // Find correct interval using binary search approach
  let idx = 0;
  for (idx = 0; idx < sortedX.length - 1; idx++) {
    if (sortedX[idx] <= xToPredict && xToPredict <= sortedX[idx + 1]) {
      break; // Found the interval
    }
  }

  // Handle extrapolation cases
  if (xToPredict < sortedX[0]) {
    // Extrapolate below minimum x
    x0 = sortedX[0];
    y0 = sortedY[0];
    x1 = sortedX[1];
    y1 = sortedY[1];
  } else if (xToPredict > sortedX[sortedX.length - 1]) {
    // Extrapolate above maximum x
    x0 = sortedX[sortedX.length - 2];
    y0 = sortedY[sortedX.length - 2];
    x1 = sortedX[sortedX.length - 1];
    y1 = sortedY[sortedX.length - 1];
  } else {
    // Normal interpolation
    x0 = sortedX[idx];
    y0 = sortedY[idx];
    x1 = sortedX[idx + 1];
    y1 = sortedY[idx + 1];
  }

  // Calculate the interpolated value
  const interpolatedValue = y0 + ((xToPredict - x0) * (y1 - y0)) / (x1 - x0);

  // Create steps for explanation
  const steps = [
    `Langkah 1: Identifikasi dua titik data terdekat dengan x = ${xToPredict.toFixed(
      4
    )}`,
    `- Titik 1: (${x0}, ${y0})`,
    `- Titik 2: (${x1}, ${y1})`,
    `Langkah 2: Terapkan rumus interpolasi linear:`,
    `y = y₀ + ((x - x₀) × (y₁ - y₀)) / (x₁ - x₀)`,
    `y = ${y0} + ((${xToPredict} - ${x0}) × (${y1} - ${y0})) / (${x1} - ${x0})`,
    `y = ${y0} + ((${(xToPredict - x0).toFixed(4)}) × (${(y1 - y0).toFixed(
      4
    )})) / (${(x1 - x0).toFixed(4)})`,
    `y = ${y0} + (${((xToPredict - x0) * (y1 - y0)).toFixed(4)} / ${(
      x1 - x0
    ).toFixed(4)})`,
    `y = ${y0} + ${(((xToPredict - x0) * (y1 - y0)) / (x1 - x0)).toFixed(4)}`,
    `y = ${interpolatedValue.toFixed(4)}`,
  ];

  return { interpolatedValue, steps };
};

/**
 * Melakukan interpolasi Lagrange dengan akurasi lebih tinggi
 * @param {Array<number>} xValues - Nilai-nilai x
 * @param {Array<number>} yValues - Nilai-nilai y
 * @param {number} xToPredict - Nilai x yang akan diprediksi
 * @returns {Object} Hasil interpolasi dan langkah perhitungan
 */
export const improvedLagrangeInterpolation = (xValues, yValues, xToPredict) => {
  // Create sorted arrays (to handle data in any order)
  const indices = Array.from({ length: xValues.length }, (_, i) => i).sort(
    (a, b) => xValues[a] - xValues[b]
  );
  const sortedX = indices.map((i) => xValues[i]);
  const sortedY = indices.map((i) => yValues[i]);

  // Case: x is exactly at a data point
  const exactIndex = sortedX.indexOf(xToPredict);
  if (exactIndex !== -1) {
    // Return the exact y value with minimal steps
    const interpolatedValue = sortedY[exactIndex];
    const steps = [
      `Langkah 1: Nilai x = ${xToPredict} terdapat langsung dalam data`,
      `Titik tersebut adalah (${xToPredict}, ${interpolatedValue})`,
      `Langkah 2: Karena nilai x langsung ditemukan, tidak perlu interpolasi`,
      `y = ${interpolatedValue}`,
    ];

    return { interpolatedValue, steps };
  }

  // Lagrange basis function with improved numerical stability
  const lagrangeBasis = (j) => {
    let numerator = 1;
    let denominator = 1;

    for (let i = 0; i < sortedX.length; i++) {
      if (i !== j) {
        numerator *= xToPredict - sortedX[i];
        denominator *= sortedX[j] - sortedX[i];

        // Prevent division by zero
        if (Math.abs(sortedX[j] - sortedX[i]) < 1e-10) {
          return 0; // Return 0 for this basis function as points are too close
        }
      }
    }

    return numerator / denominator;
  };

  // Calculate the interpolated value with improved precision
  let interpolatedValue = 0;
  const basisValues = [];

  for (let j = 0; j < sortedX.length; j++) {
    const basis = lagrangeBasis(j);
    basisValues.push(basis);
    interpolatedValue += sortedY[j] * basis;
  }

  // Create steps for explanation
  const steps = [
    `Langkah 1: Terapkan rumus interpolasi Lagrange:`,
    `P(x) = Σ y_j * L_j(x)`,
    `dimana L_j(x) = Π (x - x_i) / (x_j - x_i) untuk semua i ≠ j`,
    `Langkah 2: Hitung setiap polinomial basis Lagrange L_j(x) untuk x = ${xToPredict}:`,
  ];

  for (let j = 0; j < sortedX.length; j++) {
    const basisTerms = [];

    for (let i = 0; i < sortedX.length; i++) {
      if (i !== j) {
        basisTerms.push(
          `(${xToPredict} - ${sortedX[i]}) / (${sortedX[j]} - ${sortedX[i]})`
        );
      }
    }

    steps.push(
      `L_${j}(${xToPredict}) = ${basisTerms.join(" × ")} = ${basisValues[
        j
      ].toFixed(6)}`
    );
  }

  steps.push(
    `Langkah 3: Kalikan setiap polinomial basis dengan nilai y yang sesuai dan jumlahkan:`
  );

  const sumTerms = [];
  let sumFormula = "P(" + xToPredict + ") = ";

  for (let j = 0; j < sortedX.length; j++) {
    sumTerms.push(`(${sortedY[j]} × ${basisValues[j].toFixed(6)})`);
    sumFormula +=
      (j > 0 ? " + " : "") + `${sortedY[j]} × ${basisValues[j].toFixed(6)}`;
  }

  steps.push(sumFormula);
  steps.push(
    `P(${xToPredict}) = ${sumTerms.join(" + ")} = ${interpolatedValue.toFixed(
      6
    )}`
  );

  return { interpolatedValue, steps };
};

/**
 * Melakukan interpolasi polinomial dengan Metode Newton yang lebih akurat
 * @param {Array<number>} xValues - Nilai-nilai x
 * @param {Array<number>} yValues - Nilai-nilai y
 * @param {number} xToPredict - Nilai x yang akan diprediksi
 * @returns {Object} Hasil interpolasi dan langkah perhitungan
 */
export const improvedPolynomialInterpolation = (
  xValues,
  yValues,
  xToPredict
) => {
  // Create sorted arrays (to handle data in any order)
  const indices = Array.from({ length: xValues.length }, (_, i) => i).sort(
    (a, b) => xValues[a] - xValues[b]
  );
  const sortedX = indices.map((i) => xValues[i]);
  const sortedY = indices.map((i) => yValues[i]);

  // Case: x is exactly at a data point
  const exactIndex = sortedX.indexOf(xToPredict);
  if (exactIndex !== -1) {
    // Return the exact y value with minimal steps
    const interpolatedValue = sortedY[exactIndex];
    const steps = [
      `Langkah 1: Nilai x = ${xToPredict} terdapat langsung dalam data`,
      `Titik tersebut adalah (${xToPredict}, ${interpolatedValue})`,
      `Langkah 2: Karena nilai x langsung ditemukan, tidak perlu interpolasi`,
      `y = ${interpolatedValue}`,
    ];

    return { interpolatedValue, steps };
  }

  const n = sortedX.length;

  // Create divided difference table
  const divDiff = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Fill in the first column with y values
  for (let i = 0; i < n; i++) {
    divDiff[i][0] = sortedY[i];
  }

  // Calculate the divided differences
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      divDiff[i][j] =
        (divDiff[i + 1][j - 1] - divDiff[i][j - 1]) /
        (sortedX[i + j] - sortedX[i]);
    }
  }

  // Calculate the interpolated value using Newton's form
  let interpolatedValue = divDiff[0][0];
  let term = 1;

  for (let i = 1; i < n; i++) {
    term *= xToPredict - sortedX[i - 1];
    interpolatedValue += divDiff[0][i] * term;
  }

  // Create steps for explanation
  const steps = [
    `Langkah 1: Membuat tabel perbedaan terbagi Newton untuk interpolasi polinomial`,
    `Tabel perbedaan terbagi:`,
  ];

  // Add divided difference table to steps with better formatting
  steps.push(
    `  x   |   f[x]   |  ${Array(Math.min(n - 1, 3))
      .fill()
      .map((_, i) => `f[x,x+${i + 1}]`)
      .join("  |  ")}`
  );

  for (let i = 0; i < n; i++) {
    let row = `${sortedX[i].toFixed(2)} | ${divDiff[i][0].toFixed(4)}`;
    for (let j = 1; j < Math.min(n - i, 4); j++) {
      row += ` | ${divDiff[i][j].toFixed(6)}`;
    }
    steps.push(row);
  }

  // Add polynomial expression with better formatting
  steps.push(
    `Langkah 2: Menghitung polinomial Newton menggunakan koefisien perbedaan terbagi:`
  );

  let polyExpr = `P(x) = ${divDiff[0][0].toFixed(4)}`;
  for (let i = 1; i < Math.min(n, 4); i++) {
    let termParts = [];
    for (let j = 0; j < i; j++) {
      termParts.push(`(x - ${sortedX[j].toFixed(2)})`);
    }

    const sign = divDiff[0][i] >= 0 ? " + " : " - ";
    polyExpr +=
      sign + `${Math.abs(divDiff[0][i]).toFixed(6)} × ${termParts.join(" × ")}`;
  }

  steps.push(polyExpr);
  steps.push(`Langkah 3: Mengevaluasi polinomial pada x = ${xToPredict}:`);
  steps.push(`P(${xToPredict}) = ${interpolatedValue.toFixed(6)}`);

  return { interpolatedValue, steps };
};

/**
 * Melakukan interpolasi Cubic Spline dengan penanganan edge case yang lebih baik
 * @param {Array<number>} xValues - Nilai-nilai x
 * @param {Array<number>} yValues - Nilai-nilai y
 * @param {number} xToPredict - Nilai x yang akan diprediksi
 * @returns {Object} Hasil interpolasi dan langkah perhitungan
 */
export const improvedSplineInterpolation = (xValues, yValues, xToPredict) => {
  // Create sorted arrays (to handle data in any order)
  const indices = Array.from({ length: xValues.length }, (_, i) => i).sort(
    (a, b) => xValues[a] - xValues[b]
  );
  const sortedX = indices.map((i) => xValues[i]);
  const sortedY = indices.map((i) => yValues[i]);

  // Case 1: x is exactly at a data point
  const exactIndex = sortedX.indexOf(xToPredict);
  if (exactIndex !== -1) {
    // Return the exact y value with minimal steps
    const interpolatedValue = sortedY[exactIndex];
    const steps = [
      `Langkah 1: Nilai x = ${xToPredict} terdapat langsung dalam data`,
      `Titik tersebut adalah (${xToPredict}, ${interpolatedValue})`,
      `Langkah 2: Karena nilai x langsung ditemukan, tidak perlu interpolasi`,
      `y = ${interpolatedValue}`,
    ];

    return { interpolatedValue, steps };
  }

  // Case 2: Not enough points for cubic spline
  const n = sortedX.length;
  if (n < 3) {
    const steps = [
      `Interpolasi spline kubik membutuhkan minimal 3 titik data.`,
      `Anda hanya memiliki ${n} titik. Mengganti ke interpolasi linear.`,
    ];
    return improvedLinearInterpolation(sortedX, sortedY, xToPredict);
  }

  // Case 3: Proceed with cubic spline
  // Step 1: Calculate the differences (h)
  const h = Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    h[i] = sortedX[i + 1] - sortedX[i];
    // Check for invalid h values
    if (Math.abs(h[i]) < 1e-10) {
      const steps = [
        `Error: Data memiliki nilai x yang terlalu dekat atau duplikat.`,
        `Nilai x harus unik dan terpisah untuk interpolasi spline.`,
        `Mencoba dengan interpolasi linear sebagai alternatif.`,
      ];
      return improvedLinearInterpolation(sortedX, sortedY, xToPredict);
    }
  }

  // Step 2: Initialize the tridiagonal matrix system
  const alpha = Array(n - 2).fill(0);
  for (let i = 0; i < n - 2; i++) {
    alpha[i] =
      (3 / h[i + 1]) * (sortedY[i + 2] - sortedY[i + 1]) -
      (3 / h[i]) * (sortedY[i + 1] - sortedY[i]);
  }

  // Step 3: Solve the tridiagonal system (simplified version for natural spline)
  const l = Array(n).fill(0);
  const mu = Array(n).fill(0);
  const z = Array(n).fill(0);

  l[0] = 1;
  mu[0] = 0;
  z[0] = 0;

  for (let i = 1; i < n - 1; i++) {
    l[i] = 2 * (sortedX[i + 1] - sortedX[i - 1]) - h[i - 1] * mu[i - 1];
    // Avoid division by zero
    if (Math.abs(l[i]) < 1e-10) {
      l[i] = 1e-10; // Small stabilizing value
    }
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i - 1] - h[i - 1] * z[i - 1]) / l[i];
  }

  l[n - 1] = 1;
  z[n - 1] = 0;

  // Step 4: Calculate the coefficients of cubic polynomials
  const c = Array(n).fill(0);
  const b = Array(n - 1).fill(0);
  const d = Array(n - 1).fill(0);

  for (let j = n - 2; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] =
      (sortedY[j + 1] - sortedY[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  // Step 5: Find the interval containing xToPredict
  let interval = -1;
  for (let i = 0; i < n - 1; i++) {
    if (sortedX[i] <= xToPredict && xToPredict <= sortedX[i + 1]) {
      interval = i;
      break;
    }
  }

  // Handle extrapolation
  if (interval === -1) {
    if (xToPredict < sortedX[0]) interval = 0;
    else interval = n - 2;
  }

  // Step 6: Evaluate the spline at xToPredict
  const dx = xToPredict - sortedX[interval];
  const interpolatedValue =
    sortedY[interval] +
    b[interval] * dx +
    c[interval] * dx * dx +
    d[interval] * dx * dx * dx;

  // Create steps for explanation
  const steps = [
    `Langkah 1: Mengurutkan titik data dan menghitung perbedaan (h):`,
    ...Array(Math.min(n - 1, 3))
      .fill()
      .map(
        (_, i) =>
          `h[${i}] = ${sortedX[i + 1]} - ${sortedX[i]} = ${h[i].toFixed(6)}`
      ),

    `Langkah 2: Membuat sistem persamaan tridiagonal untuk menentukan turunan kedua:`,
    `(Menyelesaikan sistem persamaan tridiagonal untuk koefisien spline)`,

    `Langkah 3: Mencari interval yang mengandung nilai x = ${xToPredict}:`,
    `Interval yang tepat: [${sortedX[interval].toFixed(4)}, ${sortedX[
      interval + 1
    ].toFixed(4)}]`,

    `Langkah 4: Menghitung koefisien spline kubik untuk interval ini:`,
    `a = ${sortedY[interval].toFixed(6)} (konstanta)`,
    `b = ${b[interval].toFixed(6)} (koefisien x)`,
    `c = ${c[interval].toFixed(6)} (koefisien x²)`,
    `d = ${d[interval].toFixed(6)} (koefisien x³)`,

    `Langkah 5: Mengevaluasi polinomial spline kubik pada x = ${xToPredict}:`,
    `S(x) = a + b(x-xi) + c(x-xi)² + d(x-xi)³`,
    `S(${xToPredict}) = ${sortedY[interval].toFixed(6)} + ${b[interval].toFixed(
      6
    )}(${xToPredict}-${sortedX[interval]}) + ${c[interval].toFixed(6)}(${(
      xToPredict - sortedX[interval]
    ).toFixed(6)})² + ${d[interval].toFixed(6)}(${(
      xToPredict - sortedX[interval]
    ).toFixed(6)})³`,
    `S(${xToPredict}) = ${sortedY[interval].toFixed(6)} + ${(
      b[interval] *
      (xToPredict - sortedX[interval])
    ).toFixed(6)} + ${(
      c[interval] * Math.pow(xToPredict - sortedX[interval], 2)
    ).toFixed(6)} + ${(
      d[interval] * Math.pow(xToPredict - sortedX[interval], 3)
    ).toFixed(6)}`,
    `S(${xToPredict}) = ${interpolatedValue.toFixed(6)}`,
  ];

  return { interpolatedValue, steps };
};

/**
 * Validasi input untuk memastikan data yang dimasukkan valid
 * @param {Object} inputs - Data input dari form
 * @param {string} method - Metode interpolasi yang digunakan
 * @returns {Object} Hasil validasi {isValid, errorMessage}
 */
export const validateInputs = (inputs, method) => {
  const x = inputs.x;
  const y = inputs.y;
  const xToPredict = inputs.xToPredict;

  // Check if we have enough data points
  if (x.length < 2) {
    return {
      isValid: false,
      errorMessage: "Dibutuhkan minimal 2 titik data untuk interpolasi.",
    };
  }

  // Check for empty values
  if (
    x.some((val) => val === "") ||
    y.some((val) => val === "") ||
    xToPredict === ""
  ) {
    return {
      isValid: false,
      errorMessage:
        "Semua nilai X, Y, dan nilai yang akan diinterpolasi harus diisi.",
    };
  }

  // Check for non-numeric values
  if (
    x.some((val) => isNaN(Number(val))) ||
    y.some((val) => isNaN(Number(val))) ||
    isNaN(Number(xToPredict))
  ) {
    return {
      isValid: false,
      errorMessage: "Semua nilai harus berupa angka.",
    };
  }

  // Check for duplicate X values
  const uniqueX = new Set(x.map(String));
  if (uniqueX.size !== x.length) {
    return {
      isValid: false,
      errorMessage: "Nilai X harus unik. Duplikat nilai tidak diperbolehkan.",
    };
  }

  // Method-specific validations
  if (method === "spline" && x.length < 3) {
    return {
      isValid: false,
      errorMessage:
        "Interpolasi spline kubik membutuhkan minimal 3 titik data.",
    };
  }

  return { isValid: true, errorMessage: null };
};

/**
 * Membuat data contoh berdasarkan metode interpolasi yang dipilih
 * @param {string} method - Metode interpolasi (linear, polynomial, spline, lagrange)
 * @returns {Object} Data contoh untuk input form
 */
export const loadExampleData = (method) => {
  // Different example data for different methods
  switch (method) {
    case "linear":
      // Simple linear growth
      return {
        x: ["1", "2", "3", "4", "5"],
        y: ["10", "20", "30", "40", "50"],
        xToPredict: "2.5",
      };

    case "polynomial":
      // Quadratic growth
      return {
        x: ["1", "2", "3", "4", "5"],
        y: ["1", "4", "9", "16", "25"],
        xToPredict: "3.5",
      };

    case "spline":
      // Non-linear pattern
      return {
        x: ["1", "2", "3", "5", "7", "8", "10"],
        y: ["3", "3.5", "5", "8", "6", "7", "10"],
        xToPredict: "6",
      };

    case "lagrange":
      // Complex pattern
      return {
        x: ["0", "1", "2", "4", "7"],
        y: ["1", "3", "-2", "5", "9"],
        xToPredict: "3",
      };

    default:
      // Default example
      return {
        x: ["1", "2", "3", "4", "5"],
        y: ["10", "20", "30", "40", "50"],
        xToPredict: "2.5",
      };
  }
};

/**
 * Export hasil perhitungan ke file CSV
 * @param {Object} data - Data untuk diekspor ke CSV
 * @param {string} data.method - Metode interpolasi
 * @param {Array<number>} data.x - Nilai-nilai x
 * @param {Array<number>} data.y - Nilai-nilai y
 * @param {number} data.xToPredict - Nilai x yang diprediksi
 * @param {number} data.result - Hasil interpolasi
 * @param {Array<string>} data.steps - Langkah-langkah perhitungan
 */
export const exportResultToCSV = (data) => {
  const { method, x, y, xToPredict, result, steps } = data;

  // Create the CSV content
  let csvContent = "data:text/csv;charset=utf-8,";

  // Add header
  csvContent +=
    "Metode Interpolasi: " +
    (method === "linear"
      ? "Linear"
      : method === "polynomial"
      ? "Polinomial"
      : method === "spline"
      ? "Spline Kubik"
      : "Lagrange") +
    "\n\n";

  // Add input data
  csvContent += "Data Input:\n";
  csvContent += "X,Y\n";

  for (let i = 0; i < x.length; i++) {
    csvContent += `${x[i]},${y[i]}\n`;
  }

  csvContent += "\nHasil Interpolasi:\n";
  csvContent += `X,${xToPredict}\n`;
  csvContent += `Y,${result}\n\n`;

  // Add steps/explanation
  csvContent += "Langkah-langkah Perhitungan:\n";
  steps.forEach((step) => {
    // Clean up step text for CSV format
    const cleanStep = step.replace(/,/g, ";");
    csvContent += cleanStep + "\n";
  });

  // Create a download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `interpolasi_${method}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);

  // Trigger download and clean up
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate points for interpolation chart
 * @param {Object} data - Data for chart generation
 * @param {string} data.method - Interpolation method
 * @param {Array<number>} data.x - X values
 * @param {Array<number>} data.y - Y values
 * @param {number} data.xToPredict - X value to predict
 * @param {number} data.result - Interpolation result
 * @returns {Array<Object>} Points for chart
 */
export const generateChartPoints = (data) => {
  const { method, x, y, xToPredict, result } = data;

  if (!result) return [];

  const min = Math.min(...x);
  const max = Math.max(...x);
  const range = max - min;
  const padding = range * 0.1; // Add 10% padding

  const start = Math.max(min - padding, 0); // Avoid negative if data is positive
  const end = max + padding;
  const step = range / 100; // 100 points for smooth curve

  const points = [];

  // Generate evenly spaced points for the curve
  for (let i = start; i <= end; i += step) {
    // Calculate y value based on method
    let yValue;

    if (method === "linear") {
      // Use the improved linear interpolation function
      const { interpolatedValue } = improvedLinearInterpolation(x, y, i);
      yValue = interpolatedValue;
    } else if (method === "polynomial") {
      // Use the improved polynomial interpolation function
      const { interpolatedValue } = improvedPolynomialInterpolation(x, y, i);
      yValue = interpolatedValue;
    } else if (method === "spline") {
      // Use the improved spline interpolation function
      const { interpolatedValue } = improvedSplineInterpolation(x, y, i);
      yValue = interpolatedValue;
    } else if (method === "lagrange") {
      // Use the improved Lagrange interpolation function
      const { interpolatedValue } = improvedLagrangeInterpolation(x, y, i);
      yValue = interpolatedValue;
    }

    points.push({ x: i, y: yValue });
  }

  return points;
};
