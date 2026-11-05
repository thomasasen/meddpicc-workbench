export function downloadTextFile(content: string, fileName: string): void {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.append(link)
  link.click()
  link.remove()
  // A click only requests a download. Revocation must not race the browser's file hand-off.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
