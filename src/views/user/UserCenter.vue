<template>
<a-locale-provider :locale="zh_CN">
  <a-layout id="components-layout-demo-fixed">
    <!-- 头部 -->
    <v-header/>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '90px' }">
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            style="width: 256px"
            mode="inline"
            :defaultSelectedKeys="[selectedKey]"
            :defaultOpenKeys="['sub1', 'sub2']"
            @select="handleSelect"
          >
            <a-sub-menu key="sub1">
              <span slot="title"><a-icon type="bars" /><span>我的订单</span></span>
              <a-menu-item key="1">酒店订单</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
              <span slot="title"><a-icon type="user" /><span>我的账户</span></span>
              <a-menu-item key="2">个人信息</a-menu-item>
              <a-menu-item key="3">积分管理</a-menu-item>
              <a-menu-item key="4">优惠券</a-menu-item>
              <a-menu-item key="5">账户安全</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 94px', minHeight: '550px', overflowX: 'unset' }">
          <router-view/>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <!-- 尾部 -->
    <v-footer />
    <!-- 回到顶部按钮 -->
    <a-back-top />
  </a-layout>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import Header from './Header'
import Footer from './Footer'
import { errorTipsMap } from '@/utils/errorTips'
import { isLogin, logout } from '@/api/login'
export default {
 name: 'UserCenter',
 components: {
    'v-header': Header,
    'v-footer': Footer
  },
 data () {
  return {
    zh_CN,
    selectedKey: '2',
    userInfo:{}
  };
 },
 methods: {
   handleSelect: function(e) {
     switch(e.key) {
      case '1':
        this.$router.push('/userCenter/myOrders')
        break;
      case '2':
        this.$router.push('/userCenter/userInfomation')
        break;
      case '3':
        this.$router.push('/userCenter/pointManage')
        break;
      case '4':
        this.$router.push('/userCenter/discountCoupon')
        break;
      case '5':
        this.$router.push('/userCenter/setting')
        break;
     }
   }
 },
  created () {
    isLogin().then(res => {
      if (res.success === true) {
        if(null!==res.data){
          this.userInfo=res.data
          return
        }
      }
      console.log('isLogin error',errorTipsMap[res.data])
    }).catch(ex => {
      console.log('isLogin error',ex.message)
    })
  }
}

</script>
<style scoped>

</style>