import request from '@/utils/request'
const getTrendData = () => {
  return request({
    url: 'trend',
    method: 'GET',
  })
}
export default {
  getTrendData,
}
