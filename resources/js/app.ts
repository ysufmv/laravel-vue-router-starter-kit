import '../css/app.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router/index';
import { initializeTheme } from './composables/useAppearance';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize theme before mounting
initializeTheme();

app.mount('#app');
