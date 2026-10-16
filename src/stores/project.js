import { defineStore } from 'pinia'
import { projects as seedProjects } from '@/data/projects.js'

const STORAGE_KEY = 'project_store'

const clone = (data) => JSON.parse(JSON.stringify(data))

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: []
  }),

  getters: {
    projectCount: (state) => state.projects.length,

    completedCount: (state) =>
      state.projects.filter(p => p.status === '已完成').length,

    inProgressCount: (state) =>
      state.projects.filter(p => p.status === '进行中').length,

    getById: (state) => (id) =>
      state.projects.find(p => p.id === Number(id))
  },

  actions: {
    loadProjects() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.projects = JSON.parse(raw)
          return
        } catch (e) {
          console.warn('项目数据解析失败，使用默认数据', e)
        }
      }
      this.projects = clone(seedProjects)
      this.persist()
    },

    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects))
    },
    
    addProject(data) {
      const newId = this.projects.length
        ? Math.max(...this.projects.map(p => p.id)) + 1
        : 1
      const project = {
        id: newId,
        link: '#',
        github: '',
        features: [],
        ...data
      }
      this.projects.push(project)
      this.persist()
      return project
    },

    updateProject(id, data) {
      const idx = this.projects.findIndex(p => p.id === Number(id))
      if (idx === -1) return null
      this.projects[idx] = {
        ...this.projects[idx],
        ...data,
        id: Number(id)
      }
      this.persist()
      return this.projects[idx]
    },

    deleteProject(id) {
      const idx = this.projects.findIndex(p => p.id === Number(id))
      if (idx > -1) {
        this.projects.splice(idx, 1)
        this.persist()
        return true
      }
      return false
    }
  }
})
