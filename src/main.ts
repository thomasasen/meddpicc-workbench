import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/main.css'
import './styles/reverseTimelineDragElevation.css'
import './styles/redesignFoundations.css'
import './styles/appleInteractions.css'
import './styles/appleVisualRedesign.css'
import './styles/formRowAlignment.css'

createApp(App).use(createPinia()).use(router).mount('#app')
