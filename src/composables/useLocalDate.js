export function useLocalDate() {
  const toLocalIsoDate = (date) => date.toLocaleDateString('en-CA')

  const addDays = (isoDateStr, delta) => {
    const d = new Date(`${isoDateStr}T00:00:00`)
    d.setDate(d.getDate() + delta)
    return toLocalIsoDate(d)
  }

  return { toLocalIsoDate, addDays }
}
