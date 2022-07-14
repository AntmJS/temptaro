import { createFetch } from '@/utils/request'

export const getRoleListCommon = createFetch<any, any>(
  '/box/common/1.0/role/list',
  'GET',
)

export const getCosKeyCommon = createFetch<any, any>(
  '/box/common/1.0/cosKey',
  'GET',
)

export const loginCommon = createFetch<any, any>(
  '/box/common/1.0/login',
  'POST',
)
