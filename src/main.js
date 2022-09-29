import Vue from 'vue'
import App from './App.vue'

// Plugins
import router from '@/router/'
import store from '@/store/'
import http from '@/services/http'
import Buefy from 'buefy'
import VueSnackbar from 'vue-snack'
import { snackConfig } from './services/snack'
import Vuelidate from 'vuelidate'
import VueClipboard from 'vue-clipboard2'

// Global Imports
import '@/components/globals/_import'
import '@/components/icons/_import'

// Utils
import { hasRole, hasPermission } from '@/utils/can'
import { formatBrToEn, formatEnToBr } from '@/utils/momentHelpers'
import { openFile, downloadFile } from '@/utils/file'

import '@/assets/styles/main.scss'
import '@mdi/font/scss/materialdesignicons.scss'

Vue.config.productionTip = false
VueClipboard.config.autoSetContainer = true

Vue.use(Buefy)
Vue.use(VueSnackbar, snackConfig)
Vue.use(Vuelidate)
Vue.use(VueClipboard)

Vue.prototype.$http = http
Vue.prototype.$hasRole = hasRole
Vue.prototype.$hasPermission = hasPermission
Vue.prototype.$momentFormatBrToEn = formatBrToEn
Vue.prototype.$momentFormatEnToBr = formatEnToBr
Vue.prototype.$openFile = openFile
Vue.prototype.$downloadFile = downloadFile

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
