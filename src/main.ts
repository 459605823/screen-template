import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
// css
import '@unocss/reset/normalize.css';
import 'uno.css';
import '@/styles/basic.scss';
// flag-icons
import 'flag-icons/css/flag-icons.min.css';
// svg-icons
import 'virtual:svg-icons-register';
// dayjs汉化
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const app = createApp(App);

app.use(router);

app.mount('#app');
