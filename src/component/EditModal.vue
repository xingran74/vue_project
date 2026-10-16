<template>
  <div class="modal-overlay" v-if="modelValue">
      <div class="modal">
        <h3>编辑个人资料</h3>
        <div class="form-item">
          <label>姓名</label>
          <input v-model="editForm.name" />
        </div>
        <div class="form-item">
          <label>学院</label>
          <input v-model="editForm.faculty" />
        </div>
        <div class="form-item">
          <label>专业</label>
          <input v-model="editForm.major" />
        </div>
        <div class="form-item">
          <label>班级</label>
          <input v-model="editForm.className" />
        </div>
        <div class="form-item">
          <label>个人简介（头部）</label>
          <textarea v-model="editForm.intro"></textarea>
        </div>
        <div class="form-item">
          <label>关于我（详情）</label>
          <textarea v-model="editForm.about"></textarea>
        </div>
        <div class="form-item">
          <label>技能详情</label>
          <textarea v-model="editForm.skillDetail"></textarea>
        </div>
        <div class="form-item">
          <label>邮箱</label>
          <input v-model="editForm.email" />
        </div>
        <div class="form-item">
          <label>联系电话</label>
          <input v-model="editForm.phoneNumber" />
        </div>
        <div class="modal-btn-group">
          <button class="btn-cancel" @click="modelValue = false">取消</button>
          <button class="btn-save" @click="handleSave">保存修改</button>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  person: { type: Object, required: true }
});

const emit = defineEmits(['save', 'update:modelValue']);

// 使用 defineModel 进行双向绑定
const modelValue = defineModel({ type: Boolean, default: false });

const editForm = ref({});

watch(modelValue, (val) => {
  if (val) {
    editForm.value = {
      name: props.person.name,
      faculty: props.person.faculty,
      major: props.person.major,
      className: props.person.className,
      intro: props.person.intro,
      about: props.person.about,
      skillDetail: props.person.skillDetail,
      email: props.person.contact.email,
      phoneNumber: props.person.contact.phoneNumber
    };
  }
});

// 保存：把表单数据 emit 给父组件
const handleSave = () => {
  emit('save', { ...editForm.value });
  modelValue.value = false;
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal {
  width: 92%;
  max-width: 540px;
  background: var(--section-bg);
  border-radius: 20px;
  padding: 28px;
}
.modal h3 {
  margin-bottom: 20px;
  color: var(--text-main);
}
.form-item {
  margin-bottom: 14px;
}
.form-item label {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  color: var(--text-main);
}
.form-item input, .form-item textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-main);
  font-size: 14px;
}
.form-item textarea {
  min-height: 86px;
  resize: vertical;
}
.modal-btn-group {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  justify-content: flex-end;
}
.modal-btn-group button {
  padding: 9px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
.btn-cancel {
  background: #9ca3af;
  color: white;
}
.btn-save {
  background: #2563eb;
  color: white;
}</style>