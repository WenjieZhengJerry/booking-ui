// api/User.js
import { axios } from '@/utils/request'

const api = {
  login: '/api/login',
  register: '/api/login/register'
}

// 获取加密公钥
export function getPublicKey (email) {
  return axios({
    url: `${api.login}/${email}`,
    method: 'get'
  })
}

// 登录
export function login (parameter) {
  return axios({
    url: api.login,
    method: 'post',
    data: parameter
  })
}

//登出
export function logout(){
  return axios({
    url: api.login,
    method: 'delete'
  })
}

// 获取验证信息
export function sendCaptcha (email) {
  return axios({
    url: `${api.register}/${email}`,
    method: 'get'
  })
}

// 注册用户
export function register (info, token) {
  return axios({
    url: api.register, 
    method: 'post',
    data: info,
    headers:token
  })
}

// 向服务器查询是否在线
export function isLogin(){
  return axios({
    url: `${api.login}/isLogin`, 
    method: 'get'
  })
}

// 找回密码
export function findPassword(email,token){
  return axios({
    url: `${api.register}/${email}`, 
    method: 'post',
    headers:token
  })
}

