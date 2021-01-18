import store from '@/store'

export const Key = {
  accessTokenKey: 'accessToken', // 访问令牌在cookie的key值
  refreshTokenKey: 'refreshToken', // 刷新令牌在cookie的key值
  userInfoKey: 'userInfo'
}

export function hasPermission(value) {
  const permissions = store.getters && store.getters.buttonList
  if (value && value instanceof Array && value.length > 0) {
    return value.every(val => permissions.includes(val))
  }
  return false
}

