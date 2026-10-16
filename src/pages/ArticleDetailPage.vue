<template>
  <div v-if="article">
    <div class="detail-header">
      <button class="back-btn" @click="goBack">← 返回文章列表</button>
    </div>

    <div class="article-hero">
      <div class="hero-cover">{{ article.cover }}</div>
      <div class="hero-info">
        <span class="hero-category">{{ article.category }}</span>
        <h1 class="hero-title">{{ article.title }}</h1>
        <div class="hero-meta">
          <span>👤 {{ article.author }}</span>
          <span>📅 {{ article.createdAt }}</span>
          <span>👁️ {{ article.views }} 次浏览</span>
        </div>
        <div class="hero-tags">
          <span v-for="tag in article.tags" :key="tag" class="hero-tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="article-summary">
      <strong>📌 摘要：</strong>{{ article.summary }}
    </div>

    <div class="article-content">
      <p v-for="(para, idx) in paragraphs" :key="idx">{{ para }}</p>
    </div>

    <div class="article-nav">
      <RouterLink
        v-if="prevArticle"
        :to="{ name: 'article-detail', params: { id: prevArticle.id } }"
        class="nav-link prev"
      >
        ← 上一篇：{{ prevArticle.title }}
      </RouterLink>
      <RouterLink
        v-if="nextArticle"
        :to="{ name: 'article-detail', params: { id: nextArticle.id } }"
        class="nav-link next"
      >
        下一篇：{{ nextArticle.title }} →
      </RouterLink>
    </div>
  </div>

  <div v-else class="not-found-article">
    <div class="nf-icon">😵</div>
    <h2>文章不存在</h2>
    <p>没有找到 ID 为 {{ route.params.id }} 的文章</p>
    <RouterLink :to="{ name: 'articles' }" class="nf-btn">返回文章列表</RouterLink>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '@/stores/article.js'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const { publishedArticles } = storeToRefs(articleStore)

const articleId = computed(() => Number(route.params.id))

const article = computed(() =>
  articleStore.getById(articleId.value)
)

const paragraphs = computed(() => {
  if (!article.value) return []
  return article.value.content.split('\n').filter(Boolean)
})

const prevArticle = computed(() => {
  const list = publishedArticles.value
  const idx = list.findIndex(a => a.id === articleId.value)
  return idx > 0 ? list[idx - 1] : null
})

const nextArticle = computed(() => {
  const list = publishedArticles.value
  const idx = list.findIndex(a => a.id === articleId.value)
  return idx < list.length - 1 ? list[idx + 1] : null
})

const goBack = () => router.go(-1)

onMounted(() => {
  articleStore.loadArticles()
})

// 浏览量 +1
watch(articleId, (id) => {
  if (id) articleStore.incrementView(id)
}, { immediate: true })
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
.article-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
  background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
  border-radius: 20px;
  margin-bottom: 20px;
}
body.dark-mode .article-hero {
  background: linear-gradient(135deg, #1e3a5f 0%, #2e1065 100%);
}
.hero-cover {
  font-size: 56px;
  flex-shrink: 0;
}
.hero-info {
  flex: 1;
}
.hero-category {
  display: inline-block;
  padding: 3px 12px;
  background: rgba(255,255,255,0.6);
  color: #2563eb;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
}
body.dark-mode .hero-category {
  background: rgba(0,0,0,0.2);
  color: #93c5fd;
}
.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
}
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}
.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.hero-tag {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(255,255,255,0.5);
  color: var(--text-main);
}
body.dark-mode .hero-tag {
  background: rgba(255,255,255,0.1);
}
.article-summary {
  background: var(--section-bg);
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-main);
  line-height: 1.7;
  border-left: 4px solid #60a5fa;
}
.article-content {
  background: var(--section-bg);
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 20px;
}
.article-content p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 14px;
}
.article-content p:last-child {
  margin-bottom: 0;
}
.article-nav {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.nav-link {
  flex: 1;
  min-width: 200px;
  padding: 14px 18px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  background: var(--section-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  transition: 0.2s;
}
.nav-link:hover {
  border-color: #60a5fa;
  color: #2563eb;
  transform: translateY(-2px);
}
.nav-link.next {
  text-align: right;
}
.not-found-article {
  text-align: center;
  padding: 80px 20px;
}
.nf-icon {
  font-size: 60px;
  margin-bottom: 16px;
}
.not-found-article h2 {
  font-size: 22px;
  color: var(--text-main);
  margin-bottom: 8px;
}
.not-found-article p {
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
