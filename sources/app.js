// library
import Vue from "vue";
import VueRouter from "vue-router";
import 'babel-polyfill';
// css
import "./common/styles/reset.scss"
import "font-awesome/css/font-awesome.css";
// ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.css";
// util
import Http from "./common/helper/http.js"
import Auth from "./common/helper/auth.js"
import Routers from "./common/global/router.js"

/** Plugins */
Vue.use(VueRouter);
Vue.use(ElementUI);

/** Routers */
const router = new VueRouter(Routers)
router.beforeEach((to, from, next) => {
  Auth.accessibility(to, from, next);
})
Auth.interceptor();//http拦截器
const app = new Vue({
  router
}).$mount("#app")
