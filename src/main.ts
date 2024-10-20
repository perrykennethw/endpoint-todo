import { createApp } from 'vue';
import './assets/scss/_base.scss';
import App from './App.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);
app.use(autoAnimatePlugin);
app.mount('#app');
