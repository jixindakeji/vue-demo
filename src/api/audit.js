import request from '@/utils/request'

export function getAudit(query, current = 1, size = 20) {
  return request({
    url: `/system/audit`,
    method: 'get',
    params: { ...query, current, size }
  })
}
