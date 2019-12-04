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
        <a-button class="header-btn"><router-link to="/register">注册</router-link></a-button>
        <a-button type="primary" class="header-btn"><router-link to="/login">登录</router-link></a-button>
        <a-dropdown class="header-dropdown">
          <a class="ant-dropdown-link" href="#"> 用户名 <a-icon type="down" /> </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <router-link to="/userCenter">个人中心</router-link>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">退出登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-menu>
    </a-layout-header>
</template>

<script>
export default {
 name: 'Header',
 data () {
    return {

    };
 },
 methods: {
   goToIndex: function() {
     this.$router.push('/')
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