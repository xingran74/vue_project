<template>
  <div>
    <div class="page-title-row">
      <h2>👤 个人简介管理</h2>
      <p class="page-sub">编辑前台首页展示的个人信息</p>
    </div>

    <div class="edit-card">
      <div class="avatar-section">
        <div class="avatar-wrap">
          <img :src="form.avatar" alt="头像" />
        </div>
        <div class="avatar-info">
          <p class="avatar-tip">头像 URL 将在下方表单中修改</p>
          <p v-if="isDirty" class="dirty-indicator">● 有未保存的修改</p>
        </div>
      </div>

      <form class="edit-form" @submit.prevent="handleSave" ref="formRef">
        <div class="form-row">
          <div class="form-group">
            <label>姓名 <span class="required">*</span></label>
            <input
              v-model="form.name"
              type="text"
              :class="{ invalid: errors.name }"
            />
            <span v-if="errors.name" class="err-text">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label>学号 <span class="required">*</span></label>
            <input
              v-model="form.studentId"
              type="text"
              :class="{ invalid: errors.studentId }"
            />
            <span v-if="errors.studentId" class="err-text">{{ errors.studentId }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>学院 <span class="required">*</span></label>
            <input
              v-model="form.faculty"
              type="text"
              :class="{ invalid: errors.faculty }"
            />
            <span v-if="errors.faculty" class="err-text">{{ errors.faculty }}</span>
          </div>
          <div class="form-group">
            <label>专业班级 <span class="required">*</span></label>
            <input
              v-model="form.className"
              type="text"
              :class="{ invalid: errors.className }"
            />
            <span v-if="errors.className" class="err-text">{{ errors.className }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>专业 <span class="required">*</span></label>
          <input
            v-model="form.major"
            type="text"
            :class="{ invalid: errors.major }"
          />
          <span v-if="errors.major" class="err-text">{{ errors.major }}</span>
        </div>

        <div class="form-group">
          <label>个人简介 <span class="required">*</span></label>
          <textarea
            v-model="form.intro"
            rows="2"
            :class="{ invalid: errors.intro }"
            maxlength="120"
          ></textarea>
          <div class="form-meta">
            <span v-if="errors.intro" class="err-text">{{ errors.intro }}</span>
            <span class="char-count" :class="{ warn: form.intro.length > 100 }">
              {{ form.intro.length }}/120
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>详细介绍</label>
          <textarea v-model="form.about" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>技能详情</label>
          <textarea v-model="form.skillDetail" rows="2"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>邮箱 <span class="required">*</span></label>
            <input
              v-model="form.email"
              type="email"
              placeholder="example@qq.com"
              :class="{ invalid: errors.email }"
            />
            <span v-if="errors.email" class="err-text">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label>电话 <span class="required">*</span></label>
            <input
              v-model="form.phoneNumber"
              type="text"
              placeholder="11 位手机号"
              :class="{ invalid: errors.phoneNumber }"
            />
            <span v-if="errors.phoneNumber" class="err-text">{{ errors.phoneNumber }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-ghost" @click="cancelChanges" :disabled="!isDirty">
            ↺ 取消修改
          </button>
          <button type="button" class="btn btn-gray" @click="resetToOriginal">重置为原始值</button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving || !isDirty">
            <span v-if="isSaving" class="btn-spinner"></span>
            {{ isSaving ? '保存中...' : '💾 保存修改' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 离开确认弹窗 -->
    <div v-if="leaveConfirm.show" class="modal-overlay" @click.self="leaveConfirm.show = false">
      <div class="confirm-card">
        <div class="confirm-icon">⚠️</div>
        <h3 class="confirm-title">未保存的修改</h3>
        <p class="confirm-message">
          你在个人简介页面有未保存的修改。确定要离开吗？
          <br />
          <span class="confirm-hint">离开后所有修改将丢失。</span>
        </p>
        <div class="confirm-actions">
          <button class="btn btn-gray" @click="stayOnPage">继续编辑</button>
          <button class="btn btn-danger" @click="leaveAnyway">放弃并离开</button>
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      <span class="toast-icon">{{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}</span>
      <span class="toast-text">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { personInfo } from '@/data/projects.js'

const form = reactive({
  avatar: '',
  name: '',
  studentId: '',
  faculty: '',
  className: '',
  major: '',
  intro: '',
  about: '',
  skillDetail: '',
  email: '',
  phoneNumber: ''
})

const originalSnapshot = ref(null)
const isSaving = ref(false)

const errors = reactive({
  name: '',
  studentId: '',
  faculty: '',
  className: '',
  major: '',
  intro: '',
  email: '',
  phoneNumber: ''
})

const toast = reactive({ show: false, type: 'success', message: '' })

const leaveConfirm = reactive({ show: false, proceed: null })

const isDirty = computed(() => {
  if (!originalSnapshot.value) return false
  const o = originalSnapshot.value
  return (
    form.name !== o.name ||
    form.studentId !== o.studentId ||
    form.faculty !== o.faculty ||
    form.className !== o.className ||
    form.major !== o.major ||
    form.intro !== o.intro ||
    form.about !== o.about ||
    form.skillDetail !== o.skillDetail ||
    form.email !== o.email ||
    form.phoneNumber !== o.phoneNumber
  )
})

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isPhoneValid = (phone) => /^1[3-9]\d{9}$/.test(phone)

const loadForm = () => {
  form.avatar = personInfo.avatar
  form.name = personInfo.name
  form.studentId = personInfo.studentId
  form.faculty = personInfo.faculty
  form.className = personInfo.className
  form.major = personInfo.major
  form.intro = personInfo.intro
  form.about = personInfo.about
  form.skillDetail = personInfo.skillDetail
  form.email = personInfo.contact.email
  form.phoneNumber = personInfo.contact.phoneNumber
  originalSnapshot.value = { ...form }
}

const resetAllErrors = () => {
  Object.keys(errors).forEach(k => { errors[k] = '' })
}

const validateForm = () => {
  resetAllErrors()
  let valid = true

  if (!form.name.trim()) {
    errors.name = '姓名不能为空'
    valid = false
  } else if (form.name.trim().length > 20) {
    errors.name = '姓名不能超过 20 个字符'
    valid = false
  }

  if (!form.studentId.trim()) {
    errors.studentId = '学号不能为空'
    valid = false
  }

  if (!form.faculty.trim()) {
    errors.faculty = '请填写所属学院'
    valid = false
  }

  if (!form.className.trim()) {
    errors.className = '请填写专业班级'
    valid = false
  }

  if (!form.major.trim()) {
    errors.major = '请填写专业名称'
    valid = false
  }

  if (!form.intro.trim()) {
    errors.intro = '个人简介不能为空'
    valid = false
  } else if (form.intro.trim().length > 120) {
    errors.intro = '个人简介不能超过 120 个字符'
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = '邮箱不能为空'
    valid = false
  } else if (!isEmailValid(form.email.trim())) {
    errors.email = '邮箱格式不正确，如 example@qq.com'
    valid = false
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = '电话号码不能为空'
    valid = false
  } else if (!isPhoneValid(form.phoneNumber.trim())) {
    errors.phoneNumber = '请输入有效的 11 位手机号'
    valid = false
  }

  return valid
}

watch(() => form.name, () => { errors.name = '' })
watch(() => form.studentId, () => { errors.studentId = '' })
watch(() => form.faculty, () => { errors.faculty = '' })
watch(() => form.className, () => { errors.className = '' })
watch(() => form.major, () => { errors.major = '' })
watch(() => form.intro, () => { errors.intro = '' })
watch(() => form.email, () => {
  errors.email = ''
  if (form.email && !isEmailValid(form.email.trim())) {
    errors.email = '邮箱格式不正确'
  }
})
watch(() => form.phoneNumber, () => {
  errors.phoneNumber = ''
  if (form.phoneNumber && !isPhoneValid(form.phoneNumber.trim())) {
    errors.phoneNumber = '请输入有效的 11 位手机号'
  }
})

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 2500)
}

const cancelChanges = () => {
  loadForm()
  resetAllErrors()
  showToast('↺ 已取消修改，恢复为原始值', 'info')
}

const resetToOriginal = () => {
  if (!isDirty.value) {
    showToast('当前已是最新状态', 'info')
    return
  }
  cancelChanges()
}

const handleSave = async () => {
  if (!validateForm()) {
    showToast('❌ 表单校验未通过，请检查错误项', 'error')
    return
  }

  isSaving.value = true
  await new Promise(r => setTimeout(r, 600))

  personInfo.name = form.name.trim()
  personInfo.studentId = form.studentId.trim()
  personInfo.faculty = form.faculty.trim()
  personInfo.className = form.className.trim()
  personInfo.major = form.major.trim()
  personInfo.intro = form.intro.trim()
  personInfo.about = form.about.trim()
  personInfo.skillDetail = form.skillDetail.trim()
  personInfo.contact.email = form.email.trim()
  personInfo.contact.phoneNumber = form.phoneNumber.trim()

  originalSnapshot.value = { ...form }
  isSaving.value = false
  showToast('✅ 个人信息保存成功！')
}

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return new Promise((resolve) => {
      leaveConfirm.show = true
      leaveConfirm.proceed = () => resolve(true)
      leaveConfirm.cancel = () => resolve(false)
    })
  }
})

const stayOnPage = () => {
  leaveConfirm.show = false
  if (typeof leaveConfirm.cancel === 'function') {
    leaveConfirm.cancel()
  }
}

const leaveAnyway = () => {
  leaveConfirm.show = false
  if (typeof leaveConfirm.proceed === 'function') {
    leaveConfirm.proceed()
  }
}

onMounted(() => { loadForm() })
</script>

<style scoped>
.page-title-row {
  margin-bottom: 24px;
}
.page-title-row h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}
.page-sub {
  font-size: 14px;
  color: #64748b;
}
.edit-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
}
.avatar-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  flex-shrink: 0;
}
.avatar-wrap img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
}
.avatar-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.avatar-tip {
  font-size: 13px;
  color: #64748b;
}
.dirty-indicator {
  font-size: 12px;
  color: #f59e0b;
  font-weight: 600;
  padding: 3px 10px;
  background: #fef3c7;
  border-radius: 10px;
  display: inline-block;
  align-self: flex-start;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}
.required {
  color: #ef4444;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: 0.2s;
  font-family: inherit;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: #60a5fa;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.12);
}
.form-group input.invalid,
.form-group textarea.invalid {
  border-color: #ef4444;
  background: #fef2f2;
}
.form-group input.invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}
.form-group textarea {
  resize: vertical;
}
.err-text {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 5px;
}
.form-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}
.form-meta .err-text {
  margin-top: 0;
}
.char-count {
  font-size: 11px;
  color: #94a3b8;
}
.char-count.warn {
  color: #f59e0b;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.btn {
  padding: 11px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-gray { background: #f1f5f9; color: #475569; }
.btn-gray:hover { background: #e2e8f0; }
.btn-ghost {
  background: transparent;
  color: #64748b;
  border: 1px dashed #cbd5e1;
}
.btn-ghost:hover:not(:disabled) {
  background: #fef3c7;
  color: #92400e;
  border-color: #f59e0b;
}
.btn-ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(96, 165, 250, 0.3);
  transform: translateY(-1px);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-danger {
  background: #ef4444;
  color: #fff;
}
.btn-danger:hover {
  background: #dc2626;
}
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(3px);
}
.confirm-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 28px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  animation: modalIn 0.2s ease-out;
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.confirm-icon {
  font-size: 48px;
  margin-bottom: 14px;
}
.confirm-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
}
.confirm-message {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 22px;
}
.confirm-hint {
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
}
.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.toast {
  position: fixed;
  top: 32px;
  right: 32px;
  padding: 14px 22px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: toastIn 0.3s ease-out;
  max-width: 360px;
}
.toast.success { background: #dcfce7; border: 1px solid #bbf7d0; color: #15803d; }
.toast.error   { background: #fee2e2; border: 1px solid #fecaca; color: #b91c1c; }
.toast.info    { background: #dbeafe; border: 1px solid #bfdbfe; color: #1d4ed8; }
@keyframes toastIn {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
}
.toast-text { flex: 1; }
</style>
