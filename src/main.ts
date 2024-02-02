import {createApp} from 'vue';

import App from './App.vue';
import router from './router';

import '@unocss/reset/normalize.css';
import 'uno.css';
import '@/styles/basic.scss';
import 'flag-icons/css/flag-icons.min.css';
import 'virtual:svg-icons-register';

const app = createApp(App);

app.use(router);

app.mount('#app');
