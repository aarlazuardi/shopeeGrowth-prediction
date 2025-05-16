"use client";

import { useState } from "react";
import { Download, RefreshCw, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";
import GrowthChart from "@/components/GrowthChart";

export default function VisualizationPage() {
  const [chartData] = useState([
    {
      date: "2015",
      newUsers: 1000000,
      activeUsers: 1000000,
      retention: 0.7,
      conversionRate: 0.1,
    },
    {
      date: "2016",
      newUsers: 4000000,
      activeUsers: 5000000,
      retention: 0.72,
      conversionRate: 0.11,
    },
    {
      date: "2017",
      newUsers: 15000000,
      activeUsers: 20000000,
      retention: 0.74,
      conversionRate: 0.12,
    },
    {
      date: "2018",
      newUsers: 30000000,
      activeUsers: 50000000,
      retention: 0.76,
      conversionRate: 0.13,
    },
    {
      date: "2019",
      newUsers: 50000000,
      activeUsers: 100000000,
      retention: 0.78,
      conversionRate: 0.14,
    },
    {
      date: "2020",
      newUsers: 100000000,
      activeUsers: 200000000,
      retention: 0.8,
      conversionRate: 0.15,
    },
    {
      date: "2021",
      newUsers: 143000000,
      activeUsers: 343000000,
      retention: 0.81,
      conversionRate: 0.16,
    },
    {
      date: "2022",
      newUsers: 32000000,
      activeUsers: 375000000,
      retention: 0.82,
      conversionRate: 0.16,
    },
    {
      date: "2023",
      newUsers: 25000000,
      activeUsers: 400000000,
      retention: 0.83,
      conversionRate: 0.17,
    },
    {
      date: "2024",
      newUsers: 50000000,
      activeUsers: 450000000,
      retention: 0.84,
      conversionRate: 0.17,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [chartType, setChartType] = useState("dual");
  const [showLabels, setShowLabels] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleExportImage = () => {
    alert("Chart image exported!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Growth Visualization
      </h1>
      <p className="text-gray-600 mb-8">
        Visualize your user growth trends with interactive charts
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  User Growth Trends
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="select-field"
                >
                  <option value="all">All Time</option>
                  <option value="last3">Last 3 Years</option>
                  <option value="last5">Last 5 Years</option>
                  <option value="last10">Last 10 Years</option>
                </select>

                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="select-field"
                >
                  <option value="dual">Dual Axis</option>
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                </select>

                <button
                  onClick={handleRefresh}
                  className="btn-outline flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </button>

                <button
                  onClick={handleExportImage}
                  className="btn-primary flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="h-[400px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin"></div>
                </div>
              ) : (
                <GrowthChart
                  data={chartData}
                  type={chartType}
                  showLabels={showLabels}
                />
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chart Options
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={() => setShowLabels(!showLabels)}
                    className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  Show Data Labels
                </label>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  Metrics to Display
                </label>
                <div className="space-y-2">
                  <label className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      checked={true}
                      className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    New Users
                  </label>
                  <label className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      checked={true}
                      className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    Active Users
                  </label>
                  <label className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      checked={false}
                      className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    Retention Rate
                  </label>
                  <label className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      checked={false}
                      className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    Conversion Rate
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Chart Style</label>
                <select className="select-field">
                  <option>Default</option>
                  <option>Minimal</option>
                  <option>Detailed</option>
                  <option>Presentation</option>
                </select>
              </div>

              <div>
                <button className="btn-outline w-full flex items-center justify-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total New Users",
            value: "1,368,000",
            change: "+15.2%",
            color: "text-green-600",
          },
          {
            title: "Avg. Active Users",
            value: "996,000",
            change: "+8.7%",
            color: "text-green-600",
          },
          {
            title: "Avg. Retention Rate",
            value: "79.2%",
            change: "-1.2%",
            color: "text-red-600",
          },
          {
            title: "Avg. Conversion Rate",
            value: "13.8%",
            change: "+2.3%",
            color: "text-green-600",
          },
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span className={`text-sm font-medium ${stat.color}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Link href="/prediction" className="btn-primary flex items-center">
          Continue to Prediction
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
