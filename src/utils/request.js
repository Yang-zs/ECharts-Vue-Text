import axios from 'axios'
const service = axios.create({
  baseURL: process.env.VUE_APP_CROSS_DOMAIN_NAME,
  timeout: 5000,
})
// 请求拦截
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// 响应拦截
service.interceptors.response.use(
  (response) => {
    if(response){
      return response.data
    }
  },
  (error) => {
    return Promise.reject(error)
  },
)
// 统一了传参处理
const request = (options) => {
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data || {}
  }
  return service(options)
}

export default request
