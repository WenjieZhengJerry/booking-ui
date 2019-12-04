<template>
<a-locale-provider :locale="zh_CN">
  <div class="main">
    <div class="title">
      <h4>酒店订单</h4>
      <div class="form-inline">
        <a-select defaultValue="SIX-MONTH" style="width: 150px">
          <a-select-option value="WAIT-CHECK-IN">待入住</a-select-option>
          <a-select-option value="WAIT-PAY">待付款</a-select-option>
          <a-select-option value="COMPLETE">已完成</a-select-option>
          <a-select-option value="SIX-MONTH">近6个月订单</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="order-list">
      <ul>
        <li>
          <div class="title">
            <span>
              订单号：
              <router-link to="/orderDetail">102719800235</router-link>
            </span>
            <span>预订日期：2019-11-13</span>
          </div>
          <div class="content">
            <div class="h-info">
              <div class="pic">
                <router-link to="/orderDetail">
                  <img src="@/assets/order-img-demo.jpg" alt="">
                </router-link>
              </div>
              <div class="section">
                <router-link to=""><h4>锦江国际饭店</h4></router-link>
                <p>标准单人房</p>
                <p>入住日期：2019-11-21</p>
                <p>离店日期：2019-11-22</p>
                <p>共1晚</p>
              </div>
            </div>
            <div class="price-box">
              <div class="section">
                <p>总价</p>
                <p class="price">
                  <span>￥<b>598.00</b></span>
                </p>
              </div>
            </div>
            <div class="order-state">
              <p>已取消</p>
            </div>
            <div class="btn-box">
              <div class="section">
                <a-button type="primary" class="btn">再次预定</a-button>
                <a-button type="danger" class="btn">删除订单</a-button>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="title">
            <span>
              订单号：
              <router-link to="/orderDetail">102719800235</router-link>
            </span>
            <span>预订日期：2019-11-13</span>
          </div>
          <div class="content">
            <div class="h-info">
              <div class="pic">
                <router-link to="/orderDetail">
                  <img src="@/assets/order-img-demo.jpg" alt="">
                </router-link>
              </div>
              <div class="section">
                <router-link to=""><h4>锦江国际饭店</h4></router-link>
                <p>标准单人房</p>
                <p>入住日期：2019-11-21</p>
                <p>离店日期：2019-11-22</p>
                <p>共1晚</p>
              </div>
            </div>
            <div class="price-box">
              <div class="section">
                <p>总价</p>
                <p class="price">
                  <span>￥<b>598.00</b></span>
                </p>
              </div>
            </div>
            <div class="order-state">
              <p>待入住</p>
            </div>
            <div class="btn-box">
              <div class="section">
                <a-button type="primary" class="btn">查看详情</a-button>
                <a-button type="danger" class="btn">删除订单</a-button>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="title">
            <span>
              订单号：
              <router-link to="/orderDetail">102719800235</router-link>
            </span>
            <span>预订日期：2019-11-13</span>
          </div>
          <div class="content">
            <div class="h-info">
              <div class="pic">
                <router-link to="/orderDetail">
                  <img src="@/assets/order-img-demo.jpg" alt="">
                </router-link>
              </div>
              <div class="section">
                <router-link to=""><h4>锦江国际饭店</h4></router-link>
                <p>标准单人房</p>
                <p>入住日期：2019-11-21</p>
                <p>离店日期：2019-11-22</p>
                <p>共1晚</p>
              </div>
            </div>
            <div class="price-box">
              <div class="section">
                <p>总价</p>
                <p class="price">
                  <span>￥<b>598.00</b></span>
                </p>
              </div>
            </div>
            <div class="order-state">
              <p>已取消</p>
            </div>
            <div class="btn-box">
              <div class="section">
                <a-button type="primary" class="btn">再次预定</a-button>
                <a-button type="danger" class="btn">删除订单</a-button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';

export default {
 name: 'MyOrders',
 data () {
  return {
    zh_CN
  };
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
  width: 130px;
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