<template>
  <div v-if="project">
    <div class="detail-header">
      <button class="back-btn" @click="goBack">← 返回项目列表</button>
    </div>

    <div class="detail-hero">
      <div class="hero-icon">{{ project.icon }}</div>
      <div class="hero-info">
        <h1 class="hero-name">{{ project.name }}</h1>
        <div class="hero-meta">
          <span class="status-badge" :class="project.status === '已完成' ? 'done' : 'progress'">
            {{ project.status }}
          </span>
          <span class="meta-item">👤 {{ project.role }}</span>
          <span class="meta-item">📅 {{ project.date }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">📝 项目简介</h3>
      <p class="section-text">{{ project.description }}</p>
    </div>

    <div class="section">
      <h3 class="section-title">📖 项目详情</h3>
      <p class="section-text">{{ project.detail }}</p>
    </div>

    <div class="section">
      <h3 class="section-title">🏷️ 技术栈</h3>
      <div class="tags-row">
        <span v-for="tag in project.tags" :key="tag" class="tech-tag">{{ tag }}</span>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">✨ 核心特性</h3>
      <ul class="features-list">
        <li v-for="(feat, idx) in project.features" :key="idx">{{ feat }}</li>
      </ul>
    </div>

    <div class="section">
      <h3 class="section-title">🔗 相关链接</h3>
      <div class="links-row">
        <a v-if="project.github" :href="project.github" target="_blank" class="link-btn">
          🐙 GitHub 仓库
        </a>
        <RouterLink
          v-if="prevProject"
          :to="{ name: 'project-detail', params: { id: prevProject.id } }"
          class="link-btn"
        >
          ← 上一个项目：{{ prevProject.name }}
        </RouterLink>
        <RouterLink
          v-if="nextProject"
          :to="{ name: 'project-detail', params: { id: nextProject.id } }"
          class="link-btn"
        >
          下一个项目：{{ nextProject.name }} →
        </RouterLink>
      </div>
    </div>
  </div>

  <div v-else class="not-found-project">
    <div class="nf-icon">😵</div>
    <h2>项目不存在</h2>
    <p>没有找到 ID 为 {{ route.params.id }} 的项目</p>
    <RouterLink :to="{ name: 'projects' }" class="nf-btn">返回项目列表</RouterLink>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

const projectId = computed(() => Number(route.params.id))

const project = computed(() => projectStore.getById(projectId.value))

const prevProject = computed(() => {
  const idx = projects.value.findIndex(p => p.id === projectId.value)
  return idx > 0 ? projects.value[idx - 1] : null
})

const nextProject = computed(() => {
  const idx = projects.value.findIndex(p => p.id === projectId.value)
  return idx < projects.value.length - 1 ? projects.value[idx + 1] : null
})

onMounted(() => {
  projectStore.loadProjects()
})

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.detail-header {
  margin-bottom: 16px;
}
.back-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--section-bg);
  color: var(--text-main);
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.back-btn:hover {
  border-color: #60a5fa;
  color: #2563eb;
}
.detail-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
  background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
  border-radius: 20px;
  margin-bottom: 20px;
}
body.dark-mode .detail-hero {
  background: linear-gradient(135deg, #1e3a5f 0%, #2e1065 100%);
}
.hero-icon {
  font-size: 56px;
  flex-shrink: 0;
}
.hero-info {
  flex: 1;
}
.hero-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
}
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.status-badge.done {
  background: #dcfce7;
  color: #15803d;
}
.status-badge.progress {
  background: #fef3c7;
  color: #a16207;
}
.meta-item {
  font-size: 13px;
  color: var(--text-secondary);
}
.section {
  background: var(--section-bg);
  border-radius: 18px;
  padding: 22px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 12px;
}
.section-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tech-tag {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}
body.dark-mode .tech-tag {
  background: #1e3a5f;
  color: #93c5fd;
  border-color: #2563eb;
}
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.features-list li {
  padding: 8px 0 8px 24px;
  position: relative;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.features-list li::before {
  content: '✅';
  position: absolute;
  left: 0;
}
.links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: #fff;
  transition: all 0.25s;
}
.link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(96, 165, 250, 0.3);
}
.not-found-project {
  text-align: center;
  padding: 80px 20px;
}
.nf-icon {
  font-size: 60px;
  margin-bottom: 16px;
}
.not-found-project h2 {
  font-size: 22px;
  color: var(--text-main);
  margin-bottom: 8px;
}
.not-found-project p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.nf-btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: #fff;
  font-weight: 500;
}
</style>
