import Http from "./http.js";
import Encrypt from "./encrypt.js";
import {
  Message,
  Notification
} from 'element-ui';
export default {
  /**
   * Is access allowed
   */
  accessibility(to, from, next) {
    if (to.matched.some(record => record.meta.auth)) {
      if (!Encrypt.token.get('userName')) {
        Message.error({
          message: '未登录，请先登录！',
          duration:2000
        })
        setTimeout(() => {
            next({
          path: "/login",
          query: {
            redirect: to.fullPath
          }
        })
          }, 2000);
      } else {
        next()
      }
    } else {
      next()
    }
  },
  /**
   * Json Web Token handler
   */
  interceptor() {
    const vm = this;
    var httpStatus =true;//防止http并行时页面弹出多个提示框
    Http.fetch.interceptors.request.use(function (config) {
      const token = Encrypt.token.get();
      if (token)
        config.headers.Authorization = "Wiserv " + token;
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    Http.fetch.interceptors.response.use(function (response) {
      var reg = /^.*\/login$/;
      if (reg.test(response.config.url)) {} else {
        if (response.status === 511 && httpStatus) {
          Message.error({
            message: '登录已失效或用户未登录过，请登录！',
            duration:2000
          })
          httpStatus = false;
          setTimeout(() => {
            window.location.href = "#/login";
            httpStatus = true;
          }, 2000);
        } else if (response.status !== 200 && response.status !== 511) {
          Notification.error({
            title: 'Http:' + response.status,
            message: '系统异常 '
          })
        }
      }
      return response;
    }, function (error) {
      return Promise.reject(error);
    });
  }
}
