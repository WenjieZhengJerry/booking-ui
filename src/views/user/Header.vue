<template>
 <!-- 头部 -->
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <div class="logo">客房预订</div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :defaultSelectedKeys="['1']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1" @click="goToIndex">酒店预订</a-menu-item>
        <a-button v-if="!is_login" class="header-btn"><router-link to="/register">注册</router-link></a-button>
        <a-button v-if="!is_login"  type="primary" class="header-btn"><router-link to="/login">登录</router-link></a-button>
        <a-dropdown v-if="is_login" class="header-dropdown">
          <a class="ant-dropdown-link" href="#"> 
            <a-row>
              <a-col :span="8"><a-avatar shape="square" :size="32" icon="user" :src="'/api'+userInfo.icon"/></a-col>
              <a-col :span="16">{{userInfo.uname}} <a-icon type="down" /> </a-col>
            </a-row>
          </a>
          <a-menu slot="overlay" >
            <a-menu-item key="userCenter">
              <router-link to="/userCenter">个人中心</router-link>
            </a-menu-item>
            <a-menu-item key="exit" @click="exit">
              <a href="javascript:;">退出登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-menu>
    </a-layout-header>
</template>

<script>
import { errorTipsMap } from '@/utils/errorTips'
import { isLogin, logout } from '@/api/login'
import { user_info, setUserInfo } from '@/utils/encrypt'
export default {
 name: 'Header',
 data () {
    return {
      is_login:false,
      userInfo:null
    }
 },
  methods: {
    goToIndex: function() {
      this.$router.push('/')
    },
    exit(item){
      logout().then(res => {
        if (res.success === true) {
          this.is_login=false
          setUserInfo(null)
          this.$router.push('/login')
          return
        }
        console.log('logout error',errorTipsMap[res.data])
      }).catch(ex => {
        console.log('logout error',ex.message)
      })
    }
  },
  created (){
    if(null===user_info){
      isLogin().then(res => {
        if (res.success === true) {
          setUserInfo(res.data)
          this.is_login=true
          this.userInfo=res.data
          return
        }
        console.log('isLogin error',errorTipsMap[res.data])
        this.is_login=false
      }).catch(ex => {
        console.log('isLogin error',ex.message)
      })
    }
    else{
      this.is_login=true
      this.userInfo=user_info
    }
  }
}

</script>
<style scoped>
.logo {
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    float: left;
    text-align: center;
    line-height: 31px;
    color: wheat;
    font-size: 25px;
  }

  .header-dropdown {
    float: right;
  }

  .header-btn {
    float: right;
    margin: 15px 10px;
  }
</style>