<template>
<a-locale-provider :locale="zh_CN">
  <div class="main">
    <div class="title">
      <h4>酒店订单</h4>
      <div class="form-inline">
        <a-select :defaultValue="status" v-model="status" @change="handleChangeStatus" style="width: 150px">
          <a-select-option value="ALL">全部</a-select-option>
          <a-select-option value="UNUSE">待入住</a-select-option>
          <a-select-option value="UNPAY">待付款</a-select-option>
          <a-select-option value="SUCCESS">已完成</a-select-option>
          <a-select-option value="CANCEL">已取消</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="order-list">
      <ul>
        <li v-for="(order, index) in orders" :key="index">
          <div class="title">
            <span>
              订单号：
              <a @click="detail(order)">{{ order.oid }}</a>
            </span>
            <span>预订日期：{{ order.createTime }}</span>
          </div>
          <div class="content">
            <div class="h-info">
              <div class="pic">
                <a @click="detail(order)">
                  <img :src="'/api' + order.hotel.img">
                </a>
              </div>
              <div class="section">
                <a @click="detail(order)"><h4>{{ order.hotel.hname }}</h4></a>
                <p>{{ order.room.rname }}({{ order.room.type | roomTypeFilter }})</p>
                <p>入住日期：{{ order.startTime }}</p>
                <p>离店日期：{{ order.endTime }}</p>
                <p>共{{ getDateCount(order.endTime) - getDateCount(order.startTime) }}晚</p>
              </div>
            </div>
            <div class="price-box">
              <div class="section">
                <p>总价</p>
                <p class="price">
                  <span>￥<b>{{ order.totalPrice }}</b></span>
                </p>
              </div>
            </div>
            <div class="order-state">
              <p><a-badge :status="order.status | statusTypeFilter" :text="order.status | statusFilter" /></p>
            </div>
            <div class="btn-box">
              <div class="section">
                <a-button @click="pay(order)" v-if="order.status == 'UNPAY'" type="primary" class="btn" style="width: 88px">去付款</a-button>
                <a-button @click="detail(order)" v-if="order.status == 'UNUSE'" type="primary" class="btn">查看详情</a-button>
                <a-button v-if="order.status == 'UNPAY' || order.status == 'UNUSE'" type="danger" class="btn">
                  <a-popconfirm title="是否要取消此订单？" @confirm="deleteThis(order.oid)">
                    <a>取消订单</a>
                  </a-popconfirm>  
                </a-button>
                <a-button @click="bookAgain(order.hotel.hid)" v-if="order.status == 'SUCCESS' || order.status == 'CANCEL'"
                  type="primary" class="btn">再次预定</a-button>
                <a-button @click="bookAgain(order.hotel.hid)" v-if="order.status == 'SUCCESS'"
                  type="default" class="btn" style="width: 88px">去评价</a-button>
                <a-button v-if="order.status == 'CANCEL'" type="danger" class="btn">
                  <a-popconfirm title="是否要删除此订单？" @confirm="deleteThis(order.oid)">
                    <a>删除订单</a>
                  </a-popconfirm>
                </a-button>
              </div>
            </div>
          </div>
        </li>
        <li v-if="orders.length == 0" style="border: 0">
          <a-empty />
        </li>
      </ul>
    </div>
  </div>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { getMyOrders, getAOrder, deleteOrder } from '@/api/order'
import { getHotelDetail } from '@/api/hotel'

const orderStatusMap = {
  UNPAY: {
    status: 'warning',
    text: '待付款'
  },
  UNUSE: {
    status: 'processing',
    text: '待入住'
  },
  CANCEL: {
    status: 'default',
    text: '已取消'
  },
  SUCCESS: {
    status: 'success',
    text: '已完成'
  }
}

const roomTypesMap = {
  STANDARD: {
    text: '标准房'
  },
  SUPERIOR: {
    text: '高级房'
  },
  DELUXE: {
    text: '豪华房'
  },
  BUSINESS: {
    text: '商务房'
  },
}

export default {
 name: 'MyOrders',
 created: function() {
   this.loadingData()
 },
 filters: {
    statusFilter (type) {
      return orderStatusMap[type].text
    },
    statusTypeFilter (type) {
      return orderStatusMap[type].status
    },
    roomTypeFilter (type) {
      return roomTypesMap[type].text
    }
  },
 data () {
  return {
    zh_CN,
    status: 'ALL',
    orders: []
  };
 },
 methods: {
   loadingData: function() {
     let uid = 1
     getMyOrders(uid, this.status).then(res => {
       if (res.success == true) {
         this.orders = res.data
        //  console.log(this.orders[0])
       } else {
         this.$message.error(`加载订单失败: ${res.data}`)
       }
     }).catch(err => {
       this.$message.error(`加载订单异常: ${err.message}`)
     })
   },
   handleChangeStatus: function() {
     this.loadingData()
   },
   getDateCount: function(date) {
     return date.split(' ')[0].split('/')[2]
   },
   pay: function(order) {
     this.$router.push({
        name: 'Pay',
        params: {
          hotel: order.hotel,
          roomType: this.$options.filters['roomTypeFilter'](order.room.type),
          startTime: order.startTime,
          endTime: order.endTime,
          totalPrice: order.totalPrice,
          oid: order.oid
        }
      })
   },
   detail: function(order) {
     getAOrder(order.oid).then(res => {
       if (res.success == true) {
         this.$router.push({
           name: 'OrderDetail',
           params: {
             order: res.data,
             dateCount: this.getDateCount(res.data.endTime) - this.getDateCount(res.data.startTime)
           }
         })
       } else {
         this.$message.error(`获取订单失败: ${res.data}`)
       }
     }).catch(err => {
       this.$message.error(`获取订单异常: ${err.message}`)
     })
   },
   bookAgain: function(hid) {
     getHotelDetail(hid)
        .then(res => {
          if (res.success == true) {
            this.$router.push({
              name: 'HotelDetail',
              params: { 
                hotelDetail: res.data 
              }
            })
          } else {
            this.$message.error(`获取酒店失败: ${res.data}`)
          }
        })
        .catch(err => {
          this.$message.error(`获取酒店异常: ${err.message}`)
        })
   },
   deleteThis: function(oid) {
      deleteOrder(oid).then(res => {
        if (res.success == true) {
          this.$message.success("删除成功")
          this.$router.go(0)
        } else {
          this.$message.error(`删除订单失败: ${res.data}`)
        }
      }).catch(err => {
       this.$message.error(`删除订单异常: ${err.message}`)
     })
    }
 }
}

</script>
<style scoped>
.main {
  float: left;
  margin-left: 20px;
  width: 100%;
  padding: 20px 40px 40px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.title {
  border-bottom: none;
}

.title h4 {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  float: left;
}

.title .form-inline {
  float: right;
}

.order-list {
  margin: 60px 0 0 -40px;
}

.order-list li {
  border: 1px solid #c9c9c9;
  margin-top: 20px;
  list-style-type: none;
}

.order-list .title {
  padding: 0 30px;
  line-height: 40px;
  height: 40px;
  background-color: #ececec;
}

.order-list .title span {
  margin-right: 30px;
}

.order-list .content {
  padding: 15px 30px;
  padding-right: 0;
  height: 150px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.order-list .h-info {
  float: left;
}

.order-list .h-info .pic {
  float: left;
  width: 160px;
  height: 120px;
}

.order-list .h-info .pic img {
  width: 100%;
  min-height: 100%;
  max-height: 100%;
}

.order-list .h-info .section {
  width: 250px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  float: left;
  padding-left: 20px;
}

.order-list .h-info .section h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.order-list .h-info .section p {
  color: #999;
  font-size: 12px;
  margin: 0;
}

.order-list .price-box {
  float: left;
  width: 152px;
  text-align: center;
  font-size: 0;
  height: 100%;
  padding: 25px;
}

.order-list .price-box .section {
  display: inline-block;
  vertical-align: middle;
}

.order-list .price-box p {
  font-size: 14px;
  text-align: center;
  color: #666;
}

.order-list .price-box .price {
  color: #fa5d22;
}

.order-list .price-box .price span {
  font-size: 20px;
  color: #ff560a;
}

.order-list .order-state {
  float: left;
  height: 100%;
  width: 145px;
  text-align: center;
  font-size: 0;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-left: 1px solid #c9c9c9;
  border-right: 1px solid #c9c9c9;
  padding: 43px;
}

.order-list .order-state p {
  font-size: 14px;
  display: inline-block;
  vertical-align: middle;
  color: #5babfc;
}

.order-list .btn-box {
  float: left;
  width: 210px;
  text-align: center;
  height: 100%;
  padding: 25px;
}

.order-list .btn-box .section {
  display: inline-block;
  vertical-align: middle;
}

.order-list .btn-box .btn {
  display: block;
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
}

</style>