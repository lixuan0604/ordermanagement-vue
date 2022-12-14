import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'

const app = createApp(App)

app.directive('preventReClick', {
    mounted: function (el, binding) {
        console.log('el:', el.disabled)
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                },binding.value || 1000)
            }
        })
    }
});

app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount('#app')


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}