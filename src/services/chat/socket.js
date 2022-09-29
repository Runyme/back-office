import io from 'socket.io-client'

export default io(process.env.VUE_APP_CHAT_API_URL, { autoConnect: false, forceNew: true })
