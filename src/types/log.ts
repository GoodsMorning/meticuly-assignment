export type TLogLevel = 'info' | 'warning' | 'success'

export type TLog = {
  time: string
  orderId: string
  message: string
  level: TLogLevel
}
