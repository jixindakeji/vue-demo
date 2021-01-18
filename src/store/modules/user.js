import { login, logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'
import { Key } from '@/utils/auth'

const getDefaultState = () => {
  return {
    userInfo: localStorage.getItem(Key.userInfoKey)
      ? JSON.parse(localStorage.getItem(Key.userInfoKey)) : null,
    accessToken: localStorage.getItem(Key.accessTokenKey),
    refreshToken: localStorage.getItem(Key.refreshTokenKey)
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER_STATE(state, data) {
    const { userInfo, accessToken, refreshToken } = data
    state.userInfo = userInfo
    state.accessToken = accessToken
    state.refreshToken = refreshToken

    localStorage.setItem(Key.userInfoKey, JSON.stringify(userInfo))
    localStorage.setItem(Key.accessTokenKey, accessToken)
    localStorage.setItem(Key.refreshTokenKey, refreshToken)
  },
  RESET_USER_STATE(state) {
    state.userInfo = null
    state.accessToken = null
    state.refreshToken = null

    localStorage.removeItem(Key.userInfoKey)
    localStorage.removeItem(Key.accessTokenKey)
    localStorage.removeItem(Key.refreshTokenKey)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_USER_STATE', data.user)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.accessToken).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.accessToken).then(() => {
        localStorage.removeItem(Key.accessTokenKey)
        resetRouter()
        commit('RESET_USER_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      localStorage.removeItem(Key.accessTokenKey)
      commit('RESET_USER_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

