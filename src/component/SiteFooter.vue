<template>
  <div class="footer">
    <p class="footer-text">© 2025 赵佳兴的个人主页 | 基于 Vue 3 + Vite 构建</p>
    <!-- 回到顶部按钮（公共交互元素） -->
    <button class="back-to-top" @click="scrollToTop" title="回到顶部">
      ⬆️ 回到顶部
    </button>
  </div>
</template>

<script setup>
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.footer {
  margin-top: 24px;
  padding: 16px 0;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.footer-text {
  margin: 0;
}
.back-to-top {
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--section-bg);
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}
.back-to-top:hover {
  background: #eff6ff;
  transform: translateY(-2px);
}
body.dark-mode .back-to-top:hover {
  background: #343b5c;
}
</style>
