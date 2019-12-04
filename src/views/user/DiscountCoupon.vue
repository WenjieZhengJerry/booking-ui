<template>
 <div class='main'>
  <div class="title">
    <h4>我的优惠券</h4>
  </div>
  <a-tabs defaultActiveKey="1" style="margin-top: 35px;">
    <a-tab-pane tab="未使用(0)" key="1">
      <a-empty />
    </a-tab-pane>
    <a-tab-pane tab="已使用(0)" key="2">
      <a-empty />
    </a-tab-pane>
    <a-tab-pane tab="已过期(0)" key="3">
      <a-empty />
    </a-tab-pane>
  </a-tabs>
 </div>
</template>

<script>
export default {
 name: 'DiscountCoupon',
 data () {
  return {
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

.title h4 {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  float: left;
}
</style>