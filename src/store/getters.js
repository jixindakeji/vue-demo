const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userInfo.displayName,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  // 添加菜单相关的状态
  init: state => state.menu.init,
  menuList: state => state.menu.menuList,
  buttonList: state => state.menu.buttonList
}
export default getters
