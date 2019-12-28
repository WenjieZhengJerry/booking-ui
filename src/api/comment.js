import {
    axios
  } from '@/utils/request'
  
const api = {
    //comment: '/api/commentManage'
    comment: '/commentManage'
}
// 获取评论列表 parameter: { pageSize: 10, pageNo: 1 }
export function getCommentList (parameter) {
    return axios({
        url: api.comment,
        method: 'get',
        params: parameter
    })
}
// 根据id删除评论 id
export function deleteComment (id) {
    return axios({
        url: `${api.comment}/${id}`,
        method: 'delete'
    })
}
// 批量删除评论 parameter: { ids }
export function deleteCommentAll (parameter) {
    return axios({
        url: `${api.comment}`,
        method: 'delete',
        params: parameter
    })
}
//添加评论 parameter: {...comment}
export function addComment (parameter) {
    return axios({
        url: `${api.comment}/${parameter.oid}`,
        method: 'post',
        data: parameter
    })
}
//更新评论信息
export function updateComment (parameter) {
    return axios({
        url: `${api.comment}/${parameter.cid}`,
        method: 'put',
        data: parameter
    })
}

/*-----------------------------------------------------------------------*/

//获取评论详细信息
export function getCommentDetail (id) {
    return axios({
        url: `${api.comment}/${id}`,
        method: 'get'
    })
}
