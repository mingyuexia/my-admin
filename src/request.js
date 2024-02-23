import axios from 'axios'
import router from '@/router'
import useReStore from '@/store/restore.js'
import { ElMessage, ElMessageBox } from 'element-plus'
const baseURL =
  import.meta.env.VITE_ENV === 'development'
    ? '/api'
    : import.meta.env.VITE_API_BASE_URL

let isTokenExpiredNotified = false // 添加标志位

const request = axios.create({
  baseURL,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use((config) => {
  if (config.withoutToken) {
    return config
  } else if (config.headers.isUpload) {
    // // 上传图片单独传token
    // config.headers['Content-Type'] = 'multipart/form-data';
    // return config;
  } else {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user, '--user')
    if (user) {
      const token = user.token
      const sid = user.sid
      config.headers.Authorization = `Bearer ${token}:${sid}`
    }
    return config
  }
})

// 错误处理拦截器
request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code === 0) {
        return response.data
      } else {
        if (response.data.code === 401 && !isTokenExpiredNotified) {
          // 只在第一次401状态码时弹出确认框
          isTokenExpiredNotified = true
          ElMessageBox.confirm('登录信息已过期,请重新登录', {
            type: 'warning'
          })
            .then(() => {
              const { path, query } = router.currentRoute.value
              // console.log(path, query)
              useReStore().saveRoute({ path, query })
              router.replace('/login')
              isTokenExpiredNotified = false
            })
            .catch(() => {
              isTokenExpiredNotified = false
            })
        } else if (response.data.code === 401) {
          console.log(response)
        } else if (response.data.code === 9404) {
          console.log(response)
        }  else {
          ElMessage({
            type: 'error',
            message: response.data.msg || response.data.message || '出错了'
          })
        }
        return Promise.reject()
      }
    } else {
      ElMessage(response.statusText)
      return Promise.reject()
    }
  },
  (error) => {
    if (error.response) {
      // 请求已发出，但服务器返回状态码不在 2xx 范围内
      console.error('Response Error:', error.response.data)
      ElMessage({
        type: 'error',
        message: error.response.statusText || '网络错误，请稍后重试'
      })
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('Request Error:', error.request)
      ElMessage({
        type: 'error',
        message: '未收到响应，请稍后重试'
      })
    } else {
      // 设置请求时触发错误
      // console.error('Error:', error.message)
      ElMessage({
        type: 'error',
        message: '发生错误，请稍后重试'
      })
    }
    return Promise.reject(error)
  }
)

export default request
