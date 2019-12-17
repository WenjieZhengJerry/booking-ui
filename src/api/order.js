// api/order.js
import {
    axios
  } from '@/utils/request'
  
  const api = {
    order: '/api/orderManage'
  }
  
  // 获取订单列表 parameter: { pageSize: 10, pageNo: 1 }
  export function getOrderList (parameter) {
    return axios({
      url: api.order,
      method: 'get',
      params: parameter
    })
  }
  
  // 根据订单 id 获取订单信息
  // export function getOrder (id) {
  //   return axios({
  //     url: `${api.order}/${id}`,
  //     method: 'get'
  //   })
  // }
  
  // 增加订单
  // export function addOrder (parameter) {
  //   return axios({
  //     url: api.order,
  //     method: 'post',
  //     data: parameter
  //   })
  // }
  
  // 更新订单 // or (id, parameter)
  export function updateOrder (parameter) {
    return axios({
      url: `${api.order}/${parameter.oid}`, // or `${api.user}/${id}`
      method: 'put',
      data: parameter
    })
  }
  
  // 删除订单
  export function deleteOrder (id) {
    return axios({
      url: `${api.order}/${id}`,
      method: 'delete'
    })
  }
  
  // 批量删除订单
  export function deleteIds (parameter) {
    return axios({
      url: `${api.order}`,
      method: 'delete',
      data: parameter
    })
  }