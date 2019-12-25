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
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-dropdown style="float: right;">
          <a class="ant-dropdown-link" href="#" style="margin-right: 16px;">
             <a-avatar :src="avatarImg" /> {{ uName }} <a-icon type="down" /> 
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="1"><router-link to="/login"><a-icon type="swap" />切换账号</router-link></a-menu-item>
            <a-menu-item key="2"><router-link to="/"><a-icon type="logout" />退出</router-link></a-menu-item>
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

export default {
 name: 'Home',
 data () {
    return {
      uName: '小泽又沐风',
      avatarImg: require('@/assets/user-img-demo.jpg'),
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
     }
   }
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