"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function GrowthChart({
  data,
  type = "dual",
  showLabels = true,
  showMetrics = { users: true, growth: true },
}) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Ensure X axis is always year (date)
    const labels = data.map((item) => item.date);

    if (type === "dual" || type === "line") {
      const datasets = [];

      if (showMetrics.users) {
        datasets.push({
          label: "Total Pengguna",
          data: data.map((item) => item.users),
          borderColor: "#0088CC",
          backgroundColor: "rgba(0, 136, 204, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#0088CC",
          pointRadius: 3,
          tension: 0.3,
          yAxisID: "y",
        });
      }

      if (showMetrics.growth) {
        datasets.push({
          label: "Pertambahan Pengguna",
          data: data.map((item) => item.growth),
          borderColor: "#FF6B00",
          backgroundColor: "rgba(255, 107, 0, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#FF6B00",
          pointRadius: 3,
          tension: 0.3,
          yAxisID: "y1",
        });
      }

      setChartData({
        labels,
        datasets,
      });
    } else if (type === "bar") {
      const datasets = [];

      if (showMetrics.users) {
        datasets.push({
          label: "Total Pengguna",
          data: data.map((item) => item.users),
          backgroundColor: "rgba(0, 136, 204, 0.7)",
          borderRadius: 4,
        });
      }

      if (showMetrics.growth) {
        datasets.push({
          label: "Pertambahan Pengguna",
          data: data.map((item) => item.growth),
          backgroundColor: "rgba(255, 107, 0, 0.7)",
          borderRadius: 4,
        });
      }

      setChartData({
        labels,
        datasets,
      });
    } else if (type === "prediction") {
      // Split data into historical and prediction
      const historicalData = data.filter((item) => !item.isPrediction);
      const predictionData = data.filter((item) => item.isPrediction);

      // Create datasets with a visual distinction between historical and prediction
      const usersHistorical = historicalData.map((item) => item.users);
      const usersPrediction = predictionData.map((item) => item.users);

      const growthHistorical = historicalData.map((item) => item.growth);
      const growthPrediction = predictionData.map((item) => item.growth);

      // Create labels for all data points (years)
      const allLabels = data.map((item) => item.date);

      // Ensure Y axes are not identical: users on left, growth on right
      const usersHistoricalFull = [
        ...usersHistorical,
        ...Array(predictionData.length).fill(null),
      ];
      const usersPredictionFull = [
        ...Array(historicalData.length).fill(null),
        ...usersPrediction,
      ];

      const growthHistoricalFull = [
        ...growthHistorical,
        ...Array(predictionData.length).fill(null),
      ];
      const growthPredictionFull = [
        ...Array(historicalData.length).fill(null),
        ...growthPrediction,
      ];

      const datasets = [];

      if (showMetrics.users) {
        datasets.push(
          {
            label: "Total Pengguna (Historis)",
            data: usersHistoricalFull,
            borderColor: "#0088CC",
            backgroundColor: "rgba(0, 136, 204, 0.1)",
            borderWidth: 2,
            pointBackgroundColor: "#0088CC",
            pointRadius: 3,
            tension: 0.3,
            yAxisID: "y",
          },
          {
            label: "Total Pengguna (Prediksi)",
            data: usersPredictionFull,
            borderColor: "#0088CC",
            backgroundColor: "rgba(0, 136, 204, 0.1)",
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: "#0088CC",
            pointRadius: 3,
            tension: 0.3,
            yAxisID: "y",
            fill: false,
          }
        );
      }

      if (showMetrics.growth) {
        datasets.push(
          {
            label: "Pertambahan Pengguna (Historis)",
            data: growthHistoricalFull,
            borderColor: "#FF6B00",
            backgroundColor: "rgba(255, 107, 0, 0.1)",
            borderWidth: 2,
            pointBackgroundColor: "#FF6B00",
            pointRadius: 3,
            tension: 0.3,
            yAxisID: "y1",
          },
          {
            label: "Pertambahan Pengguna (Prediksi)",
            data: growthPredictionFull,
            borderColor: "#FF6B00",
            backgroundColor: "rgba(255, 107, 0, 0.1)",
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: "#FF6B00",
            pointRadius: 3,
            tension: 0.3,
            yAxisID: "y1",
            fill: false,
          }
        );
      }

      setChartData({
        labels: allLabels,
        datasets,
      });
    } else if (type === "comparison") {
      // For method comparison chart
      const historicalData = data.filter((item) => !item.isPrediction);
      const predictionData = data.filter((item) => item.isPrediction);

      const labels = data.map((item) => item.date);

      setChartData({
        labels,
        datasets: [
          {
            label: "Data Historis",
            data: [
              ...historicalData.map((item) => item.growth),
              ...Array(predictionData.length).fill(null),
            ],
            borderColor: "#333333",
            backgroundColor: "rgba(51, 51, 51, 0.1)",
            borderWidth: 2,
            pointBackgroundColor: "#333333",
            pointRadius: 4,
            tension: 0.3,
          },
          {
            label: "Interpolasi Linear",
            data: [
              ...Array(historicalData.length).fill(null),
              ...predictionData.map((item) => item.growth * 0.97),
            ],
            borderColor: "#FF6B00",
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: "#FF6B00",
            pointRadius: 3,
            tension: 0.3,
          },
          {
            label: "Interpolasi Polinomial",
            data: [
              ...Array(historicalData.length).fill(null),
              ...predictionData.map((item) => item.growth * 1.02),
            ],
            borderColor: "#0088CC",
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: "#0088CC",
            pointRadius: 3,
            tension: 0.3,
          },
          {
            label: "Interpolasi Spline Kubik",
            data: [
              ...Array(historicalData.length).fill(null),
              ...predictionData.map((item) => item.growth),
            ],
            borderColor: "#22C55E",
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: "#22C55E",
            pointRadius: 3,
            tension: 0.3,
          },
        ],
      });
    }
  }, [data, type, showLabels, showMetrics]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 6,
        boxPadding: 6,
      },
    },
    scales:
      type === "dual" || type === "prediction"
        ? {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              type: "linear",
              display: showMetrics.users,
              position: "left",
              title: {
                display: true,
                text: "Total Pengguna",
                font: {
                  size: 12,
                  weight: "normal",
                },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            y1: {
              type: "linear",
              display: showMetrics.growth,
              position: "right",
              title: {
                display: true,
                text: "Pertambahan Pengguna",
                font: {
                  size: 12,
                  weight: "normal",
                },
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          }
        : {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
          },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  if (!showLabels) {
    options.plugins.datalabels = {
      display: false,
    };
  }

  return (
    <div className="h-full w-full">
      {type === "bar" ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
}
