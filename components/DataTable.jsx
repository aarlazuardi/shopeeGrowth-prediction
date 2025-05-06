"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"

export default function DataTable({ data, setData }) {
  const [editableData, setEditableData] = useState(data)
  const [editCell, setEditCell] = useState(null)

  useEffect(() => {
    setEditableData(data)
  }, [data])

  const handleCellClick = (rowId, field) => {
    setEditCell({ rowId, field })
  }

  const handleCellChange = (e, rowId, field) => {
    const value = e.target.value

    const updatedData = editableData.map((row) => {
      if (row.id === rowId) {
        return { ...row, [field]: field === "date" ? value : Number(value) }
      }
      return row
    })

    setEditableData(updatedData)
  }

  const handleCellBlur = () => {
    setData(editableData)
    setEditCell(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCellBlur()
    }
  }

  const deleteRow = (id) => {
    const updatedData = editableData.filter((row) => row.id !== id)
    setEditableData(updatedData)
    setData(updatedData)
  }

  const formatValue = (value, field) => {
    if (field === "retention" || field === "conversionRate") {
      return (value * 100).toFixed(1) + "%"
    }
    return value.toLocaleString()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">New Users</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Active Users</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Retention Rate</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Conversion Rate</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {editableData.map((row) => (
            <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                {editCell?.rowId === row.id && editCell?.field === "date" ? (
                  <input
                    type="text"
                    value={row.date}
                    onChange={(e) => handleCellChange(e, row.id, "date")}
                    onBlur={handleCellBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full p-1 border border-[#FF6B00] rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(row.id, "date")}
                    className="cursor-pointer p-1 rounded hover:bg-gray-100 w-full"
                  >
                    {row.date}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {editCell?.rowId === row.id && editCell?.field === "newUsers" ? (
                  <input
                    type="number"
                    value={row.newUsers}
                    onChange={(e) => handleCellChange(e, row.id, "newUsers")}
                    onBlur={handleCellBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full p-1 border border-[#FF6B00] rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(row.id, "newUsers")}
                    className="cursor-pointer p-1 rounded hover:bg-gray-100 w-full"
                  >
                    {formatValue(row.newUsers, "newUsers")}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {editCell?.rowId === row.id && editCell?.field === "activeUsers" ? (
                  <input
                    type="number"
                    value={row.activeUsers}
                    onChange={(e) => handleCellChange(e, row.id, "activeUsers")}
                    onBlur={handleCellBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full p-1 border border-[#FF6B00] rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(row.id, "activeUsers")}
                    className="cursor-pointer p-1 rounded hover:bg-gray-100 w-full"
                  >
                    {formatValue(row.activeUsers, "activeUsers")}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {editCell?.rowId === row.id && editCell?.field === "retention" ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={row.retention}
                    onChange={(e) => handleCellChange(e, row.id, "retention")}
                    onBlur={handleCellBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full p-1 border border-[#FF6B00] rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(row.id, "retention")}
                    className="cursor-pointer p-1 rounded hover:bg-gray-100 w-full"
                  >
                    {formatValue(row.retention, "retention")}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {editCell?.rowId === row.id && editCell?.field === "conversionRate" ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={row.conversionRate}
                    onChange={(e) => handleCellChange(e, row.id, "conversionRate")}
                    onBlur={handleCellBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full p-1 border border-[#FF6B00] rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(row.id, "conversionRate")}
                    className="cursor-pointer p-1 rounded hover:bg-gray-100 w-full"
                  >
                    {formatValue(row.conversionRate, "conversionRate")}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                <button
                  onClick={() => deleteRow(row.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
