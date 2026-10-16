import { defineStore } from 'pinia'

const STORAGE_KEY = 'article_store'

// 默认文章数据
const defaultArticles = [
  {
    id: 1,
    title: 'Vue 3 Composition API 入门',
    cover: '🎯',
    summary: '介绍 Vue 3 中 Composition API 的基本概念和使用方式。',
    content: 'Vue 3 引入了 Composition API，它让我们可以使用函数式的方式组织组件逻辑。\n\n主要特性包括：\n- setup() 函数作为组件的入口\n- ref() 和 reactive() 用于创建响应式数据\n- computed() 和 watch() 处理派生状态和副作用\n- 生命周期钩子以 onXxx 形式提供\n\n相比 Options API，Composition API 更有利于逻辑复用和类型推导。',
    category: '前端',
    tags: ['Vue 3', 'JavaScript'],
    status: '已发布',
    author: '赵佳兴',
    views: 128,
    createdAt: '2025-09-01',
    updatedAt: '2025-09-15'
  },
  {
    id: 2,
    title: 'Pinia 状态管理实践',
    cover: '🍍',
    summary: '如何在 Vue 3 项目中使用 Pinia 进行状态管理和持久化。',
    content: 'Pinia 是 Vue 官方推荐的新一代状态管理库。\n\n核心概念：\n- State：存放共享数据\n- Getters：基于 state 的计算属性\n- Actions：修改 state 的方法\n- Plugins：扩展功能（如持久化插件）\n\n使用 localStorage 可以轻松实现状态持久化，让数据在刷新后依然保留。',
    category: '前端',
    tags: ['Pinia', 'Vue 3'],
    status: '已发布',
    author: '赵佳兴',
    views: 256,
    createdAt: '2025-09-10',
    updatedAt: '2025-09-20'
  },
  {
    id: 3,
    title: 'Vite 构建工具详解',
    cover: '⚡',
    summary: '了解 Vite 的工作原理以及它为什么这么快。',
    content: 'Vite 是新一代前端构建工具，由 Vue 作者尤雨溪开发。\n\n开发阶段：\n- 基于原生 ESM 提供源码，无需打包\n- 启动速度极快，冷启动几乎瞬时\n\n生产构建：\n- 使用 Rollup 打包\n- 支持 Tree-shaking、代码分割\n\nVite 的出现极大提升了前端开发体验。',
    category: '工具',
    tags: ['Vite', '前端工程化'],
    status: '已发布',
    author: '赵佳兴',
    views: 180,
    createdAt: '2025-09-25',
    updatedAt: '2025-10-01'
  },
  {
    id: 4,
    title: 'CSS 变量与主题切换',
    cover: '🎨',
    summary: '使用 CSS 自定义属性实现优雅的暗色模式切换。',
    content: 'CSS 变量（Custom Properties）让主题切换变得简单。\n\n实现思路：\n1. 在 :root 定义默认主题变量\n2. 在 body.dark-mode 中覆盖暗色主题变量\n3. 通过 JS 切换 body 的 class\n\n配合 localStorage 记录用户偏好，实现跨会话的主题记忆。',
    category: '样式',
    tags: ['CSS', '暗色模式'],
    status: '草稿',
    author: '赵佳兴',
    views: 0,
    createdAt: '2025-10-05',
    updatedAt: '2025-10-05'
  }
]

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: []
  }),

  getters: {
    publishedArticles: (state) =>
      state.articles.filter(a => a.status === '已发布'),

    articleCount: (state) => state.articles.length,

    publishedCount: (state) =>
      state.articles.filter(a => a.status === '已发布').length,

    draftCount: (state) =>
      state.articles.filter(a => a.status === '草稿').length,

    totalViews: (state) =>
      state.articles.reduce((sum, a) => sum + (a.views || 0), 0),

    getById: (state) => (id) =>
      state.articles.find(a => a.id === Number(id))
  },

  actions: {
    // 加载文章（优先从 localStorage 读取，否则使用默认数据）
    loadArticles() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.articles = JSON.parse(raw)
          return
        } catch (e) {
          console.warn('文章数据解析失败，使用默认数据', e)
        }
      }
      this.articles = JSON.parse(JSON.stringify(defaultArticles))
      this.persist()
    },

    // 持久化 
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles))
    },

    // 新增文章
    addArticle(data) {
      const newId = this.articles.length
        ? Math.max(...this.articles.map(a => a.id)) + 1
        : 1
      const now = new Date().toISOString().slice(0, 10)
      const article = {
        id: newId,
        title: data.title,
        cover: data.cover || '📝',
        summary: data.summary || '',
        content: data.content || '',
        category: data.category || '未分类',
        tags: data.tags || [],
        status: data.status || '草稿',
        author: data.author || '赵佳兴',
        views: 0,
        createdAt: now,
        updatedAt: now
      }
      this.articles.push(article)
      this.persist()
      return article
    },

    // 更新文章
    updateArticle(id, data) {
      const idx = this.articles.findIndex(a => a.id === Number(id))
      if (idx === -1) return null
      const now = new Date().toISOString().slice(0, 10)
      this.articles[idx] = {
        ...this.articles[idx],
        ...data,
        id: Number(id),
        updatedAt: now
      }
      this.persist()
      return this.articles[idx]
    },

    // 删除文章
    deleteArticle(id) {
      const idx = this.articles.findIndex(a => a.id === Number(id))
      if (idx > -1) {
        this.articles.splice(idx, 1)
        this.persist()
        return true
      }
      return false
    },

    // 增加浏览量
    incrementView(id) {
      const article = this.articles.find(a => a.id === Number(id))
      if (article) {
        article.views = (article.views || 0) + 1
        this.persist()
      }
    }
  }
})
