// Shopee Growth Calculator - Integration Script
// This script integrates the improved interpolation functions with the main calculator page

// Step 1: Import the required modules
import React from "react";
import {
  validateInputs,
  improvedLinearInterpolation,
  improvedLagrangeInterpolation,
  improvedPolynomialInterpolation,
  improvedSplineInterpolation,
  loadExampleData,
  exportResultToCSV,
} from "./improvedFunctions";

/**
 * Enhanced version of calculateLocally that uses the improved functions
 * @param {Object} inputs - User input data
 * @param {string} activeMethod - Active interpolation method
 * @param {Function} setResult - Function to set result
 * @param {Function} setSteps - Function to set calculation steps
 * @param {Function} setErrorMessage - Function to set error messages
 * @param {Function} setIsCalculating - Function to set calculation state
 */
export const enhancedCalculateLocally = (
  inputs,
  activeMethod,
  setResult,
  setSteps,
  setErrorMessage,
  setIsCalculating
) => {
  setIsCalculating(true);
  setErrorMessage(null);

  setTimeout(() => {
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

/**
 * Enhanced version of validateInputs
 * @param {Object} inputs - User input data
 * @param {string} activeMethod - Active interpolation method
 * @returns {Object} Validation result
 */
export const enhancedValidateInputs = (inputs, activeMethod) => {
  return validateInputs(inputs, activeMethod);
};

/**
 * Enhanced version of loadExampleData
 * @param {string} method - Selected interpolation method
 * @returns {Object} Example data
 */
export const enhancedLoadExampleData = (method) => {
  return loadExampleData(method);
};

/**
 * Enhanced version of exportResultToCSV
 * @param {Object} data - Calculation results and input data
 */
export const enhancedExportToCSV = (data) => {
  exportResultToCSV(data);
};

/**
 * Main integration function - call this to replace the local calculation with improved functions
 * @param {Object} calculatorPage - Calculator page component
 */
export const integrateImprovedFunctions = (calculatorPage) => {
  // Replace the local calculation method
  calculatorPage.calculateLocally = (
    inputs,
    activeMethod,
    setResult,
    setSteps,
    setErrorMessage,
    setIsCalculating
  ) => {
    enhancedCalculateLocally(
      inputs,
      activeMethod,
      setResult,
      setSteps,
      setErrorMessage,
      setIsCalculating
    );
  };

  // Replace the validateInputs function
  calculatorPage.validateInputs = (inputs, activeMethod) => {
    return enhancedValidateInputs(inputs, activeMethod);
  };

  // Replace the loadExampleData function
  calculatorPage.loadExampleData = (method) => {
    return enhancedLoadExampleData(method);
  };

  // Replace the exportResultToCSV function
  calculatorPage.exportResultToCSV = (data) => {
    enhancedExportToCSV(data);
  };

  return calculatorPage;
};

// Export the integration function
export default integrateImprovedFunctions;
