import {
    axios
  } from '@/utils/request'
  
const api = {
    //room: '/api/roomManage'
    room: '/roomManage'
}
// 获取房间列表 parameter: { pageSize: 10, pageNo: 1 }
export function getRoomList (parameter) {
    return axios({
        url: api.room,
        method: 'get',
        params: parameter
    })
}
// 根据id删除房间 id
export function deleteRoom (id) {
    return axios({
        url: `${api.room}/${id}`,
        method: 'delete'
    })
}
// 批量删除房间 parameter: { ids }
export function deleteRoomAll (parameter) {
    return axios({
        url: `${api.room}`,
        method: 'delete',
        params: parameter
    })
}
//添加房间 parameter: {...Room}
export function addRoom (parameter) {
    return axios({
        url: `${api.room}/${parameter.hid}`,
        method: 'post',
        data: parameter
    })
}
//更新房间信息
export function updateRoom (parameter) {
    return axios({
        url: `${api.room}/${parameter.rid}`,
        method: 'put',
        data: parameter
    })
}

/*-----------------------------------------------------------------------*/

//获取房间详细信息
export function getRoomDetail (id) {
    return axios({
        url: `${api.room}/${id}`,
        method: 'get'
    })
}
