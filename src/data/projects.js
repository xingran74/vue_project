export const projects = [
  {
    id: 1,
    name: '个人主页',
    icon: '🌐',
    description: '基于 Vue 3 + Vite 构建的个人主页，支持暗色模式切换、技能搜索、信息编辑等功能。',
    detail: '这是一个基于 Vue 3 Composition API 和 Vite 构建的现代化个人主页。项目采用组件化架构，使用了 RouterView、RouterLink、Pinia 等技术栈，支持暗色模式一键切换、技能标签实时搜索、个人信息弹窗编辑，以及响应式布局适配。',
    status: '已完成',
    role: '独立开发',
    date: '2025-06',
    link: '#',
    tags: ['Vue 3', 'Vite', 'CSS3'],
    features: ['Vue 3 Composition API', 'Vite 极速构建', '暗色模式切换', '组件化设计'],
    github: 'https://github.com/example/homepage'
  },
  {
    id: 2,
    name: '课程管理系统',
    icon: '📚',
    description: '前后端分离的课程管理平台，支持课程 CRUD、学生选课、成绩统计等核心功能。',
    detail: '采用 Vue 3 + Pinia + Element Plus 构建的课程管理前端，后端基于 Spring Boot + MySQL。系统实现了管理员、教师、学生三种角色的权限隔离，支持课程全生命周期管理、选课退课、成绩录入与统计图表展示。',
    status: '已完成',
    role: '前端负责人',
    date: '2025-04',
    link: '#',
    tags: ['Vue 3', 'Pinia', 'Element Plus'],
    features: ['多角色权限控制', '数据可视化图表', '前后端分离架构', 'RESTful API'],
    github: 'https://github.com/example/course-system'
  },
  {
    id: 3,
    name: '实时聊天应用',
    icon: '💬',
    description: '基于 WebSocket 的实时聊天工具，支持群聊、私聊、消息历史记录和在线状态展示。',
    detail: '这是一个全栈实时聊天应用，前端使用 Vue 3 + Vite，后端使用 Node.js + Express + Socket.IO。支持多房间群聊、一对一私聊、消息离线存储、打字指示器、在线用户列表等丰富功能。',
    status: '进行中',
    role: '全栈开发',
    date: '2025-08',
    link: '#',
    tags: ['Vue 3', 'Node.js', 'WebSocket'],
    features: ['WebSocket 实时通信', '消息持久化存储', '多房间支持', '在线状态实时同步'],
    github: 'https://github.com/example/chat-app'
  },
  {
    id: 4,
    name: 'UI 组件库',
    icon: '🧩',
    description: '封装常用 UI 组件（按钮、卡片、弹窗、表单等），支持主题切换和按需引入。',
    detail: '基于 Vue 3 + TypeScript 开发的轻量级 UI 组件库，使用 Vite 构建。目前已封装 Button、Card、Modal、Form、Input、Tag 等 20+ 常用组件，支持 CSS 变量主题定制和 Tree-shaking 按需引入。',
    status: '进行中',
    role: '独立开发',
    date: '2025-09',
    link: '#',
    tags: ['Vue 3', 'TypeScript', 'Vite'],
    features: ['TypeScript 类型支持', 'CSS 变量主题系统', '按需引入优化', '完善的文档站点'],
    github: 'https://github.com/example/ui-kit'
  },
  {
    id: 5,
    name: '摄影作品集',
    icon: '📷',
    description: '个人摄影作品展示网站，采用瀑布流布局，支持图片懒加载和灯箱预览效果。',
    detail: '一个纯前端的摄影作品展示站点，使用原生 HTML/CSS/JS 实现瀑布流布局，结合 Intersection Observer API 实现图片懒加载，支持灯箱预览、分类筛选和关键词搜索。',
    status: '已完成',
    role: '独立开发',
    date: '2025-03',
    link: '#',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    features: ['瀑布流布局', '图片懒加载', '灯箱预览', '分类筛选与搜索'],
    github: 'https://github.com/example/photo-gallery'
  },
  {
    id: 6,
    name: '待办事项管理',
    icon: '✅',
    description: '简洁优雅的待办事项应用，支持分类、优先级、截止日期和本地存储。',
    detail: '一款轻量级的待办事项管理工具，使用 Vue 3 + LocalStorage 实现数据持久化。支持多分类管理、四级优先级标记、截止日期提醒、拖拽排序和 PWA 离线使用。',
    status: '已完成',
    role: '独立开发',
    date: '2025-01',
    link: '#',
    tags: ['Vue 3', 'LocalStorage', 'PWA'],
    features: ['多分类管理', '优先级标记', 'LocalStorage 持久化', 'PWA 离线支持'],
    github: 'https://github.com/example/todo-app'
  }
]

export const personInfo = {
  avatar: 'https://gips3.baidu.com/it/u=4028841722,3177937756&fm=3074&app=3074&f=PNG?w=2048&h=2048',
  name: '赵佳兴',
  faculty: '人工智能与计算机学院',
  studentId: '249980447',
  className: '24计科1班',
  major: '计算机科学与技术',
  intro: '热爱前端与交互设计，喜欢把复杂变简单，持续学习中，保持好奇。',
  about: '目前大三，对 Vue、React 和用户体验有浓厚兴趣。课余时间喜欢做开源小项目，同时也爱摄影和羽毛球。',
  skillDetail: '熟练掌握 HTML/CSS/JS，熟悉word，ppt，Excel办公软件',
  contact: {
    email: '249980447@qq.com',
    phoneNumber: '18249980447'
  }
}

export const skillList = [
  { id: 1, name: 'Vue 3', style: 'star' },
  { id: 2, name: 'JavaScript', style: 'blue' },
  { id: 3, name: 'TypeScript', style: 'blue' },
  { id: 4, name: 'HTML5 & CSS3', style: 'yellow' },
  { id: 5, name: 'React', style: 'star' },
  { id: 6, name: 'UI/UX 设计', style: 'pink' },
  { id: 7, name: 'Node.js', style: 'blue' },
  { id: 8, name: 'Git & GitHub', style: 'yellow' },
  { id: 9, name: '摄影', style: 'pink' },
  { id: 10, name: '羽毛球', style: 'yellow' },
  { id: 11, name: 'Figma', style: 'pink' },
  { id: 12, name: 'Pinia', style: 'star' }
]
