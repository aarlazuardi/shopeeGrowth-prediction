# Enhanced Calculator Implementation

To improve the calculator page with the enhanced interpolation functions, follow these integration steps:

## 1. Import the Enhanced Functions

Add this import at the top of your `page.jsx` file:

```jsx
import {
  improvedLinearInterpolation,
  improvedLagrangeInterpolation,
  improvedPolynomialInterpolation,
  improvedSplineInterpolation,
  validateInputs,
  loadExampleData,
  exportResultToCSV,
  generateChartPoints,
} from "./improvedFunctions";
```

## 2. Replace the Local Calculation Function

Update the `calculateLocally` function to use the improved implementations:

```jsx
const calculateLocally = () => {
  setIsCalculating(true);
  setErrorMessage(null);

  try {
    // Extract data from inputs
    const xValues = inputs.x.map(Number);
    const yValues = inputs.y.map(Number);
    const xToPredict = Number(inputs.xToPredict);

    // Validate inputs
    const validation = validateInputs(inputs, activeMethod);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage);
      setIsCalculating(false);
      return;
    }

    let interpolationResult;

    // Call the appropriate improved function based on the selected method
    if (activeMethod === "linear") {
      interpolationResult = improvedLinearInterpolation(
        xValues,
        yValues,
        xToPredict
      );
    } else if (activeMethod === "lagrange") {
      interpolationResult = improvedLagrangeInterpolation(
        xValues,
        yValues,
        xToPredict
      );
    } else if (activeMethod === "polynomial") {
      interpolationResult = improvedPolynomialInterpolation(
        xValues,
        yValues,
        xToPredict
      );
    } else if (activeMethod === "spline") {
      interpolationResult = improvedSplineInterpolation(
        xValues,
        yValues,
        xToPredict
      );
    }

    // Set results
    setResult(interpolationResult.interpolatedValue);
    setSteps(interpolationResult.steps);
  } catch (error) {
    console.error("Local calculation failed:", error);
    setErrorMessage(`Perhitungan gagal: ${error.message}`);
  } finally {
    setIsCalculating(false);
  }
};
```

## 3. Replace the Load Example Data Function

Update your example data loading function:

```jsx
// Load example data based on selected method
const handleLoadExampleData = () => {
  setInputs(loadExampleData(activeMethod));
  setErrorMessage(null);
};
```

Then update your button click handler:

```jsx
<button
  onClick={handleLoadExampleData}
  className="text-[#FF6B00] hover:text-[#E05A00] text-sm flex items-center"
>
  Muat Data Contoh
</button>
```

## 4. Replace the Export to CSV Function

Update the export function to use the improved version:

```jsx
// Export calculation results to CSV
const handleExportToCSV = () => {
  if (result !== null) {
    exportResultToCSV({
      method: activeMethod,
      x: inputs.x,
      y: inputs.y,
      xToPredict: inputs.xToPredict,
      result: result,
      steps: steps,
    });
  }
};
```

Then update your export button:

```jsx
<button
  onClick={handleExportToCSV}
  className="text-xs text-[#FF6B00] hover:text-[#E05A00]"
>
  Export hasil (.csv)
</button>
```

## 5. Update Chart Generation

Replace the chart generation logic:

```jsx
// Generate chart points for visualization
const chartPoints =
  result !== null
    ? generateChartPoints({
        method: activeMethod,
        x: inputs.x.map(Number),
        y: inputs.y.map(Number),
        xToPredict: Number(inputs.xToPredict),
        result: result,
      })
    : [];
```

Then update your chart component to use these points:

```jsx
<Chart
  options={{
    ...existingChartOptions,
  }}
  series={[
    {
      name: "Data Asli",
      type: "scatter",
      data: inputs.x.map((x, i) => ({
        x: Number(x),
        y: Number(inputs.y[i]),
      })),
    },
    {
      name: `Interpolasi ${
        activeMethod === "linear"
          ? "Linear"
          : activeMethod === "polynomial"
          ? "Polinomial"
          : activeMethod === "spline"
          ? "Spline"
          : "Lagrange"
      }`,
      data: chartPoints,
    },
  ]}
  type="line"
  height={300}
/>
```

## 6. Remove the Old Implementation Functions

You can safely remove these original functions since they've been replaced:

- `calculateLinearInterpolation`
- `calculateLagrangeInterpolation`
- `calculatePolynomialInterpolation`
- `calculateSplineInterpolation`

This will make your code more maintainable.

## 7. Update Input Validation

Replace the current `validateInputs` function with a call to the improved version:

```jsx
// Main calculate function - uses backend or local based on user preference
const calculate = () => {
  setErrorMessage(null);

  // Validate inputs first
  const validation = validateInputs(inputs, activeMethod);
  if (!validation.isValid) {
    setErrorMessage(validation.errorMessage);
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
```

## Key Benefits of This Integration

1. **More Accurate Calculations**: The improved algorithms handle edge cases better and provide more precise results
2. **Better Educational Value**: The enhanced step-by-step explanations make learning the mathematics clearer
3. **Improved User Experience**: Better error handling and data validation provide a more robust calculator
4. **Maintainable Code**: The separation of calculation logic into a dedicated file makes future improvements easier
5. **More Accurate Visualizations**: The improved chart generation creates more accurate visual representations

If you need any help implementing these changes or have any questions about the improved functions, please let me know!
