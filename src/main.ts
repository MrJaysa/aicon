import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@/assets/main.css'
import router from '@/router'
import App from '@/views/App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
