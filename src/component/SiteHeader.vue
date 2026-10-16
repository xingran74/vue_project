<template>
  <div class="top-bar">
      <!-- 页面导航标签 -->
      <div class="nav-tabs">
        <button
          class="nav-tab"
          :class="{ active: activeSection === 'profile' }"
          @click="scrollTo('section-profile')"
        >
          👤 个人信息
        </button>
        <button
          class="nav-tab"
          :class="{ active: activeSection === 'projects' }"
          @click="scrollTo('section-projects')"
        >
          📂 项目展示
        </button>
      </div>
      <div class="top-actions">
        <button class="edit-btn" @click="openEditModal">✏️编辑</button>
        <button class="theme-btn" @click="toggleTheme">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
</template>

<script setup>
// defineProps：接收数据
const props = defineProps({
  isDark:         { type: Boolean, default: false },
  activeSection:  { type: String,  default: 'profile' }
});

// defineEmits：向父组件报告事件
const emit = defineEmits(['openEditModal', 'toggleTheme', 'scrollTo']);

const openEditModal = () => emit('openEditModal');
const toggleTheme   = () => emit('toggleTheme');
const scrollTo      = (sectionId) => emit('scrollTo', sectionId);
</script>