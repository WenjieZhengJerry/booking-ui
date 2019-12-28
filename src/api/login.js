// api/User.js
import { axios } from '@/utils/request'

const api = {
  /* login: '/api/login',
  register: '/api/login/register',
  update: '/api/login/update' */
  login: '/login',
  register: '/login/register',
  update: '/login/update'
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
    method: 'get',
    timeout: 300000
  })
}

// 验证邮箱功能
export function validEmailFunction (token) {
  return axios({
    url: `${api.update}/info`,
    method: 'post',
    headers:token
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

// 更新信息
export function updateInfo(parameter){
  return axios({
    url: `${api.update}/info`,
    method: 'put',
    data: parameter
  })
}

// 更新密码
export function updatePassword(parameter,token){
  return axios({
    url: `${api.update}/password`,
    method: 'put',
    headers:token,
    data: parameter
  })
}

// 上传头像
export function updateAvatar(parameter){
  return axios({
    url: `${api.update}/avatar`,
    method: 'put',
    data: parameter,
    headers: { 
      'Content-Type': 'multipart/form-data'
     }
  })
}

