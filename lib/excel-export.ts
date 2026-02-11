import * as XLSX from "xlsx"

export function exportToExcel(data: any[], fileName: string, sheetName: string = "Sheet1") {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  
  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" })
  
  // Trigger download
  const url = window.URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
