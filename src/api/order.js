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

  /*--------以下是用户界面的api-----------------------------------------------------------------------*/

  //订单预订确认
  export function confirmOrder (paramter) {
    return axios({
      url: `${api.order}`,
      method: 'put',
      data: paramter
    })
  }

  //付款
  export function pay (id) {
    return axios({
      url: `${api.order}/pay/${id}`,
      method: 'put'
    })
  }

  //获取用户自己的订单
  export function getMyOrders(id, orderStatus) {
    return axios({
      url: `${api.order}/user/${id}`,
      method: 'get',
      params: { 'orderStatus': orderStatus }
    })
  }

  //获取一条订单详情
  export function getAOrder(id) {
    return axios({
      url: `${api.order}/${id}`,
      method: 'get'
    })
  }