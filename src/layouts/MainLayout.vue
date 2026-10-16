<template>
  <div class="profile-card">
    <nav class="top-bar">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        router
        class="nav-menu"
        background-color="transparent"
        text-color="var(--text-secondary)"
        active-text-color="#2563eb"
      >
        <el-menu-item
          v-for="item in navItems"
          :key="item.name"
          :index="item.name"
          :route="{ name: item.name }"
        >
          <el-icon><component :is="item.iconComp" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
      <div class="top-actions">
        <el-button type="primary" plain @click="goAdmin">
          <el-icon><Setting /></el-icon>
          <span>后台</span>
        </el-button>
        <el-button circle @click="toggleTheme">
          {{ isDark ? '☀️' : '🌙' }}
        </el-button>
      </div>
    </nav>

    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>

    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Setting, House, User, Folder, Document, Message } from '@element-plus/icons-vue'
import SiteFooter from '@/component/SiteFooter.vue'

const router = useRouter()
const route = useRoute()
const isDark = ref(false)

const navItems = [
  { name: 'home', label: '首页', iconComp: House },
  { name: 'about', label: '关于我', iconComp: User },
  { name: 'projects', label: '项目展示', iconComp: Folder },
  { name: 'articles', label: '文章', iconComp: Document },
  { name: 'contact', label: '联系方式', iconComp: Message }
]

const activeMenu = computed(() => route.name)

const goAdmin = () => {
  router.push({ name: 'login' })
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.body.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    document.body.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
    document.body.classList.add('dark-mode')
  }
})
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
}
.nav-menu {
  border-bottom: none !important;
  background: transparent !important;
}
:deep(.el-menu--horizontal > .el-menu-item) {
  border-bottom: 2px solid transparent !important;
  height: 42px;
  line-height: 42px;
  border-radius: 10px;
  margin: 0 2px;
}
:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  background: linear-gradient(135deg, #60a5fa, #a78bfa) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
}
:deep(.el-menu--horizontal > .el-menu-item:hover) {
  background: #eff6ff !important;
}
.top-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
