export const formatQuantity = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1)

export const percentage = (value: number, total: number) =>
  Math.min(100, Math.max(0, (value / total) * 100))
