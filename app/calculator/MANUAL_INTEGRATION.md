# Improved Calculator Functions - Integration Guide

## Overview

This guide explains how to integrate the enhanced interpolation algorithms from the `improvedFunctions.js` file into your calculator page. The enhanced functions provide better accuracy, error handling, and educational explanations.

## Key Improvements in the Enhanced Functions

1. **Better Data Handling**

   - Automatic sorting of data points for consistent results
   - Proper handling of exact matches (when x value is already in dataset)
   - Improved binary search for finding intervals
   - Better extrapolation algorithms

2. **Enhanced Error Handling**

   - Checking for minimum required data points
   - Detection of empty or non-numeric values
   - Prevention of division by zero
   - Method-specific validations (e.g., spline requiring 3+ points)

3. **Better Explanations**

   - More detailed step-by-step calculations
   - Improved formatting for mathematical expressions
   - Better polynomial term representation
   - Clearly labeled coefficients

4. **Helper Functions**
   - Example datasets for each interpolation method
   - CSV export functionality
   - Input validation function

## Integration Steps

Due to syntax issues in the main `page.jsx` file, we've provided two ways to integrate the improvements:

1. **Using the Integration Helper** - A helper module that provides drop-in replacement functions
2. **Manual Integration** - Step-by-step instructions for manually updating the code

### Option 1: Using the Integration Helper

1. Import the integration helper at the top of your calculator page:

```jsx
import {
  enhancedCalculateLocally,
  enhancedValidateInputs,
  enhancedLoadExampleData,
  enhancedExportToCSV,
} from "./integrationHelper";
```

2. Replace your existing functions with calls to the helper functions:

```jsx
// Replace calculateLocally
const calculateLocally = () => {
  enhancedCalculateLocally(
    inputs,
    activeMethod,
    setResult,
    setSteps,
    setErrorMessage,
    setIsCalculating
  );
};

// Replace validateInputs
const validateInputs = () => {
  const validation = enhancedValidateInputs(inputs, activeMethod);
  setErrorMessage(validation.isValid ? null : validation.errorMessage);
  return validation.isValid;
};

// Replace loadExampleData button handler
const handleLoadExample = () => {
  setInputs(enhancedLoadExampleData(activeMethod));
};

// Replace export to CSV button handler
const handleExportCSV = () => {
  enhancedExportToCSV({
    method: activeMethod,
    x: inputs.x,
    y: inputs.y,
    xToPredict: inputs.xToPredict,
    result,
    steps,
  });
};
```

3. Update your button onClick handlers to use these new functions.

### Option 2: Manual Integration

1. Import the improved functions at the top of your calculator page:

```jsx
// Import improved calculation functions
import {
  validateInputs,
  improvedLinearInterpolation,
  improvedLagrangeInterpolation,
  improvedPolynomialInterpolation,
  improvedSplineInterpolation,
  loadExampleData as loadExampleDataFunction,
  exportResultToCSV as exportToCSVFunction,
} from "./improvedFunctions";
```

2. Replace the `calculateLocally` function with this enhanced version:

```jsx
// Use local calculation with improved functions
const calculateLocally = () => {
  setIsCalculating(true);
  setErrorMessage(null);

  setTimeout(() => {
    try {
      // Extract data from inputs
      const xValues = inputs.x.map(Number);
      const yValues = inputs.y.map(Number);
      const xToPredict = Number(inputs.xToPredict);

      let result;

      // Call the appropriate improved function based on the selected method
      switch (activeMethod) {
        case "linear":
          result = improvedLinearInterpolation(xValues, yValues, xToPredict);
          break;
        case "lagrange":
          result = improvedLagrangeInterpolation(xValues, yValues, xToPredict);
          break;
        case "polynomial":
          result = improvedPolynomialInterpolation(
            xValues,
            yValues,
            xToPredict
          );
          break;
        case "spline":
          result = improvedSplineInterpolation(xValues, yValues, xToPredict);
          break;
        default:
          setErrorMessage(`Metode ${activeMethod} tidak dikenal`);
          setIsCalculating(false);
          return;
      }

      // Set results
      setResult(result.interpolatedValue);
      setSteps(result.steps);
    } catch (error) {
      console.error("Local calculation failed:", error);
      setErrorMessage(`Perhitungan gagal: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  }, 100);
};
```

3. Replace or add these helper functions:

```jsx
// Validate inputs using the improved validation
const validateLocalInputs = () => {
  const validation = validateInputs(inputs, activeMethod);

  if (!validation.isValid) {
    setErrorMessage(validation.errorMessage);
    return false;
  }

  return true;
};

// Load example data based on selected method
const loadExampleData = () => {
  setInputs(loadExampleDataFunction(activeMethod));
  setErrorMessage(null);
};

// Export calculation results to CSV
const exportResultToCSV = () => {
  if (result !== null) {
    exportToCSVFunction({
      method: activeMethod,
      x: inputs.x,
      y: inputs.y,
      xToPredict: inputs.xToPredict,
      result,
      steps,
    });
  }
};
```

4. Update the main `calculate` function to use the new validation:

```jsx
// Main calculate function - uses backend or local based on user preference
const calculate = () => {
  setErrorMessage(null);

  // Validate inputs first
  if (!validateLocalInputs()) {
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

5. Update your button onClick handlers:

```jsx
// Load example data button
<button
  onClick={loadExampleData}
  className="text-[#FF6B00] hover:text-[#E05A00] text-sm flex items-center"
>
  Muat Data Contoh
</button>

// Export to CSV button
<button
  onClick={exportResultToCSV}
  className="text-xs text-[#FF6B00] hover:text-[#E05A00]"
>
  Export hasil (.csv)
</button>
```

6. You can now safely remove the original interpolation functions:
   - `calculateLinearInterpolation`
   - `calculateLagrangeInterpolation`
   - `calculatePolynomialInterpolation`
   - `calculateSplineInterpolation`

## Running the Integration Script

For a guided integration process, you can also run the included integration script:

```bash
node ./app/calculator/integration-script.js
```

This script will provide color-coded instructions for each step of the integration.

## Testing the Integration

After integrating the improved functions:

1. Test each interpolation method with various input data
2. Verify that error handling works correctly for edge cases
3. Check that the explanations are more detailed and accurate
4. Test the example data loading feature
5. Test the CSV export functionality

If you encounter any issues during integration, please refer to the detailed API documentation in the `improvedFunctions.js` file.
