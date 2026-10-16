<template>
  <div class="base-card" :class="[`card-${variant}`]">
    <!-- 头部区域：作用域插槽，暴露 title/icon/subtitle -->
    <div class="card-header" v-if="$slots.header || title">
      <slot name="header" :title="title" :icon="icon" :subtitle="subtitle">
        <div class="card-title">
          <span v-if="icon" class="card-icon">{{ icon }}</span>
          <h3>{{ title }}</h3>
        </div>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
    </div>

    <!-- 主体内容：默认插槽，暴露 description -->
    <div class="card-body">
      <slot :description="description">
        <p v-if="description" class="card-desc">{{ description }}</p>
      </slot>
    </div>

    <!-- 标签区域：作用域插槽，暴露 tags 数组 -->
    <div class="card-tags" v-if="$slots.tags || (tags && tags.length)">
      <slot name="tags" :tags="tags">
        <span
          class="card-tag"
          :class="tag.color || 'default'"
          v-for="(tag, idx) in tags"
          :key="idx"
        >
          {{ tag }}
        </span>
      </slot>
    </div>

    <!-- 底部区域：作用域插槽，暴露 variant -->
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer" :variant="variant"></slot>
    </div>
  </div>
</template>

<script setup>
// defineProps：简单、标准化的数据传递优先使用 props
const props = defineProps({
  title:     { type: String,  default: '' },
  subtitle:  { type: String,  default: '' },
  icon:      { type: String,  default: '' },
  description: { type: String, default: '' },
  tags:      { type: Array,   default: () => [] },
  variant:   { type: String,  default: 'default' } // default | highlight | compact
});
</script>

<style scoped>
.base-card {
  background: var(--section-bg);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.base-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
}
/* 变体 */
.card-highlight {
  border-left: 4px solid #2563eb;
}
.card-compact {
  padding: 16px;
  gap: 8px;
}
/* 头部 */
.card-header {
  margin-bottom: 4px;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-title h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}
.card-icon {
  font-size: 18px;
}
.card-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}
/* 主体 */
.card-body {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}
.card-desc {
  margin: 0;
}
/* 标签 */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.card-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}
body.dark-mode .card-tag {
  background: #3b3f58;
  border-color: #4c506e;
  color: #e6e8f2;
}
.card-tag.blue   { background: #dbeafe; color: #0369a1; border-color: #bae6fd; }
.card-tag.green  { background: #dcfce7; color: #15803d; border-color: #bbf7d0; }
.card-tag.yellow { background: #fef3c7; color: #a16207; border-color: #fde68a; }
.card-tag.pink   { background: #fce7f3; color: #be185d; border-color: #fbcfe8; }
.card-tag.red    { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }
body.dark-mode .card-tag.blue   { background: #274463; color: #94d1ff; }
body.dark-mode .card-tag.green  { background: #1e4a2e; color: #86efac; }
body.dark-mode .card-tag.yellow { background: #574b2c; color: #ffe294; }
body.dark-mode .card-tag.pink   { background: #522c47; color: #ffb2d6; }
body.dark-mode .card-tag.red    { background: #4a1c1c; color: #fca5a5; }
/* 底部 */
.card-footer {
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}
</style>
