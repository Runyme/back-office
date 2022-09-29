import store from '@/store/'

const token = store.getters.getToken

export const openFile = (id) => {
  window.open(`${process.env.VUE_APP_API_URL}/arquivos/${id}/open?token=${token}`)
}

export const downloadFile = (id) => {
  window.open(`${process.env.VUE_APP_API_URL}/arquivos/${id}/download?token=${token}`)
}