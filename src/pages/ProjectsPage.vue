<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">📂 项目展示</h1>
      <p class="page-desc">共 {{ projects.length }} 个项目 · 点击卡片查看详情</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-num">{{ projects.length }}</div>
          <div class="stat-label">总项目数</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-num green">{{ completedCount }}</div>
          <div class="stat-label">已完成</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-num orange">{{ inProgressCount }}</div>
          <div class="stat-label">进行中</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-input
        v-model="filterKey"
        placeholder="搜索项目名称或简介..."
        clearable
        class="filter-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="statusFilter" placeholder="全部状态" clearable class="filter-select">
        <el-option label="已完成" value="已完成" />
        <el-option label="进行中" value="进行中" />
      </el-select>
    </div>

    <!-- 项目卡片 -->
    <el-row :gutter="16" v-if="filteredProjects.length > 0">
      <el-col
        v-for="p in filteredProjects"
        :key="p.id"
        :xs="24" :sm="12" :md="8" :lg="6"
      >
        <el-card
          shadow="hover"
          class="project-card"
          @click="goDetail(p.id)"
        >
          <div class="card-top">
            <span class="card-icon">{{ p.icon }}</span>
            <el-tag :type="p.status === '已完成' ? 'success' : 'warning'" effect="light" round>
              {{ p.status }}
            </el-tag>
          </div>
          <h3 class="card-name">{{ p.name }}</h3>
          <p class="card-desc">{{ p.description }}</p>
          <div class="card-tags">
            <el-tag
              v-for="tag in p.tags"
              :key="tag"
              size="small"
              effect="plain"
              type="primary"
            >{{ tag }}</el-tag>
          </div>
          <div class="card-footer">
            <span class="card-date">📅 {{ p.date }}</span>
            <span class="card-link">查看详情 →</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-else description="没有匹配的项目" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const projectStore = useProjectStore()
const { projects, completedCount, inProgressCount } = storeToRefs(projectStore)

const filterKey = ref('')
const statusFilter = ref('')

const filteredProjects = computed(() => {
  let result = projects.value
  if (filterKey.value.trim()) {
    const key = filterKey.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(key) ||
      p.description.toLowerCase().includes(key)
    )
  }
  if (statusFilter.value) {
    result = result.filter(p => p.status === statusFilter.value)
  }
  return result
})

const goDetail = (id) => {
  router.push({ name: 'project-detail', params: { id } })
}

onMounted(() => {
  projectStore.loadProjects()
})
</script>

<style scoped>
.page-header {
  text-align: center;
  padding: 20px 0 24px;
}
.page-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}
.page-desc {
  font-size: 14px;
  color: var(--text-secondary);
}
.stats-row {
  margin-bottom: 20px;
}
.stat-card {
  text-align: center;
}
.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
}
.stat-num.green { color: #16a34a; }
.stat-num.orange { color: #ea580c; }
.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.filter-input {
  flex: 1;
}
.filter-select {
  width: 160px;
}
.project-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.25s;
}
.project-card:hover {
  transform: translateY(-4px);
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.card-icon {
  font-size: 30px;
}
.card-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}
.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 14px;
  min-height: 40px;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
  font-size: 12px;
}
.card-date {
  color: var(--text-secondary);
}
.card-link {
  color: #2563eb;
  font-weight: 600;
}
:deep(.el-empty) {
  padding: 60px 0;
}
</style>
