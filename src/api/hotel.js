import {
    axios
  } from '@/utils/request'
  
const api = {
    hotel: '/api/hotelManage'
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
        url: `${api.hotel}`,
        method: 'delete',
        params: parameter
    })
}
//添加酒店 parameter: {...hotel}
export function addHotel (parameter) {
    return axios({
        url: `${api.hotel}`,
        method: 'post',
        data: parameter
    })
}
//更新酒店信息
export function updateHotel (parameter) {
    return axios({
        url: `${api.hotel}/${parameter.hid}`,
        method: 'put',
        data: parameter
    })
}

/*-----------------------------------------------------------------------*/

//获取酒店详细信息
export function getHotelDetail (id) {
    return axios({
        url: `${api.hotel}/${id}`,
        method: 'get'
    })
}
