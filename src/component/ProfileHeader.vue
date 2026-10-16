<template>
  <div class="profile-header">
      <div class="avatar-wrap">
        <img :src="personInfo.avatar" class="avatar" alt="头像" />
        <div class="avatar-icon">💻</div>
      </div>
      <div class="name">{{ personInfo.name }}</div>
      <div class="major-tag">学院:{{ personInfo.faculty }}</div>
      <div class="major-tag">专业:{{ personInfo.major }}</div>
      <div class="major-tag">班级：{{ personInfo.className }}</div>
      <p class="intro">{{ personInfo.intro }}</p>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
const props = defineProps({
  personInfo: { 
    type: Object, 
    required: true
   }
});
</script>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 28px;
}
.avatar-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
}
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
}
.avatar-icon {
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  font-size: 16px;
}
.name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-top: 14px;
}
.major-tag {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 14px;
  background: #e0eaff;
  color: #2563eb;
  border-radius: 20px;
  font-size: 14px;
}
body.dark-mode .major-tag {
  background: #283552;
  color: #82b4ff;
}
.intro {
  margin-top: 14px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 560px;
}
</style>

