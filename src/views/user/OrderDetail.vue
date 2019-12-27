<template>
<a-locale-provider :locale="zh_CN">
  <a-layout id="components-layout-demo-fixed">
    <!-- 头部 -->
    <v-header />
    <a-spin :spinning="spinning">
    <a-layout-content :style="{ padding: '0 50px', marginTop: '90px' }">
      <div class="center-container">
        <div class="title">
          <span style="cursor: pointer" @click="() => {this.$router.go(-1)}"><a-icon type="arrow-left" /> 返回订单列表</span>
        </div>
        <div class="title">
          <h4>订单信息</h4>
        </div>
        <div class="order-info">
          <div class="section td-fir">
            <p>订单状态：<b :class="order.status | statusTypeFilter">{{ order.status | statusFilter }}</b></p>
            <p>订单编号：<b>{{ order.oid }}</b></p>
            <p>预订日期：<b>{{ order.createTime }}</b></p>
          </div>
          <div class="section td-sec">
            <p>订单金额：￥{{ order.totalPrice }}</p>
            <p>支付金额：￥{{ order.totalPrice }}</p>
          </div>
          <div class="section td-thi">
            <a-button @click="pay(order)" v-if="order.status == 'UNPAY'" type="primary" class="btn" style="width: 88px">去付款</a-button>
            <a-button v-else-if="order.status == 'UNUSE'" type="danger">
              <a-popconfirm title="是否要取消此订单？" @confirm="deleteThis(order.oid)">
                <a>取消订单</a>
              </a-popconfirm>
            </a-button>
            <a-button v-else type="danger">
              <a-popconfirm title="是否要删除此订单？" @confirm="deleteThis(order.oid)">
                <a>删除订单</a>
              </a-popconfirm>
            </a-button>
          </div>
        </div>
        <div class="info-item">
          <h4>{{ order.hotel.hname }}</h4>
          <p>
            房型：{{ order.room.type | roomTypeFilter }}，
            {{ order.count }}间，共{{ dateCount }}晚 ，
            {{ order.room.breakfast }}，
            {{ order.room.cancel }}
          </p>
          <p>酒店地址：{{ order.hotel.address }}</p>
          <p>联系电话：{{ order.hotel.phone}}</p>
        </div>
        <div class="info-item">
          <h4>入住信息</h4>
          <ul>
            <li>
              <p><span>入住人：</span>{{ order.checkInPerson }}</p>
            </li>
            <li>
              <p><span>入住日期：</span>{{ order.startTime }}</p>
            </li>
            <li>
              <p><span>手机：</span>{{ order.telephone }}</p>
            </li>
            <li>
              <p><span>离店日期：</span>{{ order.endTime }}</p>
            </li>
          </ul>
          <div class="gift-box">
            <div class="gift-notice">
              <a-icon type="gift" theme="twoTone" />
              <span>此价格含礼包，礼包信息</span>
            </div>
            <p> 享礼包3选1（限入住期间送1次） 项目一：免费体验酒店用餐服务一次 项目二：免费体验酒店洗衣服务一次 项目三：免费体验酒店美发服务一次</p>
          </div>
        </div>
        <div class="info-item">
          <h4>支付信息</h4>
          <ul>
            <li>
              <p><span>支付方式：</span>线上预付</p>
            </li>
            <li>
              <p><span>支付金额：</span>￥{{ order.totalPrice }}</p>
            </li>
            <li>
              <p>
                <span>支付状态：</span>
                <span v-if="order.status == 'UNPAY' || order.status == 'CANCEL'">未付款</span>
                <span v-else>已付款</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </a-layout-content>
    </a-spin>
    <!-- 尾部 -->
    <v-footer />
  </a-layout>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import Header from './Header'
import Footer from './Footer'
import { deleteOrder } from '@/api/order'

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
  },
  REVIEWED: {
    status: 'reviewed',
    text: '已评价'
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
  name: 'OrderDetail',
  components: {
    'v-header': Header,
    'v-footer': Footer
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
  created: function() {
    this.order = this.$route.params.order
    this.dateCount = this.$route.params.dateCount
  },
  data () {
    return {
      zh_CN,
      spinning: false,
      order: undefined,
      dateCount: undefined
    };
  },
  methods: {
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
    deleteThis: function(oid) {
      this.spinning = true
      deleteOrder(oid).then(res => {
        if (res.success == true) {
          this.$message.success("删除成功")
          this.$router.go(-1)
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
.center-container {
  position: relative;
  width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #c9c9c9;
}

.center-container .title {
  padding: 20px 50px;
  color: #333;
  font-size: 14px;
}

.center-container .title h4 {
  color: #5babfc;
  font-weight: 700;
  font-size: 18px;
}

.center-container .order-info {
  background-color: #fffde7;
  padding: 30px 0;
  border-bottom: 1px solid #c9c9c9;
  font-size: 12px;
  color: #666;
}

.center-container .section {
  display: inline-block;
  vertical-align: middle;
}

.center-container .td-fir {
  width: 265px;
  padding-left: 50px;
}

.center-container .order-info p {
  margin: 0;
}

.center-container .td-fir .default {
  color: #d9d9d9;
}

.center-container .td-fir .success {
  color: #52c41a;
}

.center-container .td-fir .processing {
  color: #1890ff;
}

.center-container .td-fir .warning {
  color: #faad14;
}

.center-container .td-sec {
  width: 365px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding-left: 130px;
  border-left: 1px solid #c9c9c9;
  border-right: 1px solid #c9c9c9;
}

.center-container .td-thi {
  padding-left: 115px;
}

.center-container .info-item {
  padding: 30px 50px;
  background-color: #fff;
  border-bottom: 10px solid #f7f7f7;
  color: #333;
  font-size: 14px;
}

.center-container .info-item h4 {
  margin-bottom: 20px;
  color: #5babfc;
  font-weight: 700;
  font-size: 18px;
}

.center-container .info-item ul {
  height: 68px;
  margin-left: -39px;
}

.center-container .info-item li {
  float: left;
  min-width: 390px;
  height: 24px;
  margin-bottom: 10px;
  list-style-type: none;
}

.center-container .info-item li span {
  display: inline-block;
  width: 85px;
  margin-right: 5px;
}

.center-container .info-item .gift-box {
  position: relative;
  width: 100%;
  background: #e9f4ff;
  margin: 60px 0 0 0;
  padding: 15px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.center-container .info-item .gift-box .gift-notice {
  position: absolute;
  top: -25px;
  left: 0;
  width: 100%;
}

.center-container .info-item .gift-box .gift-notice span {
  display: inline-block;
  vertical-align: top;
  height: 19px;
  line-height: 19px;
}

.center-container .info-item .gift-box p {
  line-height: 2;
  margin: 0;
}

</style>