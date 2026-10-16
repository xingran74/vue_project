<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">📖 文章列表</h1>
      <p class="page-desc">共 {{ publishedArticles.length }} 篇已发布文章 · 欢迎阅读</p>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="filterKey"
        placeholder="搜索文章标题或摘要..."
        clearable
        class="filter-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="categoryFilter" placeholder="全部分类" clearable class="filter-select">
        <el-option
          v-for="cat in categories"
          :key="cat"
          :label="cat"
          :value="cat"
        />
      </el-select>
    </div>
    <el-row :gutter="16" v-if="filteredArticles.length > 0">
      <el-col
        v-for="a in filteredArticles"
        :key="a.id"
        :xs="24" :sm="12" :md="8" :lg="8"
      >
        <el-card
          shadow="hover"
          class="article-card"
          @click="goDetail(a.id)"
        >
          <div class="card-cover">{{ a.cover }}</div>
          <div class="card-body">
            <div class="card-meta">
              <el-tag size="small" type="primary" effect="plain">{{ a.category }}</el-tag>
              <span class="meta-date">📅 {{ a.createdAt }}</span>
            </div>
            <h3 class="card-title">{{ a.title }}</h3>
            <p class="card-summary">{{ a.summary }}</p>
            <div class="card-footer">
              <div class="card-tags">
                <el-tag
                  v-for="tag in a.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >{{ tag }}</el-tag>
              </div>
              <span class="card-views">👁️ {{ a.views }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-else description="没有匹配的文章" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '@/stores/article.js'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const articleStore = useArticleStore()
const { publishedArticles } = storeToRefs(articleStore)

const filterKey = ref('')
const categoryFilter = ref('')

const categories = computed(() => {
  const set = new Set(publishedArticles.value.map(a => a.category))
  return [...set]
})

const filteredArticles = computed(() => {
  let result = publishedArticles.value
  if (filterKey.value.trim()) {
    const key = filterKey.value.toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(key) ||
      a.summary.toLowerCase().includes(key)
    )
  }
  if (categoryFilter.value) {
    result = result.filter(a => a.category === categoryFilter.value)
  }
  return result
})

const goDetail = (id) => {
  router.push({ name: 'article-detail', params: { id } })
}

onMounted(() => {
  articleStore.loadArticles()
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
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.filter-input { flex: 1; }
.filter-select { width: 180px; }
.article-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.25s;
  overflow: hidden;
}
.article-card:hover {
  transform: translateY(-4px);
}
.card-cover {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
  margin: -20px -20px 16px;
}
body.dark-mode .card-cover {
  background: linear-gradient(135deg, #1e3a5f 0%, #2e1065 100%);
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
}
.meta-date { font-size: 12px; }
.card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
}
.card-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 10px;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.card-views {
  font-size: 12px;
  color: var(--text-secondary);
}
:deep(.el-empty) {
  padding: 60px 0;
}
</style>
