<template>
  <a-layout id="components-layout-demo-fixed">
    <!-- 头部 -->
    <v-header />
    <a-layout-content :style="{ padding: '0 50px', marginTop: '90px' }">
      <div class="center-container">
        <div class="title">
          <h4>订单信息</h4>
        </div>
        <div class="order-info">
          <div class="section td-fir">
            <p>订单状态：<b class="green">已取消</b></p>
            <p>订单编号：<b>102719800235</b></p>
            <p>预订日期：<b>2019-11-13 10:15:40</b></p>
          </div>
          <div class="section td-sec">
            <p>订单金额：￥598.00</p>
            <p>支付金额：￥598.00</p>
          </div>
          <div class="section td-thi">
            <a-button type="danger">删除订单</a-button>
          </div>
        </div>
        <div class="info-item">
          <h4>锦江国际饭店</h4>
          <p>房型：标准单人房，1间，共1晚 ，不含早</p>
          <p>酒店地址：上海市黄浦区南京西路170号</p>
          <p>联系电话：86-00-00000000</p>
        </div>
        <div class="info-item">
          <h4>入住信息</h4>
          <ul>
            <li>
              <p><span>入住人：</span>小泽又沐风</p>
            </li>
            <li>
              <p><span>入住日期：</span>2019-11-21</p>
            </li>
            <li>
              <p><span>手机：</span>86-12345678910</p>
            </li>
            <li>
              <p><span>离店日期：</span>2019-11-22</p>
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
              <p><span>支付金额：</span>￥598.00</p>
            </li>
            <li>
              <p><span>支付状态：</span>未付款</p>
            </li>
          </ul>
        </div>
      </div>
    </a-layout-content>
    <!-- 尾部 -->
    <v-footer />
  </a-layout>
</template>

<script>
import Header from './Header'
import Footer from './Footer'

export default {
 name: 'OrderDetail',
 components: {
    'v-header': Header,
    'v-footer': Footer
  },
 data () {
  return {
  };
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

.center-container .td-fir .green {
  color: #66c61f;
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