import axios, { AxiosError, AxiosResponse } from "axios";
import router from "@/router";
const baseUrl='http://localhost:4325'
const axiosCancelTokens:any=[];//取消请求的token
const $api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers:{
    'Content-Type':'application/json;charset=UTF-8'
  }
});
// 请求拦截器
$api.interceptors.request.use(
  function(config){
    const token = localStorage.getItem("token");
    const source = axios.CancelToken.source();
    config.cancelToken = source.token
    axiosCancelTokens.push(source.cancel);//将token存入数组
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 给每个请求添加token
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

$api.interceptors.response.use(
  function(response:AxiosResponse):any {
    //token过期或失效
    if(response.data.code === 403){
      //跳转到登录页
      localStorage.clear();
      router.replace("/login");
    }
    return response.data;
  },
  function(error:any):any {
    if(axios.isCancel(error)) {
      return new Promise(() => {})
    }else if(error.response.status === 400){
      return Promise.reject(error)
    }else if(error.response.status === 403){
      //跳转到登录页
      localStorage.clear();
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);
export default $api;
export {axiosCancelTokens}



