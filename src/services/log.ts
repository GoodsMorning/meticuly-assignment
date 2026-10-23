import type { TLog } from '#/types/log'

export const getLogs = () :TLog[] => {
  return [
    {
      time: '14:32:08',
      orderId: 'ORD-001',
      message: 'Packaging started',
      level: 'info',
    },
    {
      time: '14:28:41',
      orderId: 'ORD-003',
      message: 'Assembly blocked: awaiting Material B',
      level: 'warning',
    },
    {
      time: '14:15:20',
      orderId: 'ORD-002',
      message: 'Machining finished',
      level: 'success',
    },
    {
      time: '13:58:02',
      orderId: 'ORD-001',
      message: 'Quality Check finished',
      level: 'success',
    },
    {
      time: '13:40:15',
      orderId: 'ORD-003',
      message: 'Machining finished',
      level: 'success',
    },
  ] satisfies TLog[]
}
