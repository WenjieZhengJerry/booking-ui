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
			const tempData = []
			for (let i = 1; i <= 10; ++i) {
				let status = ''
				if (i % 5 == 0) status = 'FINISH'
				else if (i % 4 == 0) status = 'UNPAY'
				else if (i % 3 == 0) status = 'CANCEL'
				else status = 'UNUSE'
				tempData.push({
					id: i,
					orderNumber: '12306',
					hotel: '维也纳国际酒店',
					uName: '小泽又沐风',
					amount: '299.9',
					orderStatus: status,
					createTime: '2019-12-5 16:26:37'
				});
			}
      return {
        pageSize: 10,
        pageNo: 1,
        totalCount: 10,
        totalPage: 1,
        data: tempData
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
      data: (params && params.data.content) || []
    }
  }
  
  export function emptyPagePromise () {
    return new Promise((resolve, reject) => {
      resolve()
    }).then(res => {
      return parsePage()
    })
  }
  