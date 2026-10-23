import type { TMaterialStock } from '#/types/material'

export const getMaterialStocks = (): TMaterialStock[] => {
  return [
    { name: 'Material A', unit: 'kg', stock: 100, consumed: 37, reserved: 14 },
    { name: 'Material B', unit: 'pcs', stock: 60, consumed: 24, reserved: 21 },
    {
      name: 'Fasteners',
      unit: 'pcs',
      stock: 300,
      consumed: 122,
      reserved: 105,
    },
    { name: 'Material C', unit: 'boxes', stock: 40, consumed: 4, reserved: 18 },
    {
      name: 'Calibration Fluid',
      unit: 'L',
      stock: 5,
      consumed: 1.5,
      reserved: 1,
    },
    { name: 'Label Roll', unit: 'rolls', stock: 6, consumed: 1, reserved: 2 },
  ] satisfies TMaterialStock[]
}
