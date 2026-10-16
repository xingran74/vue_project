import { defineStore } from 'pinia'

const STORAGE_KEY = 'user_store'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: '',
    loginTime: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    displayName: (state) => state.username || '游客'
  },

  actions: {
    // 登录
    login(username, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin' && password === '123456') {
            this.token = 'demo_token_' + Date.now()
            this.username = username
            this.loginTime = new Date().toISOString()
            this.persist()
            resolve()
          } else {
            reject(new Error('用户名或密码错误，请重试'))
          }
        }, 600)
      })
    },

    // 退出登录
    logout() {
      this.token = ''
      this.username = ''
      this.loginTime = null
      this.persist()
    },

    // 持久化到 localStorage
    persist() {
      const data = {
        token: this.token,
        username: this.username,
        loginTime: this.loginTime
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    },

    // 从 localStorage 恢复
    restore() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const data = JSON.parse(raw)
          this.token = data.token || ''
          this.username = data.username || ''
          this.loginTime = data.loginTime || null
        } catch (e) {
          console.warn('恢复用户状态失败', e)
        }
      }
    }
  }
})
