import {
    axios
  } from '@/utils/request'
  
const api = {
    hotel: '/hotel'
}
// 获取酒店列表 parameter: { pageSize: 10, pageNo: 1 }
export function getHotelList (parameter) {
    return axios({
        url: api.hotel,
        method: 'get',
        params: parameter
    })
}
// 根据id删除酒店 id
export function deleteHotel (id) {
    return axios({
        url: `${api.hotel}/${id}`,
        method: 'delete'
    })
}
// 批量删除酒店 parameter: { ids }
export function deleteHotelAll (parameter) {
    return axios({
        url: `${api.hotel}/`,
        method: 'delete',
        params: parameter
    })
}