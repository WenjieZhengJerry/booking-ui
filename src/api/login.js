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

