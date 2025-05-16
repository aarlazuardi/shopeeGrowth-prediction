export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

/**
 * API utility for Shopee Growth Prediction
 * @namespace fetchShopeeData
 */
export const fetchShopeeData = {
  /**
   * Predict growth using backend
   * @param {object} data - Prediction input
   * @returns {Promise<object>} Prediction result
   */
  predict: async (data) => {
    try {
      console.log(
        `Sending prediction to ${API_BASE}/predict with method: ${data.method}`
      );
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Try to parse error message from response
        const errorData = await res.json().catch(() => null);
        if (errorData && errorData.error) {
          throw new Error(
            `${errorData.error}: ${errorData.details || ""} (HTTP ${
              res.status
            })`
          );
        }
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("API error:", err);
      throw new Error("Gagal menghubungi backend: " + err.message);
    }
  },

  /**
   * Calculate interpolation using backend
   * @param {object} data - Calculation parameters
   * @param {string} data.method - Interpolation method (linear, polynomial, spline, lagrange)
   * @param {number[]} data.x - X values
   * @param {number[]} data.y - Y values
   * @param {number} data.xToPredict - X value to predict
   * @returns {Promise<object>} Calculation result
   */
  calculate: async (data) => {
    try {
      console.log(
        `Sending calculation to ${API_BASE}/calculator with method: ${data.method}`
      );
      const res = await fetch(`${API_BASE}/calculator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Try to parse error message from response
        const errorData = await res.json().catch(() => null);
        if (errorData && errorData.error) {
          throw new Error(
            `${errorData.error}: ${errorData.details || ""} (HTTP ${
              res.status
            })`
          );
        }
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("Calculator API error:", err);
      throw new Error("Gagal menghubungi backend kalkulator: " + err.message);
    }
  },
  /**
   * Get sample Shopee data from backend
   * @returns {Promise<object[]>} Sample data
   */
  getSampleData: async () => {
    try {
      const res = await fetch(`${API_BASE}/data/sample`);

      if (!res.ok) {
        // Try to parse error message from response
        const errorData = await res.json().catch(() => null);
        if (errorData && errorData.error) {
          throw new Error(`${errorData.error}: ${errorData.details || ""}`);
        }
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("API error:", err);
      throw new Error("Gagal mengambil data dari backend: " + err.message);
    }
  },
};
