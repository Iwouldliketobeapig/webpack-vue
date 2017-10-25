/* global */
require("es6-promise").polyfill();
import axios from "axios";
import { Notification } from "element-ui";
var Window = Window || {};
Window.$notify = Notification;
var instance = axios.create({
  timeout: 3000
});

instance.interceptors.response.use(function (res) {
  if (res.data.code < 200 || res.data.code >= 300) {
    if (instance.message) {
      Window.$notify.info({
        message: `请求错误：${res.data.msg}`
      });
    }
    throw res.data.msg;
  } else {
    return res;
  }
}, function (error) {
  return Promise.reject(error);
});

instance.message = true;

module.exports = instance;
