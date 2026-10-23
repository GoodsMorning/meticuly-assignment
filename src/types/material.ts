export type TMaterialStock = {
  name: string
  unit: string
  stock: number
  /** used by finished / in-progress steps */
  consumed: number
  /** allocated to queued steps */
  reserved: number
}
