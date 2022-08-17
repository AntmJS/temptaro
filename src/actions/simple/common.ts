import { createFetch } from '@/utils/request'
import { IResponseData } from './commonTypes/response.d'

export const getRoleListCommon = createFetch<any, IResponseData<any>>(
  '/box/common/1.0/role/list',
  'GET',
)

export const getCosKeyCommon = createFetch<any, IResponseData<any>>(
  '/box/common/1.0/cosKey',
  'GET',
)

export const loginCommon = createFetch<any, IResponseData<any>>(
  '/box/common/1.0/login',
  'POST',
)
