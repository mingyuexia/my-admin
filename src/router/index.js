import axios from 'axios'
import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/user'
const layout = () => import('@/components/layout/index.vue')
const Login = () => import('@/views/login/index.vue')
const routes = [
  // {
  //   path: '/',
  //   redirect: '/home' // 这里设置重定向
  // },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const whiteList = ['/login', '/signUp']
router.beforeEach((to, from, next) => {
  checkAppNewVersion()
  const { path, query } = from
  window.scrollTo(0, 0)
  if (whiteList.includes(to.path)) {
    next()
  } else {
    next()
  }
  // console.log(JSON.parse(JSON.stringify(to)))
  next()
})

// 检查服务端是否已经更新，如果更新刷新页面
async function checkAppNewVersion() {
  const url = `/version.json?t=${Date.now()}`
  let res = null
  try {
    res = await axios.get(url)
  } catch (err) {
    console.error('checkAppNewVersion error: ', err)
  }
  if (!res) return
  const version = res.data.version ?? ''
  // console.log(version,res,localStorage.getItem('APP_VERSION'))
  const localVersion = localStorage.getItem('APP_VERSION')
  if (localVersion && localVersion !== version) {
    localStorage.setItem('APP_VERSION', version)
    window.location.reload()
  }
  localStorage.setItem('APP_VERSION', version)
}

// 监听页面打开显示
document.addEventListener('visibilitychange', function () {
  // console.log('show ===>', document.visibilityState, !document.hidden)
  if (!document.hidden) {
    checkAppNewVersion()
  }
})

export default router
