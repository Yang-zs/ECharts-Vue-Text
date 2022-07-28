import request from '@/utils/request'
const getSellerData = () => {
  return request({
    url: 'seller',
    method: 'POST',
  })
}
export default {
  getSellerData,
}
