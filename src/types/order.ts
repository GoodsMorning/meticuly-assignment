export type TOrderStatus = 'queued' | 'in-progress' | 'blocked' | 'finished'

// export type OrderOperation = {
//   step: StepName
//   /** minutes relative to NOW (negative = past, positive = future) */
//   start: number
//   /** minutes */
//   duration: number
//   status: OrderStatus
//   /** machines, stations, tools */
//   resources: string[]
//   /** consumed materials with quantities */
//   materials: Material[]
// }
