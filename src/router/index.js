import { createRouter, createWebHashHistory } from 'vue-router'


import LoginView from '../views/Login'


const routes = [
  {
    // 访问根路径的时候跳转到login
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    name: 'login',
    component: LoginView,

  },

  {
    path: '/home',
    component: () =>
      import('../views/HomeView.vue'),
    redirect: '/user',
    children: [{
      path: '/user',
      component: () =>
        import('../views/user/UserView.vue')
    },
    {
      path: '/order',
      component: () =>
        import('../views/order/OrderView.vue')
    },
    {
      path:'/createorder',
      component:()=>
        import('../views/order/CreateOrderView.vue')
    },
    {
      path: '/manage',
      component: () =>
        import('../views/task/TaskManageView.vue')
    },
    {
      path: '/task',
      component: () =>
        import('../views/task/TaskView.vue')
    },

    
    {
      path: '/welcome',
      component: () =>
        import('../views/index/WelcomeView.vue')
    },

    ]
  },


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})



// 配置路由守卫
// 目标路由对象(包含路由信息)，来源路由对象，接下来要执行的操作
router.beforeEach((to, from, next) => {
  // 如果访问登录页面,则放行
  if (to.path === '/login') {
    return next()
  }
  // 如果访问的不是登录页面并且用户未登录，则跳转到/login 从sessionStorage中获取用户信息,因为在登录功能中成功时向sessionStorage中存储了
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  if (!userInfo) {
    return next('/login')
  }
  // 如果用户已登录,则放行
  next()
})


export default router
