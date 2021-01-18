import { Key } from '@/utils/auth'

// 定义状态
const state = {
  init: false, // 是否已加载用户权限信息
  menuList: [], // 用户所拥有的菜单权限
  buttonList: [] // 用户所拥有的按钮权限
}

// 改变状态值
const mutations = {
  SET_SYSTEM_MENU: (state, data) => {
    state.init = true
    state.menuList = data.menuTreeList
    state.buttonList = data.buttonList
  }
}

// 定义行为
const actions = {
  // 获取用户菜单和按钮权限
  GetUserMenu({ commit }) {
    const userInfo = JSON.parse(localStorage.getItem(Key.userInfoKey))
    commit('SET_SYSTEM_MENU', userInfo)
  }
}

export default {
  namespaced: true, // 引用里需要指定模块名， /menu/GetUserMenu
  state,
  mutations,
  actions
}
