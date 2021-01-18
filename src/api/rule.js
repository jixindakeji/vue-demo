import request from '@/utils/request'

export default {
  getList(query, current = 1, size = 20) {
    return request({
      url: '/waf/rule',
      method: 'get',
      params: { ...query, current, size }
    })
  },
  add(data) {
    return request({
      url: `/waf/rule`,
      method: 'post',
      data
    })
  },
  getById(id) {
    return request({
      url: `/waf/rule/${id}`,
      method: 'get'
    })
  },
  update(data) {
    return request({
      url: `/waf/rule`,
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return request({
      url: `/waf/rule/${id}`,
      method: 'delete'
    })
  },
  uploadRuleFile(id, data) {
    return request({
      url: `/waf/host/${id}/rule`,
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data
    })
  },
  downloadRuleFile(id) {
    return request({
      url: `/waf/host/${id}/rule`,
      method: 'get'
    })
  }
}
