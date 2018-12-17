// component
import Layout from "../../layout/index.vue";

const Login = resolve => require(["../../login/index.vue"], resolve);
const Register = resolve => require(["../../register/index.vue"], resolve);
const Dashboard = resolve => require(["../../dashboard/index.vue"], resolve);
export default {
  routes: [{
    path: "/",
    redirect: "/dashboard"
  }, {
    path: "/login",
    component: Login
  }, {
    path: "/dashboard",
    component: Dashboard
  }, {
    path: "/register",
    component: Register
  },{
    path: "/layout",
    component: Layout,
    children: [{
      path: "catalog/infolist",
      component: resolve => require(["../../catalog/infolist/index.vue"], resolve)
    }, {
        path: "catalog/infolist/detail",
        component: resolve => require(["../../catalog/detail/index.vue"], resolve)
    },{
      path: "catalog",
      component: resolve => require(["../../catalog/index.vue"], resolve),
      children: [{
        path: "resource",
        component: resolve => require(["../../catalog/resource/index.vue"], resolve)
      }, {
        path: "details",
        component: resolve => require(["../../catalog/details/index.vue"], resolve)
      }]
    },{
      path: "service/serviceList",
      component: resolve => require(["../../service/serviceList/index.vue"], resolve)
    }, {
      path: "service/serviceList/detail",
      component: resolve => require(["../../service/detail/index.vue"], resolve)
    },{
      path: "subject",
      component: resolve => require(["../../subject/index.vue"], resolve)
    },{
      path: "interaction",
      component: resolve => require(["../../interaction/index.vue"], resolve),
      children: [{
        path: "interactionAdvice",
        component: resolve => require(["../../interaction/container/interactionAdvice/index.vue"], resolve),
      }, {
        path: "interactionRequireSurvey",
        component: resolve => require(["../../interaction/container/interactionRequireSurvey/index.vue"], resolve),
      }]
    },{
      path: "admin",
      component: resolve => require(["../../admin/index.vue"], resolve),
      // children: [{
      //   path: "applyList",
      //   component: resolve => require(["../../admin/container/applyList/index.vue"], resolve)
      // }, {
      //   path: "collect",
      //   component: resolve => require(["../../admin/container/collect/index.vue"], resolve)
      // }, {
      //   path: "score",
      //   component: resolve => require(["../../admin/container/score/index.vue"], resolve)
      // }, {
      //   path: "bug",
      //   component: resolve => require(["../../admin/container/bug/index.vue"], resolve)
      // }, {
      //   path: "need",
      //   component: resolve => require(["../../admin/container/need/index.vue"], resolve)
      // }]
    }]
  }]
}
