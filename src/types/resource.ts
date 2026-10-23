
export type TResourceStatus = 'busy' | 'idle' | 'blocked'

export type TResourceItem = {
  name: string
  status: TResourceStatus
  utilization: number
  order: string
  note: string
}