<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">✉️ 联系方式</h1>
      <p class="page-desc">欢迎通过以下方式与我取得联系</p>
    </div>

    <div class="section contact-list">
      <h3 class="section-title">📨 联系信息</h3>
      <div class="contact-item">
        <span class="ci-icon">📧</span>
        <div>
          <div class="ci-label">邮箱</div>
          <a :href="'mailto:' + personInfo.contact.email" class="ci-value">
            {{ personInfo.contact.email }}
          </a>
        </div>
      </div>
      <div class="contact-item">
        <span class="ci-icon">📱</span>
        <div>
          <div class="ci-label">电话</div>
          <span class="ci-value">{{ personInfo.contact.phoneNumber }}</span>
        </div>
      </div>
      <div class="contact-item">
        <span class="ci-icon">🏫</span>
        <div>
          <div class="ci-label">所在学院</div>
          <span class="ci-value">{{ personInfo.faculty }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">💬 留言板</h3>
      <form class="message-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>你的昵称</label>
          <input v-model="form.name" type="text" placeholder="请输入昵称" />
        </div>
        <div class="form-group">
          <label>留言内容</label>
          <textarea v-model="form.message" placeholder="请输入留言内容..."></textarea>
        </div>
        <button type="submit" class="submit-btn">发送留言</button>
      </form>
    </div>

    <div class="section social">
      <h3 class="section-title">🌐 社交链接</h3>
      <div class="social-row">
        <a href="#" class="social-link">🐙 GitHub</a>
        <a href="#" class="social-link">💼 LinkedIn</a>
        <a href="#" class="social-link">📷 小红书</a>
        <a href="#" class="social-link">🐦 微博</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { personInfo } from '@/data/projects.js'

const form = reactive({
  name: '',
  message: ''
})

const handleSubmit = () => {
  if (!form.name.trim() || !form.message.trim()) {
    alert('请填写完整信息')
    return
  }
  alert(`留言发送成功！\n昵称：${form.name}\n内容：${form.message}`)
  form.name = ''
  form.message = ''
}
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
.section {
  background: var(--section-bg);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}
.section-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 16px;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
}
.contact-item:last-child {
  border-bottom: none;
}
.ci-icon {
  font-size: 26px;
}
.ci-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}
.ci-value {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-main);
}
.ci-value[href] {
  text-decoration: none;
  color: #2563eb;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-size: 13px;
  color: var(--text-main);
  margin-bottom: 8px;
  font-weight: 500;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--text-main);
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.12);
}
.form-group textarea {
  min-height: 100px;
  resize: vertical;
}
.submit-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}
.submit-btn:hover {
  box-shadow: 0 6px 20px rgba(96, 165, 250, 0.3);
  transform: translateY(-1px);
}
.social-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.social-link {
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  background: #f1f5f9;
  color: #475569;
  transition: 0.2s;
}
.social-link:hover {
  background: #eff6ff;
  color: #2563eb;
}
</style>
