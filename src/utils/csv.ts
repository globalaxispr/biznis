export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return

  const separator = ','
  const keys = Object.keys(rows[0])
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k]
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString()
            cell = cell.replace(/"/g, '""')
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`
            }
            return cell
          })
          .join(separator)
      })
      .join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r\n|\n/).filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const result: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, string> = {}
    const currentline = lines[i].split(',').map(item => item.trim().replace(/^"|"$/g, ''))

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j] || ''
    }
    result.push(obj)
  }

  return result
}
