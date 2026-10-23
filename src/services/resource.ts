import type { TResourceItem } from '#/types/resource'

export const getResources = (): TResourceItem[] => {
  return [
    {
      name: 'Machine 01',
      status: 'idle',
      utilization: 72,
      order: 'ORD-004',
      note: 'Next in 10 min',
    },
    {
      name: 'Machine 02',
      status: 'idle',
      utilization: 55,
      order: 'ORD-005',
      note: 'Next in 90 min',
    },
    {
      name: 'Assembly Station 01',
      status: 'busy',
      utilization: 85,
      order: 'ORD-002',
      note: 'Ends in 60 min',
    },
    {
      name: 'Assembly Station 02',
      status: 'blocked',
      utilization: 40,
      order: 'ORD-003',
      note: 'Blocked 30 min ago',
    },
    {
      name: 'QC Station 01',
      status: 'idle',
      utilization: 45,
      order: 'ORD-002',
      note: 'Next in 60 min',
    },
    {
      name: 'Packaging Station 01',
      status: 'busy',
      utilization: 60,
      order: 'ORD-001',
      note: 'Ends in 30 min',
    },
    {
      name: 'Packaging Station 02',
      status: 'idle',
      utilization: 30,
      order: 'ORD-003',
      note: 'Next in 105 min',
    },
  ]
}
