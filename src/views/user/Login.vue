<template>
<div>
 <!-- 头部 -->
  <v-header />
  <div class="login" :style="{backgroundImage: 'url(' + img + ')'}">
    <div class="login-div">
      <div class="title">
        <h1>登录</h1>
      </div>
      <div class="login-box">
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
        >
          <a-form-item>
            <a-input
              v-decorator="[
                'userName',
                { rules: [{ required: true, message: '请输入邮箱' }] },
              ]"
              placeholder="邮箱"
            >
              <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '请输入密码' }] },
              ]"
              type="password"
              placeholder="密码"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-checkbox
              v-decorator="[
                'remember',
                {
                  valuePropName: 'checked',
                },
              ]"
            >
              记住我
            </a-checkbox>
            <a class="login-form-forgot" @click="handleForgot" href="#">
              忘记密码
            </a>
            <a-button type="primary" html-type="submit" class="login-form-button">
              确定
            </a-button>
            <div style="float: right;">
              没有账号？
              <router-link to="/register">
                点我立即注册
              </router-link>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
  <forgot-password ref="forgotModel"/>
  <!-- 尾部 -->
  <v-footer />
</div>
</template>

<script>
import Header from '@/views/user/Header'
import Footer from '@/views/user/Footer'
import ForgotPassword from '@/views/user/ForgotPassword'
import {getPublicKey, login } from '@/api/login'
import {rsaEncrypt, loginUser } from '@/utils/encrypt'
import {errorTipsMap } from '@/utils/errorTips'

export default {
 name: 'Login',
 components: {
    'v-header': Header,
    'v-footer': Footer,
    ForgotPassword
  },
  data () {
    return {
      img: require('@/assets/background.svg'),
      userInfo:{
        email:'',
        upassword:''
      }
    };
  },
 beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'login' });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.userInfo.email=values.userName
          this.userInfo.upassword=values.password
          loginUser(this.userInfo,(status,tips)=>{
            if(0===status){
              this.$notification.success({message: tips})
              this.$router.push({path:'/userCenter'})
            }
            else{
              this.$notification.error({message: tips})
              console.log(tips)
            }
          })
        }
      });
    },
    handleForgot(){
      this.$refs.forgotModel.show(this.form.getFieldValue('userName'))
    }
  }
}

</script>
<style scoped>
.login {
  height: 690px;
}

.login-div {
  width: 50%;
  margin: auto;
}

.login-div .title {
  padding: 200px 0 0 46%;
}

.login-div .title h1 {
  color: #1890ff;
}

.login-div .login-box {
  width: 50%;
  margin-left: 25%;
}

#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
  height: 40px;
}
</style>