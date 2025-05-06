"use client"

export default function MethodCard({ title, description, accuracy, isSelected, onClick, isPremium = false }) {
  // Translate accuracy to Indonesian
  const translatedAccuracy =
    accuracy === "Highest"
      ? "Tertinggi"
      : accuracy === "Very High"
        ? "Sangat Tinggi"
        : accuracy === "High"
          ? "Tinggi"
          : accuracy === "Medium"
            ? "Sedang"
            : accuracy

  return (
    <div className={`method-card ${isSelected ? "active" : ""}`} onClick={onClick}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{title}</h3>
        {isPremium && (
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center">Premium</span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex items-center">
        <span className="text-xs font-medium text-gray-500 mr-2">Akurasi:</span>
        <span
          className={`text-xs font-medium ${
            translatedAccuracy === "Tertinggi"
              ? "text-green-600"
              : translatedAccuracy === "Sangat Tinggi"
                ? "text-green-500"
                : translatedAccuracy === "Tinggi"
                  ? "text-green-400"
                  : "text-yellow-500"
          }`}
        >
          {translatedAccuracy}
        </span>
      </div>
    </div>
  )
}
