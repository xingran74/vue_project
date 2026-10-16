<template>
  <div>
    <div class="page-title-row">
      <div class="title-main">
        <h2>📊 控制台</h2>
        <p class="page-sub">欢迎回来！这里是你的个人主页后台管理中心。</p>
      </div>
      <div class="title-meta">
        <span class="meta-chip">🕐 {{ currentTime }}</span>
        <span class="meta-chip">📅 {{ currentDate }}</span>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon">📂</div>
        <div class="stat-info">
          <div class="stat-value">{{ projects.length }}</div>
          <div class="stat-label">项目总数</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ completedCount }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon">🚧</div>
        <div class="stat-info">
          <div class="stat-value">{{ inProgressCount }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">🏷️</div>
        <div class="stat-info">
          <div class="stat-value">{{ skillList.length }}</div>
          <div class="stat-label">技能标签</div>
        </div>
      </div>
      <div class="stat-card cyan">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <div class="stat-value">{{ articleCount }}</div>
          <div class="stat-label">文章总数</div>
        </div>
      </div>
    </div>

    <div class="quick-access">
      <h3>⚡ 快捷操作</h3>
      <div class="qa-grid">
        <RouterLink :to="{ name: 'admin-profile' }" class="qa-card">
          <span class="qa-icon">👤</span>
          <div>
            <div class="qa-title">编辑个人简介</div>
            <div class="qa-desc">修改姓名、学院、简介等</div>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-projects' }" class="qa-card">
          <span class="qa-icon">📂</span>
          <div>
            <div class="qa-title">管理项目信息</div>
            <div class="qa-desc">新增、编辑、删除项目</div>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-articles' }" class="qa-card">
          <span class="qa-icon">📝</span>
          <div>
            <div class="qa-title">管理文章</div>
            <div class="qa-desc">已发布 {{ publishedCount }} · 草稿 {{ draftCount }}</div>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'home' }" class="qa-card">
          <span class="qa-icon">👁️</span>
          <div>
            <div class="qa-title">预览前台页面</div>
            <div class="qa-desc">查看访客看到的主页</div>
          </div>
        </RouterLink>
      </div>
    </div>

    <div class="recent-activity">
      <h3>📝 最近更新的项目</h3>
      <div class="activity-list">
        <div v-for="p in recentProjects" :key="p.id" class="activity-item">
          <span class="ai-icon">{{ p.icon }}</span>
          <div class="ai-info">
            <div class="ai-name">{{ p.name }}</div>
            <div class="ai-date">{{ p.date }}</div>
          </div>
          <span class="ai-status" :class="p.status === '已完成' ? 'done' : 'progress'">
            {{ p.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { skillList } from '@/data/projects.js'
import { useArticleStore } from '@/stores/article.js'
import { useProjectStore } from '@/stores/project.js'

const articleStore = useArticleStore()
const projectStore = useProjectStore()
const { articleCount, publishedCount, draftCount, totalViews } = storeToRefs(articleStore)
const { projects, completedCount, inProgressCount } = storeToRefs(projectStore)

const recentProjects = computed(() => [...projects.value].slice(-4).reverse())

const now = ref(new Date())
let timer = null

const currentDate = computed(() => {
  const d = now.value
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const currentTime = computed(() => {
  const d = now.value
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})

onMounted(() => {
  articleStore.loadArticles()
  projectStore.loadProjects()
  timer = setInterval(() => { now.value = new Date() }, 60000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.page-title-row {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 14px;
}
.title-main h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}
.page-sub {
  font-size: 14px;
  color: #64748b;
}
.title-meta {
  display: flex;
  gap: 8px;
}
.meta-chip {
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.stat-card.blue .stat-icon { background: #dbeafe; }
.stat-card.green .stat-icon { background: #dcfce7; }
.stat-card.orange .stat-icon { background: #ffedd5; }
.stat-card.purple .stat-icon { background: #ede9fe; }
.stat-card.cyan .stat-icon { background: #cffafe; }
.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
}
.stat-label {
  font-size: 13px;
  color: #64748b;
}
.quick-access, .recent-activity {
  background: #fff;
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.quick-access h3, .recent-activity h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}
.qa-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.qa-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  transition: 0.2s;
}
.qa-card:hover {
  border-color: #60a5fa;
  background: #f8fafc;
  transform: translateX(4px);
}
.qa-icon {
  font-size: 24px;
}
.qa-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}
.qa-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 10px;
}
.ai-icon {
  font-size: 22px;
}
.ai-info {
  flex: 1;
}
.ai-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}
.ai-date {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}
.ai-status {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.ai-status.done {
  background: #dcfce7;
  color: #15803d;
}
.ai-status.progress {
  background: #fef3c7;
  color: #a16207;
}
</style>
