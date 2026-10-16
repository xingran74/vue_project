<template>
  <RouterView />
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
:root {
  --bg-gradient-1: #eef4ff;
  --bg-gradient-2: #f6f8ff;
  --card-bg: rgba(255, 255, 255, 0.85);
  --section-bg: #ffffff;
  --text-main: #1f2937;
  --text-secondary: #4b5563;
  --border-color: #e5e7eb;
  --shadow-color: rgba(59, 130, 246, 0.12);
}
body.dark-mode {
  --bg-gradient-1: #191b28;
  --bg-gradient-2: #23273b;
  --card-bg: rgba(37,41,62,0.88);
  --section-bg: #2c3046;
  --text-main: #eceef4;
  --text-secondary: #b8bcd0;
  --border-color: #444863;
  --shadow-color: rgba(0,0,0,0.25);
}
body {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 50%, var(--bg-gradient-1) 100%);
  font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
  padding: 40px 20px;
  color: var(--text-main);
  transition: background 0.35s ease;
}
.profile-card {
  max-width: 720px;
  margin: 0 auto;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 10px 30px var(--shadow-color);
  transition: 0.35s;
}

#app {
  width: 100%;
}

a {
  color: #2563eb;
}

@media (max-width: 768px) {
  body {
    padding: 20px 12px;
  }
  .profile-card {
    padding: 20px;
  }
}
</style>
