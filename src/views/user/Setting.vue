<template>
 <div class='main'>
   <div class="tit" >
     <h4>修改密码</h4>
   </div>
   <div class="password-div">
     <div class="passwd-box">
      <label>当前密码：</label>
      <a-input-password placeholder="请输入当前密码" style="width: 75%" max-length="16"/>
     </div>
     <div class="passwd-box">
      <label>设置密码：</label>
      <a-input-password placeholder="请输入新密码" style="width: 75%" max-length="16"/>
     </div>
     <div class="passwd-box">
      <label>重复密码：</label>
      <a-input-password placeholder="请重复新密码" style="width: 75%" max-length="16"/>
     </div>
     <div class="passwd-box">
       <a-button type="primary" style="float: right;">修改</a-button>
     </div>
   </div>
 </div>
</template>

<script>
export default {
 name: 'Setting',
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

.tit {
  padding-bottom: 45px;
  border-bottom: 1px solid #c9c9c9;
}

.tit h4 {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  float: left;
}

.password-div {
  border: 1px solid #c9c9c9;
  margin-top: 30px;
  padding: 40px;
}

.passwd-box {
  margin-bottom: 10px;
  width: 35%;
}
</style>