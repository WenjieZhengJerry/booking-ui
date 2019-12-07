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
			for (let i = 1; i <= 25; ++i) {
				tempData.push({
          id: i,
          img: "../../assets/hotel-demo1.jpg",
          hname: `维也纳国际酒店${i}`,
          address: "广东省东莞市大学路1号",
          description: "于2010年开业，东莞市维也纳国际酒店旗舰店，适合广大人群入驻",
          service: "接待外宾，叫醒服务",
          facilities: "停车场,餐厅",
          phone: "13113112115",
          rate: 4.8,
          type: "高档型"
				});
			}
      return {
        pageSize: 10,
        pageNo: 1,
        totalCount: 25,
        totalPage: 3,
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
  