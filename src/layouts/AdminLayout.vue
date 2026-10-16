<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="logo">🛠️</div>
        <div>
          <div class="logo-title">后台管理</div>
          <div class="logo-sub">Admin Panel</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <el-menu
          :default-active="activeMenu"
          router
          background-color="transparent"
          text-color="#cbd5e1"
          active-text-color="#fff"
          class="admin-menu"
        >
          <el-menu-item
            v-for="item in adminNavItems"
            :key="item.name"
            :index="item.name"
            :route="{ name: item.name }"
          >
            <el-icon><component :is="item.iconComp" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>
      </nav>
      <div class="sidebar-footer">
        <button class="back-site-btn" @click="backToSite">
          ← 返回前台
        </button>
      </div>
    </aside>
    <main class="admin-main">
      <header class="admin-header">
        <div class="breadcrumb">
          <span class="crumb">后台管理</span>
          <span class="sep">/</span>
          <span class="crumb current">{{ currentTitle }}</span>
        </div>
        <div class="header-actions">
          <span class="admin-user">👤 {{ adminName }}</span>
          <button class="logout-btn" @click="logout">🚪 退出登录</button>
        </div>
      </header>
      <div class="admin-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import { DataBoard, User, Folder, Document } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { displayName } = storeToRefs(userStore)

const adminName = displayName

const adminNavItems = [
  { name: 'admin-dashboard', label: '控制台', iconComp: DataBoard },
  { name: 'admin-profile', label: '个人简介', iconComp: User },
  { name: 'admin-projects', label: '项目管理', iconComp: Folder },
  { name: 'admin-articles', label: '文章管理', iconComp: Document }
]

const activeMenu = computed(() => route.name)

const currentTitle = computed(() => {
  return route.meta?.title || '后台管理'
})

const logout = () => {
  userStore.logout()
  router.replace({ name: 'login' })
}

const backToSite = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}
.admin-sidebar {
  width: 240px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
}
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 16px;
}
.logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.logo-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}
.logo-sub {
  font-size: 11px;
  color: #94a3b8;
}
.sidebar-nav {
  flex: 1;
  padding: 0 12px;
}
.admin-menu {
  border-right: none !important;
}
:deep(.admin-menu .el-menu-item) {
  border-radius: 10px;
  margin-bottom: 4px;
  height: 42px;
  line-height: 42px;
  color: #cbd5e1;
}
:deep(.admin-menu .el-menu-item:hover) {
  background: rgba(255,255,255,0.06) !important;
  color: #fff !important;
}
:deep(.admin-menu .el-menu-item.is-active) {
  background: linear-gradient(135deg, #60a5fa, #a78bfa) !important;
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(96,165,250,0.3);
}
.nav-icon {
  font-size: 16px;
}
.sidebar-footer {
  padding: 16px 20px 0;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.back-site-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #cbd5e1;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.back-site-btn:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 32px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.crumb {
  color: #64748b;
}
.crumb.current {
  color: #1e293b;
  font-weight: 600;
}
.sep {
  color: #cbd5e1;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}
.admin-user {
  font-size: 13px;
  color: #475569;
}
.logout-btn {
  padding: 7px 14px;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.logout-btn:hover {
  background: #fecaca;
}
.admin-content {
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
}
</style>
