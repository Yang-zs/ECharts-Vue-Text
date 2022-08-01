import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    name: 'sellerpage',
    component: () => import('@/views/SellerPage.vue'),
  },
  {
    path: '/trendpage',
    name: 'trendpage',
    component: () => import('@/views/TrendPage.vue'),
  },
  {
    path: '/mappage',
    name:'mappage',
    component:()=>import('@/views/MapPage.vue')
  }
]

const router = new VueRouter({
  routes,
})

export default router
