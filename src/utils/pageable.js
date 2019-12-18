export function toOffsetParam (params) {
    if (params === undefined) {
      return
    }
    const pageSize = params.data.size
    const pageNo = params.data.number
    if (pageNo < 0) {
      return
    }
    if (pageSize < 1) {
      return
    }
    console.log('return:' + {
      limit: pageSize,
      offset: (pageNo - 1) * pageSize
    })
  
    return {
      limit: pageSize,
      offset: (pageNo - 1) * pageSize
    }
  }
  
  export function parsePage (params) {
    if (params === undefined) {
      return {
        pageSize: 10,
        pageNo: 1,
        totalCount: 0,
        totalPage: 1,
        data: []
      }
    }
    const size = params.data.size
    const number = params.data.number
    const totalPages = params.data.totalPages
    const totalElements = params.data.totalElements
  
    return {
      pageSize: size,
      pageNo: number + 1,
      totalCount: totalElements,
      totalPage: totalPages,
      data: params.data.content
    }
  }
  
  export function emptyPagePromise () {
    return new Promise((resolve, reject) => {
      resolve()
    }).then(res => {
      return parsePage()
    })
  }
  