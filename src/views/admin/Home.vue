<!--管理界面-->
<template>
 <a-layout id="components-layout-demo-custom-trigger" >
    <a-layout-sider>
      <div class="logo" >客房预订后台管理</div>
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']" @select="handleSelect">
        <a-menu-item key="1">
          <a-icon type="appstore" />
          <span>订单管理</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="team" />
          <span>用户管理</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="home" />
          <span>酒店管理</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="message" />
          <span>评论管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-dropdown style="float: right;">
          <a class="ant-dropdown-link" href="#" style="margin-right: 16px;">
            <a-row>
              <a-col :span="7"><a-avatar shape="square" :size="32" icon="user" :src="avatarImg"/></a-col>
              <a-col :span="17">{{userInfo.uname}} <a-icon type="down" /> </a-col>
            </a-row>
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="1"><router-link to="/login"><a-icon type="swap" />切换账号</router-link></a-menu-item>
            <a-menu-item key="2" @click="exit"><a href="javascript:;"><a-icon type="logout" /> 退出</a></a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '732px' }"
      >
      <keep-alive  include="HotelManage">
        <router-view/>
	</keep-alive>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { isLogin, logout } from '@/api/login'
import { user_info, setUserInfo } from '@/utils/encrypt'
import { errorTipsMap } from '@/utils/errorTips'
export default {
 name: 'Home',
 data () {
    return {
      uName: '小泽又沐风',
      avatarImg: '/api/upload/user/avatar/default_avatar.jpeg',
      userInfo:{}
   };
 },
 methods: {
   handleSelect: function(e) {
     switch(e.key) {
      case '1':
        this.$router.push('/admin/orderManage')
        break;
      case '2':
        this.$router.push('/admin/userManage')
        break;
      case '3':
        this.$router.push('/admin/hotelManage')
        break;
      case '4':
        this.$router.push('/admin/commentManage')
        break;
     }
   },
   exit(){
    logout().then(res => {
      if (res.success === true) {
        setUserInfo(null)
        this.$router.push('/login')
        return
        return
      }
      console.log('logout error',errorTipsMap[res.data])
    }).catch(ex => {
      console.log('logout error',ex.message)
    })
   }
 },
  created (){
    if(null!==user_info){
      this.userInfo=user_info
      return
    }
    isLogin().then(res => {
      if (res.success === true) {
        this.userInfo=res.data
        setUserInfo(res.data)
        return
      }
      console.log('isLogin error',errorTipsMap[res.data])
      this.$router.push('/login')
    }).catch(ex => {
      console.log('isLogin error',ex.message)
    })
  }
}

</script>

<style scoped>
  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    width: 195px;
    height: 31px;
    margin: 16px 24px 16px 0;
    float: left;
    text-align: center;
    line-height: 31px;
    color: wheat;
    font-size: 22px;
  }

</style>