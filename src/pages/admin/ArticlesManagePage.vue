<template>
  <div>
    <div class="page-title-row">
      <h2>📝 文章管理</h2>
      <p class="page-sub">管理所有文章内容（共 {{ articles.length }} 篇）</p>
    </div>

    <div class="toolbar">
      <el-input
        v-model="filterKey"
        placeholder="搜索文章标题..."
        clearable
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="statusFilter" placeholder="全部状态" clearable class="status-select">
        <el-option label="已发布" value="已发布" />
        <el-option label="草稿" value="草稿" />
      </el-select>
      <el-button type="primary" @click="openAddForm">
        <el-icon><Plus /></el-icon>
        <span>新增文章</span>
      </el-button>
    </div>

    <el-table :data="filteredArticles" stripe style="width: 100%" class="data-table">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="cover" label="封面" width="80" align="center">
        <template #default="{ row }">
          <span style="font-size: 22px;">{{ row.cover }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <div class="cell-title">{{ row.title }}</div>
          <div class="cell-desc">{{ row.summary }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" width="110">
        <template #default="{ row }">
          <el-tag size="small" effect="plain">{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.status === '已发布' ? 'success' : 'warning'"
            effect="light"
            round
          >{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览" width="80" align="center" />
      <el-table-column prop="updatedAt" label="更新日期" width="120" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="openEditForm(row)">编辑</el-button>
          <el-popconfirm
            title="确定要删除这篇文章吗？"
            confirm-button-text="删除"
            cancel-button-text="取消"
            confirm-button-type="danger"
            @confirm="doDelete(row)"
          >
            <template #reference>
              <el-button size="small" type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="row.status === '已发布'"
            size="small"
            link
            @click="previewArticle(row.id)"
          >预览</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有匹配的文章" :image-size="80" />
      </template>
    </el-table>

    <!-- 新增/编辑文章对话框 -->
    <el-dialog
      v-model="showForm"
      :title="editingId ? '✏️ 编辑文章' : '➕ 新增文章'"
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
            <el-form-item label="封面" prop="cover">
              <el-input v-model="form.cover" placeholder="📝" maxlength="2" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入文章标题" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-input v-model="form.category" placeholder="如：前端" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" style="width: 100%">
                <el-option label="已发布" value="已发布" />
                <el-option label="草稿" value="草稿" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="标签">
          <el-input
            v-model="form.tagsStr"
            placeholder="逗号分隔，如：Vue 3, Pinia"
          />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="2"
            placeholder="一句话介绍文章"
          />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="文章正文内容..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" :loading="isSaving" @click="handleSave">
          {{ editingId ? '保存修改' : '确认新增' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '@/stores/article.js'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

const router = useRouter()
const articleStore = useArticleStore()
const { articles } = storeToRefs(articleStore)

const filterKey = ref('')
const statusFilter = ref('')
const showForm = ref(false)
const editingId = ref(null)
const isSaving = ref(false)
const formRef = ref(null)

const form = reactive({
  cover: '📝',
  title: '',
  category: '',
  status: '草稿',
  tagsStr: '',
  summary: '',
  content: ''
})

const rules = {
  title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
  category: [{ required: true, message: '文章分类不能为空', trigger: 'blur' }],
  summary: [{ required: true, message: '文章摘要不能为空', trigger: 'blur' }]
}

const filteredArticles = computed(() => {
  let result = articles.value
  if (filterKey.value.trim()) {
    const key = filterKey.value.toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(key))
  }
  if (statusFilter.value) {
    result = result.filter(a => a.status === statusFilter.value)
  }
  return result
})

const resetForm = () => {
  form.cover = '📝'
  form.title = ''
  form.category = ''
  form.status = '草稿'
  form.tagsStr = ''
  form.summary = ''
  form.content = ''
}

const openAddForm = () => {
  editingId.value = null
  resetForm()
  showForm.value = true
}

const openEditForm = (a) => {
  editingId.value = a.id
  form.cover = a.cover
  form.title = a.title
  form.category = a.category
  form.status = a.status
  form.tagsStr = a.tags.join(', ')
  form.summary = a.summary
  form.content = a.content
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
    cover: form.cover.trim() || '📝',
    title: form.title.trim(),
    category: form.category.trim(),
    status: form.status,
    tags,
    summary: form.summary.trim(),
    content: form.content.trim()
  }

  if (editingId.value) {
    articleStore.updateArticle(editingId.value, payload)
    ElMessage.success(`文章「${payload.title}」修改成功`)
  } else {
    articleStore.addArticle(payload)
    ElMessage.success(`新增文章「${payload.title}」成功`)
  }

  isSaving.value = false
  showForm.value = false
}

const doDelete = (a) => {
  articleStore.deleteArticle(a.id)
  ElMessage.info(`已删除文章「${a.title}」`)
}

const previewArticle = (id) => {
  router.push({ name: 'article-detail', params: { id } })
}

onMounted(() => {
  articleStore.loadArticles()
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
.status-select { width: 140px; }
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
