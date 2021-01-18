import request from '@/utils/request'

export default {
  getList(query) {
    return request({
      url: '/system/menu',
      method: 'get',
      params: query
    })
  },
  // 新增
  add(data) {
    return request({
      url: `/system/menu`,
      method: 'post',
      data
    })
  },

  // 查询详情
  getById(id) {
    return request({
      url: `/system/menu/${id}`,
      method: 'get'
    })
  },

  // 更新
  update(data) {
    return request({
      url: `/system/menu`,
      method: 'put',
      data
    })
  },

  deleteById(id) {
    return request({
      url: `/system/menu/${id}`,
      method: 'delete'
    })
  }
}

