/* Rap仓库ModuleId: 503316 */

// @ts-nocheck

import { createFetch } from '@/utils/request'

import type { getRoleList, getCosKey, login } from '@/actions/types/common';
  
/**
 * 接口名：获取角色列表
 * Rap 地址: http://rap2.taobao.org/repository/editor?id=299812&mod=503316&itf=2221146
 */
export const getRoleListCommon = createFetch<getRoleList['request'], getRoleList['response']>('/box/common/1.0/role/list', 'GET');

/**
 * 接口名：获取腾讯云临时key
 * Rap 地址: http://rap2.taobao.org/repository/editor?id=299812&mod=503316&itf=2221147
 */
export const getCosKeyCommon = createFetch<getCosKey['request'], getCosKey['response']>('/box/common/1.0/cosKey', 'GET');

/**
 * 接口名：登录接口
 * Rap 地址: http://rap2.taobao.org/repository/editor?id=299812&mod=503316&itf=2221148
 */
export const loginCommon = createFetch<login['request'], login['response']>('/box/common/1.0/login', 'POST');
