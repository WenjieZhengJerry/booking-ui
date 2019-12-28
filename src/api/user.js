// api/User.js
import { axios } from '@/utils/request'

const api = {
  //user: '/api/user'
  user: '/user'
}

// 根据用户 id 获取用户信息
export function getUser (uid) {
  return axios({
    url: `${api.user}/${uid}`,
    method: 'get'
  })
}

// 增加用户
export function addUser (parameter) {
  return axios({
    url: api.user,
    method: 'post',
    data: parameter
  })
}

// 更新用户 // or (id, parameter)
export function updateUser (parameter) {
  return axios({
    url: `${api.user}/${parameter.uid}`, // or `${api.user}/${uid}`
    method: 'put',
    data: parameter
  })
}

// 批量更新用户 
export function updateUserStatusBatch (parameter, status) {
  return axios({
    url: `${api.user}`, 
    method: 'put',
    headers:status,
    data: parameter
  })
}

// 删除用户
export function deleteUser (uid) {
  return axios({
    url: `${api.user}/${uid}`,
    method: 'delete'
  })
}

// 批量删除用户
export function deleteUserBatch (parameter) {
  return axios({
    url: `${api.user}`,
    method: 'delete',
    data: parameter
  })
}

// 获取用户列表 parameter: { pageSize: 10, pageNo: 1 }
export function getUsers (parameter) {
  console.log('getUsers', parameter)
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}
