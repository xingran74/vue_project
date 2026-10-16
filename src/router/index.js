import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
        meta: { title: '首页 | 赵佳兴的个人主页', icon: '🏠', nav: true }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/pages/AboutPage.vue'),
        meta: { title: '关于我 | 赵佳兴的个人主页', icon: '👤', nav: true }
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('@/pages/ProjectsPage.vue'),
        meta: { title: '项目展示 | 赵佳兴的个人主页', icon: '📂', nav: true }
      },
      {
        path: 'projects/:id',
        name: 'project-detail',
        component: () => import('@/pages/ProjectDetailPage.vue'),
        meta: { title: '项目详情 | 赵佳兴的个人主页', icon: '📄', nav: false },
        props: true
      },
      {
        path: 'articles',
        name: 'articles',
        component: () => import('@/pages/ArticlesPage.vue'),
        meta: { title: '文章列表 | 赵佳兴的个人主页', icon: '📖', nav: true }
      },
      {
        path: 'articles/:id',
        name: 'article-detail',
        component: () => import('@/pages/ArticleDetailPage.vue'),
        meta: { title: '文章详情 | 赵佳兴的个人主页', icon: '📝', nav: false },
        props: true
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/pages/ContactPage.vue'),
        meta: { title: '联系方式 | 赵佳兴的个人主页', icon: '✉️', nav: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { title: '登录 | 后台管理系统', public: true }
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, title: '后台管理' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
        meta: { title: '控制台', icon: '📊' }
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('@/pages/admin/ProfileEditPage.vue'),
        meta: { title: '个人简介管理', icon: '👤' }
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import('@/pages/admin/ProjectsManagePage.vue'),
        meta: { title: '项目信息管理', icon: '📂' }
      },
      {
        path: 'articles',
        name: 'admin-articles',
        component: () => import('@/pages/admin/ArticlesManagePage.vue'),
        meta: { title: '文章管理', icon: '📝' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/component/NotFound.vue'),
    meta: { title: '页面未找到', public: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})


router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.token) {
    userStore.restore()
  }

  if (to.meta.title) {
    const baseTitle = '赵佳兴的个人主页'
    if (to.path.startsWith('/admin')) {
      document.title = to.meta.title === '后台管理'
        ? '后台管理系统 | ' + baseTitle
        : `${to.meta.title} | 后台管理系统`
    } else {
      document.title = to.meta.title || baseTitle
    }
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && userStore.isLoggedIn) {
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

export default router
