import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as PDFJS from 'pdfjs-dist';
PDFJS.GlobalWorkerOptions.workerSrc = '../public/pdf.worker.min.js';

const app = createApp(App)

app.use(router)
app.use(ElementPlus);
app.mount('#app')
