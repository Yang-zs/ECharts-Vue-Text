import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    name: 'sellerpage',
    component: () => import('@/views/SellerPage.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
