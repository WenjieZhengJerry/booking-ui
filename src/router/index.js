import Vue from 'vue'
import Router from 'vue-router'
/* 引入用户界面 */
import User from '@/views/user/Home'
import Login from '@/views/user/Login'
import Register from '@/views/user/Register'
import HotelDetail from '@/views/user/HotelDetail'
import ConfirmOrder from '@/views/user/ConfirmOrder'
import Pay from '@/views/user/Pay'
import UserCenter from '@/views/user/UserCenter'
import OrderDetail from '@/views/user/OrderDetail'
/* 引入管理界面 */
import Admin from '@/views/admin/Home'

Vue.use(Router)

export default new Router({
  routes: [
    /* 用户路由注册 */
    {
      path: '/',
      name: 'User',
      component: User
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/hotelDetail',
      name: 'HotelDetail',
      component: HotelDetail
    },
    {
      path: '/confirmOrder',
      name: 'ConfirmOrder',
      component: ConfirmOrder
    },
    {
      path: '/pay',
      name: 'Pay',
      component: Pay
    },
    {
      path: '/userCenter',
      redirect: '/userCenter/userInfomation',
      name: 'UserCenter',
      component: UserCenter,
      children: [
        {
          path: '/userCenter/myOrders',
          name: 'MyOrders',
          component: () => import('@/views/user/MyOrders')
        },
        {
          path: '/userCenter/userInfomation',
          name: 'UserInfomation',
          component: () => import('@/views/user/UserInfomation')
        },
        {
          path: '/userCenter/pointManage',
          name: 'PointManage',
          component: () => import('@/views/user/PointManage')
        },
        {
          path: '/userCenter/discountCoupon',
          name: 'DiscountCoupon',
          component: () => import('@/views/user/DiscountCoupon')
        },
        {
          path: '/userCenter/setting',
          name: 'Setting',
          component: () => import('@/views/user/Setting')
        }
      ]
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },

    /* 管理路由注册 */
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})
