<template>
  <div>
    <div class="page-title-row">
      <h2>📂 项目信息管理</h2>
      <p class="page-sub">管理前台展示的所有项目信息（{{ projects.length }} 个项目）</p>
    </div>

    <div class="toolbar">
      <el-input
        v-model="filterKey"
        placeholder="搜索项目..."
        clearable
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="openAddForm">
        <el-icon><Plus /></el-icon>
        <span>新增项目</span>
      </el-button>
    </div>

    <el-table :data="filteredProjects" stripe style="width: 100%" class="data-table">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="icon" label="图标" width="80" align="center">
        <template #default="{ row }">
          <span style="font-size: 22px;">{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项目名称" min-width="220">
        <template #default="{ row }">
          <div class="cell-title">{{ row.name }}</div>
          <div class="cell-desc">{{ row.description }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.status === '已完成' ? 'success' : 'warning'"
            effect="light"
            round
          >{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="date" label="日期" width="110" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="openEditForm(row)">编辑</el-button>
          //249980447+赵佳兴
          <el-popconfirm    
            title="确定要删除这个项目吗？"
            confirm-button-text="删除"
            cancel-button-text="取消"
            confirm-button-type="danger"
            @confirm="doDelete(row)"
          >
            <template #reference>
              <el-button size="small" type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
          <el-button size="small" link @click="previewProject(row.id)">预览</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有匹配的项目" :image-size="80" />
      </template>
    </el-table>

    <!-- 新增/编辑项目对话框 -->
    <el-dialog
      v-model="showForm"
      :title="editingProject ? '✏️ 编辑项目' : '➕ 新增项目'"
      width="640px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="right"
      >
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" placeholder="🌐" maxlength="2" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入项目名称" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" style="width: 100%">
                <el-option label="已完成" value="已完成" />
                <el-option label="进行中" value="进行中" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-input v-model="form.role" placeholder="如：独立开发" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="日期" prop="date">
              <el-input v-model="form.date" placeholder="2025-10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签">
              <el-input v-model="form.tagsStr" placeholder="Vue 3, Vite, TS" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            placeholder="一句话介绍这个项目"
          />
        </el-form-item>
        <el-form-item label="详情">
          <el-input
            v-model="form.detail"
            type="textarea"
            :rows="3"
            placeholder="详细描述项目的技术栈、功能亮点等"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" :loading="isSaving" @click="handleSave">
          {{ editingProject ? '保存修改' : '确认新增' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project.js'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

const router = useRouter()
const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)
const filterKey = ref('')
const showForm = ref(false)
const editingProject = ref(null)
const isSaving = ref(false)
const formRef = ref(null)

const form = reactive({
  icon: '',
  name: '',
  status: '已完成',
  role: '',
  date: '',
  tagsStr: '',
  description: '',
  detail: ''
})

const rules = {
  icon: [{ required: true, message: '请输入 emoji 图标', trigger: 'blur' }],
  name: [
    { required: true, message: '项目名称不能为空', trigger: 'blur' },
    { max: 50, message: '不能超过 50 个字符', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  role: [{ required: true, message: '请填写角色', trigger: 'blur' }],
  date: [{ required: true, message: '请填写日期', trigger: 'blur' }],
  description: [{ required: true, message: '请填写项目描述', trigger: 'blur' }]
}

const filteredProjects = computed(() => {
  if (!filterKey.value.trim()) return projects.value
  const key = filterKey.value.toLowerCase()
  return projects.value.filter(p =>
    p.name.toLowerCase().includes(key) ||
    p.description.toLowerCase().includes(key)
  )
})

const resetForm = () => {
  form.icon = ''
  form.name = ''
  form.status = '已完成'
  form.role = ''
  form.date = ''
  form.tagsStr = ''
  form.description = ''
  form.detail = ''
}

const openAddForm = () => {
  editingProject.value = null
  resetForm()
  showForm.value = true
}

const openEditForm = (p) => {
  editingProject.value = p
  form.icon = p.icon
  form.name = p.name
  form.status = p.status
  form.role = p.role
  form.date = p.date
  form.tagsStr = p.tags.join(', ')
  form.description = p.description
  form.detail = p.detail
  showForm.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.error('请完善必填项')
    return
  }

  isSaving.value = true
  await new Promise(r => setTimeout(r, 400))

  const tags = form.tagsStr
    .split(/[,，]/)
    .map(s => s.trim())
    .filter(Boolean)

  const payload = {
    icon: form.icon.trim(),
    name: form.name.trim(),
    status: form.status,
    role: form.role.trim(),
    date: form.date.trim(),
    tags,
    description: form.description.trim(),
    detail: form.detail.trim()
  }

  if (editingProject.value) {  //249980447+赵佳兴
    projectStore.updateProject(editingProject.value.id, payload)
    ElMessage.success(`项目「${payload.name}」修改成功`)
  } else {
    projectStore.addProject(payload)
    ElMessage.success(`新增项目「${payload.name}」成功`)
  }

  isSaving.value = false
  showForm.value = false
}

const doDelete = (p) => {
  if (projectStore.deleteProject(p.id)) {
    ElMessage.info(`已删除项目「${p.name}」`)
  }
}

const previewProject = (id) => {
  router.push({ name: 'project-detail', params: { id } })
}

onMounted(() => {
  projectStore.loadProjects()
})
</script>

<style scoped>
.page-title-row { margin-bottom: 20px; }
.page-title-row h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}
.page-sub { font-size: 14px; color: #64748b; }
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.search-input { flex: 1; max-width: 360px; }
.data-table {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
.cell-title {
  font-weight: 600;
  color: #1e293b;
}
.cell-desc {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
  max-width: 300px;
}
</style>
