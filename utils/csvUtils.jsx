export const parseCSV = (csvText) => {
  try {
    // Split by lines
    const lines = csvText.split("\n")

    // Extract headers
    const headers = lines[0].split(",").map((header) => header.trim())

    // Process data rows
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",").map((value) => value.trim())

      // Create object with headers as keys
      const row = {}
      headers.forEach((header, index) => {
        // Convert numeric values
        if (["newUsers", "activeUsers"].includes(header)) {
          row[header] = Number.parseInt(values[index]) || 0
        } else if (["retention", "conversionRate"].includes(header)) {
          row[header] = Number.parseFloat(values[index]) || 0
        } else {
          row[header] = values[index]
        }
      })

      data.push(row)
    }

    return data
  } catch (error) {
    console.error("Error parsing CSV:", error)
    return null
  }
}

export const exportToCSV = (data, filename) => {
  try {
    if (!data || data.length === 0) return

    // Get headers from first row
    const headers = Object.keys(data[0]).filter((key) => key !== "id" && key !== "isPrediction")

    // Create CSV content
    let csvContent = headers.join(",") + "\n"

    // Add data rows
    data.forEach((row) => {
      const values = headers.map((header) => row[header])
      csvContent += values.join(",") + "\n"
    })

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exporting CSV:", error)
  }
}
