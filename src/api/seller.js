import request from '@/utils/request'
const getSellerData = () => {
  return request({
    url: 'seller',
    method: 'GET',
  })
}
export default {
  getSellerData,
}
