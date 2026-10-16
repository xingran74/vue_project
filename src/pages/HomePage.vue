<template>
  <div>
    <ProfileHeader :personInfo="personInfo" />

    <div class="section">
      <SkillSection v-model="searchKey" :skill-list="skillList" />
    </div>

    <div class="section">
      <h3 class="section-title">🔥 精选项目</h3>
      <div class="featured-grid">
        <RouterLink
          v-for="p in featuredProjects"
          :key="p.id"
          :to="{ name: 'project-detail', params: { id: p.id } }"
          class="featured-card"
        >
          <div class="featured-icon">{{ p.icon }}</div>
          <div class="featured-info">
            <div class="featured-name">{{ p.name }}</div>
            <div class="featured-desc">{{ p.description }}</div>
          </div>
          <div class="featured-arrow">→</div>
        </RouterLink>
      </div>
      <div class="view-more">
        <RouterLink :to="{ name: 'projects' }">
          查看全部项目 →
        </RouterLink>
      </div>
    </div>

    <div class="quick-actions">
      <button class="action-card" @click="router.push({ name: 'contact' })">
        <span class="action-icon">✉️</span>
        <span class="action-text">联系我</span>
      </button>
      <button class="action-card" @click="router.go(-1)">
        <span class="action-icon">⬅️</span>
        <span class="action-text">返回上一页</span>
      </button>
      <button class="action-card" @click="router.replace({ name: 'about' })">
        <span class="action-icon">👤</span>
        <span class="action-text">关于我</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import ProfileHeader from '@/component/ProfileHeader.vue'
import SkillSection from '@/component/SkillSection.vue'
import { personInfo, skillList } from '@/data/projects.js'
import { useProjectStore } from '@/stores/project.js'

const router = useRouter()
const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

const searchKey = ref('')

const featuredProjects = computed(() => projects.value.slice(0, 3))

onMounted(() => {
  projectStore.loadProjects()
})
</script>

<style scoped>
.section {
  background: var(--section-bg);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}
.section-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 16px;
}
.featured-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.featured-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  text-decoration: none;
  transition: all 0.25s;
}
.featured-card:hover {
  border-color: #60a5fa;
  box-shadow: 0 6px 20px rgba(96, 165, 250, 0.18);
  transform: translateY(-2px);
}
.featured-icon {
  font-size: 30px;
  flex-shrink: 0;
}
.featured-info {
  flex: 1;
  min-width: 0;
}
.featured-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 4px;
}
.featured-desc {
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.featured-arrow {
  font-size: 18px;
  color: #60a5fa;
  flex-shrink: 0;
}
.view-more {
  margin-top: 14px;
  text-align: right;
}
.view-more a {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
.view-more a:hover {
  text-decoration: underline;
}
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 10px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--section-bg);
  cursor: pointer;
  transition: all 0.25s;
}
.action-card:hover {
  border-color: #a78bfa;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(167, 139, 250, 0.2);
}
.action-icon {
  font-size: 24px;
}
.action-text {
  font-size: 13px;
  color: var(--text-main);
  font-weight: 500;
}
</style>
