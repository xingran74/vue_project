<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">👤 关于我</h1>
      <p class="page-desc">一个热爱前端开发、喜欢把复杂变简单的计算机学院学生</p>
    </div>

    <div class="section">
      <h3 class="section-title">📋 基本信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">姓名</span>
          <span class="info-value">{{ personInfo.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">学号</span>
          <span class="info-value">{{ personInfo.studentId }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">学院</span>
          <span class="info-value">{{ personInfo.faculty }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">专业班级</span>
          <span class="info-value">{{ personInfo.major }} · {{ personInfo.className }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">💡 个人简介</h3>
      <p class="bio-text">{{ personInfo.intro }}</p>
      <p class="bio-text">{{ personInfo.about }}</p>
    </div>

    <div class="section">
      <h3 class="section-title">🛠️ 技能详情</h3>
      <p class="bio-text">{{ personInfo.skillDetail }}</p>
    </div>

    <div class="section"> 
      <h3 class="section-title">🛤️ 成长历程</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(item, idx) in timelineList"
          :key="idx"
          :timestamp="item.time"
          :type="item.type"
          :icon="item.icon"
          placement="top"
        >
          <h4 class="tl-title">{{ item.title }}</h4>
          <p class="tl-desc">{{ item.desc }}</p>
          <div class="tl-tags">
            <el-tag
              v-for="tag in item.tags"
              :key="tag"
              size="small"
              effect="plain"
              style="margin-right: 6px;"
            >{{ tag }}</el-tag>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <div class="section">
      <h3 class="section-title">🎯 导航演示</h3>
      <p class="tip">编程式导航的几种常用方式：</p>
      <div class="demo-btns">
        <button class="demo-btn primary" @click="pushProjects">
          push 跳转到项目列表
        </button>
        <button class="demo-btn" @click="replaceHome">
          replace 替换到首页（不保留历史）
        </button>
        <button class="demo-btn" @click="goBack">
          go(-1) 返回上一页
        </button>
        <button class="demo-btn" @click="goProject">
          push + params 跳转到项目详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { personInfo } from '@/data/projects.js'
import { Star, Medal, School, Flag, Trophy } from '@element-plus/icons-vue'

const router = useRouter()

// 成长历程时间线数据
const timelineList = [
  {
    time: '2024-09',
    title: '步入大学',
    desc: '进入人工智能与计算机学院，开启计算机科学与技术专业的学习之旅。',
    type: 'primary',
    icon: School,
    tags: ['新生入学', '计算机科学']
  },
  {
    time: '2025-01',
    title: '前端入门',
    desc: '系统学习 HTML/CSS/JavaScript，完成第一个静态网页项目。',
    type: 'success',
    icon: Flag,
    tags: ['HTML5', 'CSS3', 'JavaScript']
  },
  {
    time: '2025-04',
    title: 'Vue 3 实战',
    desc: '深入学习 Vue 3 Composition API，完成课程管理系统前端开发。',
    type: 'warning',
    icon: Star,
    tags: ['Vue 3', 'Pinia', 'Element Plus']
  },
  {
    time: '2025-08',
    title: '全栈探索',
    desc: '学习 Node.js 与 WebSocket，开发实时聊天应用。',
    type: 'danger',
    icon: Medal,
    tags: ['Node.js', 'WebSocket', '全栈']
  },
  {
    time: '2025-10',
    title: '持续精进',
    desc: '参与开源项目，研究前端工程化与性能优化，向更高目标迈进。',
    type: 'primary',
    icon: Trophy,
    tags: ['开源', '工程化', '性能优化']
  }
]

const pushProjects = () => {
  router.push({ name: 'projects' })
}

const replaceHome = () => {
  router.replace({ name: 'home' })
}

const goBack = () => {
  router.go(-1)
}

const goProject = () => {
  router.push({ name: 'project-detail', params: { id: 1 } })
}
</script>

<style scoped>
.page-header {
  text-align: center;
  padding: 20px 0 28px;
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
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  background: var(--card-bg);
  border-radius: 10px;
  border: 1px solid var(--border-color);
}
.info-label {
  font-size: 12px;
  color: #64748b;
}
.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}
.bio-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 12px;
}
.bio-text:last-child {
  margin-bottom: 0;
}
.tl-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}
.tl-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 10px;
}
.tl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
/* Element Plus 时间线适配暗色模式 */
:deep(.el-timeline-item__timestamp) {
  color: var(--text-secondary);
  font-size: 13px;
}
:deep(.el-timeline-item__content) {
  color: var(--text-main);
}
.tip {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 14px;
}
.demo-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.demo-btn {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-main);
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.demo-btn:hover {
  border-color: #60a5fa;
  color: #2563eb;
}
.demo-btn.primary {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: #fff;
  border-color: transparent;
}
.demo-btn.primary:hover {
  box-shadow: 0 4px 14px rgba(96, 165, 250, 0.3);
}
</style>
