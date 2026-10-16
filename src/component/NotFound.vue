<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-icon">🔍</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">抱歉，您访问的页面不存在或已被移除</p>
      <button class="back-home-btn" @click="goHome">
        <span class="btn-icon">🏠</span>
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
const goHome = () => {
  window.location.href = '/';
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 50%, var(--bg-gradient-1) 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 10px 30px var(--shadow-color);
  max-width: 500px;
  width: 100%;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(96, 165, 250, 0.3);
}

.error-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 12px;
}

.error-message {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.4);
}

.back-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.5);
}

.back-home-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 18px;
}

body.dark-mode .not-found-content {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

body.dark-mode .error-code {
  text-shadow: 0 4px 20px rgba(96, 165, 250, 0.2);
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 40px 24px;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-icon {
    font-size: 48px;
  }
  
  .error-title {
    font-size: 22px;
  }
  
  .error-message {
    font-size: 14px;
  }
  
  .back-home-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>
