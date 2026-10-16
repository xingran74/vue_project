<template>
  <div class="section">
    <div class="section-title">
      <span class="icon">⚡</span>
      技能 & 兴趣
    </div>
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <!-- defineModel：搜索词双向绑定 -->
      <input
        class="search-input"
        type="text"
        v-model="searchKey"
        placeholder="搜索技能，例如 Vue、设计..."
      />
    </div>
    <div class="skills">
      <span
        class="skill-tag"
        :class="item.style"
        v-for="item in filterSkillList"
        :key="item.id"
      >
        <span>⭐</span>
        {{ item.name }}
      </span>
    </div>
    <div class="empty" v-if="filterSkillList.length === 0">
      没有匹配的技能
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// defineProps：接收技能列表
const props = defineProps({
  skillList: { type: Array, required: true }
});

const searchKey = defineModel({ type: String, default: "" });

const filterSkillList = computed(() => {
  if (!searchKey.value.trim()) return props.skillList;
  return props.skillList.filter(item =>
    item.name.toLowerCase().includes(searchKey.value.toLowerCase())
  );
});
</script>

<style scoped>
.section {
  background: var(--section-bg);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  transition: 0.35s;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 16px;
}
.section-title .icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fde68a, #fcd34d);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
/* 搜索框 */
.search-box {
  position: relative;
  margin-bottom: 18px;
}
.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--section-bg);
  color: var(--text-main);
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}
.search-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.12);
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
/* 技能标签 */
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13px;
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  transition: 0.2s;
}
body.dark-mode .skill-tag {
  background: #3b3f58;
  border-color: #4c506e;
  color: #e6e8f2;
}
.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(99, 102, 241, 0.15);
}
.skill-tag.star {
  background: linear-gradient(135deg, #dbeafe, #e0e7ff);
  color: #4f46e5;
  border-color: #c7d2fe;
}
body.dark-mode .skill-tag.star {
  background: #313b64;
  color: #c1ccff;
  border-color: #4b5791;
}
.skill-tag.blue {
  background: linear-gradient(135deg, #dbeafe, #e0f2fe);
  color: #0369a1;
  border-color: #bae6fd;
}
body.dark-mode .skill-tag.blue {
  background: #274463;
  color: #94d1ff;
  border-color: #365b86;
}
.skill-tag.pink {
  background: linear-gradient(135deg, #fce7f3, #fdf2f8);
  color: #be185d;
  border-color: #fbcfe8;
}
body.dark-mode .skill-tag.pink {
  background: #522c47;
  color: #ffb2d6;
  border-color: #703c60;
}
.skill-tag.yellow {
  background: linear-gradient(135deg, #fef3c7, #fef9c3);
  color: #a16207;
  border-color: #fde68a;
}
body.dark-mode .skill-tag.yellow {
  background: #574b2c;
  color: #ffe294;
  border-color: #7c6b3b;
}
.empty {
  color: var(--text-secondary);
  font-size: 14px;
  padding: 10px 0;
}
</style>