import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    hidden: true,
    meta: { title: '登录', }
  },
  {
    path: "/",
    name: "Layout",
    component: () => import('@/pages/Layout/index.vue'),
    redirect: "/shop",
    children: [
      {
        path: "/shop",
        name: "shop",
        component: () => import('@/pages/shop/index.vue'),
        meta: { title: "店铺列表" }
      },
      {
        path: "/account",
        name: "account",
        component: () => import('@/pages/shop/account.vue'),
        meta: { title: "账号列表" }
      },
      {
        path: "/product",
        name: "product",
        component: () => import('@/pages/product/index.vue'),
        meta: { title: "产品列表" }
      },
      {
        path: "/rule",
        name: "rule",
        component: () => import('@/pages/product/levelList.vue'),
        meta: { title: "等级列表" }
      },
      {
        path: "/pattern",
        name: "pattern",
        component: () => import('@/pages/product/pattern/index.vue'),
        meta: { title: "图案列表" }
      },
      {
        path: "/tag",
        name: "tag",
        component: () => import('@/pages/product/tag/index.vue'),
        meta: { title: "标签列表" }
      },
      {
        path: "/model",
        name: "model",
        component: () => import('@/pages/product/model/index.vue'),
        meta: { title: "款号列表" }
      },
      {
        path: "/category",
        name: "category",
        component: () => import('@/pages/product/category/index.vue'),
        meta: { title: "分类列表" }
      },
      {
        path: "/logList",
        name: "logList",
        component: () => import('@/pages/product/logList.vue'),
        meta: { title: "日志列表" }
      },
      {
        path: "/log",
        name: "log",
        component: () => import('@/pages/product/log.vue'),
        meta: { title: "录入日志" }
      },
      {
        path: "/order",
        name: "order",
        component: () => import('@/pages/orders/index.vue'),
        meta: { title: "订单列表" }
      },
      {
        path: "/cost",
        name: "cost",
        component: () => import('@/pages/orders/cost.vue'),
        meta: { title: "订单列表" }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;