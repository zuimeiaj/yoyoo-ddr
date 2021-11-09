import Vue from 'vue'
import App from './App.vue'
import routes from './routes'

import Router from 'vue-router'
Vue.use(Router)
Vue.config.productionTip = false
// 处理深层次组件传递回调函数的反锁步骤
Vue.prototype.eventbus = new Vue()
new Vue({
  render: (h) => h(App),
  router: new Router({ routes }),
}).$mount('#app')
