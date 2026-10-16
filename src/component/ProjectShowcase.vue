<template>
  <div class="project-showcase">
    <!-- 页面标题区：使用具名插槽定制结构 -->
    <BaseCard variant="highlight">
      <template #header>
        <div class="page-title-area">
          <h2>📂 项目展示</h2>
          <p>以下是我参与开发的部分项目，涵盖前端、全栈和工具类方向。</p>
        </div>
      </template>
      <!-- 统计卡片：用默认插槽放置自定义内容 -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">{{ projectList.length }}</span>
          <span class="stat-label">总项目数</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ completedCount }}</span>
          <span class="stat-label">已完成</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ inProgressCount }}</span>
          <span class="stat-label">进行中</span>
        </div>
      </div>
    </BaseCard>

    <!-- 搜索过滤 -->
    <div class="filter-bar">
      <span class="search-icon">🔍</span>
      <input
        class="filter-input"
        type="text"
        v-model="filterKey"
        placeholder="搜索项目名称或简介..."
      />
    </div>

    <!-- 项目卡片列表 -->
    <div class="project-grid">
      <BaseCard
        v-for="project in filteredProjects"
        :key="project.id"
        :title="project.name"
        :subtitle="project.date"
        :icon="project.icon"
        :tags="project.tags"
        :variant="project.status === '已完成' ? 'default' : 'highlight'"
      >
        <template #default>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-meta">
            <span class="status-badge" :class="statusClass(project.status)">
              {{ project.status }}
            </span>
            <span class="role-tag">{{ project.role }}</span>
          </div>
        </template>

        <!-- 用 footer 插槽定制底部操作区 -->
        <template #footer>
          <div class="project-actions">
            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              class="action-link"
            >
              🔗 查看项目
            </a>
            <span v-else class="action-disabled">暂无链接</span>
          </div>
        </template>
      </BaseCard>
    </div>

    <!-- 空状态 -->
    <div class="empty" v-if="filteredProjects.length === 0">
      没有匹配的项目
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseCard from './BaseCard.vue';

// ---------- 项目数据（数组保存） ----------
const projectList = ref([
  {
    id: 1,
    name: '个人主页',
    icon: '🌐',
    description: '基于 Vue 3 + Vite 构建的个人主页，支持暗色模式切换、技能搜索、信息编辑等功能。',
    status: '已完成',
    role: '独立开发',
    date: '2025-06',
    link: '#',
    tags: [
      { text: 'Vue 3', color: 'blue' },
      { text: 'Vite', color: 'yellow' },
      { text: 'CSS3', color: 'pink' }
    ]
  },
  {
    id: 2,
    name: '课程管理系统',
    icon: '📚',
    description: '前后端分离的课程管理平台，支持课程 CRUD、学生选课、成绩统计等核心功能。',
    status: '已完成',
    role: '前端负责人',
    date: '2025-04',
    link: '#',
    tags: [
      { text: 'Vue 3', color: 'blue' },
      { text: 'Pinia', color: 'green' },
      { text: 'Element Plus', color: 'blue' }
    ]
  },
  {
    id: 3,
    name: '实时聊天应用',
    icon: '💬',
    description: '基于 WebSocket 的实时聊天工具，支持群聊、私聊、消息历史记录和在线状态展示。',
    status: '进行中',
    role: '全栈开发',
    date: '2025-08',
    link: '#',
    tags: [
      { text: 'Vue 3', color: 'blue' },
      { text: 'Node.js', color: 'green' },
      { text: 'WebSocket', color: 'yellow' }
    ]
  },
  {
    id: 4,
    name: 'UI 组件库',
    icon: '🧩',
    description: '封装常用 UI 组件（按钮、卡片、弹窗、表单等），支持主题切换和按需引入。',
    status: '进行中',
    role: '独立开发',
    date: '2025-09',
    link: '#',
    tags: [
      { text: 'Vue 3', color: 'blue' },
      { text: 'TypeScript', color: 'blue' },
      { text: 'Vite', color: 'yellow' }
    ]
  },
  {
    id: 5,
    name: '摄影作品集',
    icon: '📷',
    description: '个人摄影作品展示网站，采用瀑布流布局，支持图片懒加载和灯箱预览效果。',
    status: '已完成',
    role: '独立开发',
    date: '2025-03',
    link: '#',
    tags: [
      { text: 'HTML5', color: 'yellow' },
      { text: 'CSS3', color: 'pink' },
      { text: 'JavaScript', color: 'blue' }
    ]
  }
]);

const filterKey = ref('');

// ---------- 计算属性 ----------
const filteredProjects = computed(() => {
  if (!filterKey.value.trim()) return projectList.value;
  const key = filterKey.value.toLowerCase();
  return projectList.value.filter(p =>
    p.name.toLowerCase().includes(key) ||
    p.description.toLowerCase().includes(key)
  );
});

const completedCount = computed(() =>
  projectList.value.filter(p => p.status === '已完成').length
);

const inProgressCount = computed(() =>
  projectList.value.filter(p => p.status === '进行中').length
);

// ---------- 方法 ----------
const statusClass = (status) => {
  return status === '已完成' ? 'status-done' : 'status-progress';
};
</script>

<style scoped>
.project-showcase {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-title-area h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}
.page-title-area p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}
/* 统计行 */
.stats-row {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: #2563eb;
}
.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}
/* 搜索过滤 */
.filter-bar {
  position: relative;
}
.filter-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--section-bg);
  color: var(--text-main);
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}
.filter-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.12);
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
/* 项目网格 */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}
.project-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}
.project-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.status-done {
  background: #dcfce7;
  color: #15803d;
}
body.dark-mode .status-done {
  background: #1e4a2e;
  color: #86efac;
}
.status-progress {
  background: #fef3c7;
  color: #a16207;
}
body.dark-mode .status-progress {
  background: #574b2c;
  color: #ffe294;
}
.role-tag {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 3px 8px;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
/* 底部操作 */
.project-actions {
  display: flex;
  gap: 12px;
}
.action-link {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
.action-link:hover {
  text-decoration: underline;
}
.action-disabled {
  font-size: 13px;
  color: var(--text-secondary);
}
.empty {
  color: var(--text-secondary);
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}
</style>
