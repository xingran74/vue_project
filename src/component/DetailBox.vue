<template>
   <div class="detail-box">
      <div class="detail-title">关于我</div>
      <p class="detail-text">{{ personInfo.about }}</p>
      <div class="detail-title">技能详情</div>
      <p class="detail-text">{{ personInfo.skillDetail }}</p>
      <div class="detail-title">联系</div>
      <ul class="contact-list">
        <li>📮电子邮箱: {{ personInfo.contact.email }}</li>
        <li>
          🐙 联系电话：
          <a :href="'tel:' + personInfo.contact.phoneNumber" target="_blank">
            {{ personInfo.contact.phoneNumber }}
          </a>
        </li>
      </ul>
    </div>
</template>

<script setup>
const props = defineProps({
  personInfo: { type: Object, required: true }
});
</script>
<style scoped>
.detail-box {
  margin-top: 16px;
  padding: 24px;
  background: var(--section-bg);
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  transition: 0.35s;
}
.detail-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.detail-title::before {
  content: "";
  width: 4px;
  height: 14px;
  background: linear-gradient(180deg, #60a5fa, #a78bfa);
  border-radius: 2px;
}
.detail-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 18px;
}
.contact-list {
  list-style: none;
}
.contact-list li {
  font-size: 14px;
  color: var(--text-secondary);
  padding: 6px 0;
  display: flex;
  gap: 8px;
}
.contact-list a {
  color: #2563eb;
  text-decoration: none;
}
.contact-list a:hover {
  text-decoration: underline;
}</style>