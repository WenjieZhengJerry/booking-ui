// api/upload.js
  import {
    axios
  } from '@/utils/request'
  
  const api = {
    upload: '/api/upload'
  }

  // 文件上传 parameter: { directoryName: hotel/room, img: file }
  export function uploadFile (parameter) {
    return axios({
      url: api.upload,
      method: 'post',
      params: parameter
    })
  }

  // 根据路径删除文件 parameter: { filePath: xxxxx }
  export function deleteFile (parameter) {
    return axios({
      url: api.upload,
      method: 'delete',
      params: parameter
    })
  }