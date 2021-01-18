import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

import { Key } from '@/utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasToken = localStorage.getItem(Key.accessTokenKey)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      if (store.getters.init === false) {
        store.dispatch('menu/GetUserMenu').then(() => {
          next({ path: '/' })
          NProgress.done()
        })
      } else {
        next({ path: '/' })
        NProgress.done()
      }
    } else {
      const hasGetUserInfo = localStorage.getItem(Key.userInfoKey)
      if (hasGetUserInfo) {
        if (store.getters.init === false) {
          store.dispatch('menu/GetUserMenu').then(() => {
            next({ ...to, replace: true })
          })
        }
        next()
      } else {
        // window.location.href =
        //   `${process.env['VUE_APP_AUTH_CENTER_URL ']}?redirectURL=${window.location.href}`
        next(`/login?redirect=${to.path}`)
        // try {
        // get user info
        // await store.dispatch('user/getInfo')

        // next()
        // } catch (error) {
        // remove token and go to login page to re-login
        // await store.dispatch('user/resetToken')
        // Message.error(error || 'Has Error')
        // next(`/login?redirect=${to.path}`)
        // NProgress.done()
        // }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      // window.location.href =
      //   `${process.env.VUE_APP_AUTH_CENTER_URL}?redirectURL=${window.location.href}`
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  if (from.path !== '/login' && from.path !== '/' && to.path === '/login') {
    window.location.reload()
  }
  // finish progress bar
  NProgress.done()
})
