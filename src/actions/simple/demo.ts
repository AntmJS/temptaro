import { createFetch } from '@/utils/request'

export const getCosKeyDemo = createFetch<any, any>(
  '/box/demo/1.0/cosKey',
  'GET',
)
