import { createFetch } from '@/utils/request'
import { IResponseData } from './commonTypes/response.d'

export const getCosKeyDemo = createFetch<any, IResponseData<any>>(
  '/box/demo/1.0/cosKey',
  'GET',
)
