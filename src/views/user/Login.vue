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
            <a class="login-form-forgot" href="#">
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
  <!-- 尾部 -->
  <v-footer />
</div>
</template>

<script>
import Header from '@/views/user/Header'
import Footer from '@/views/user/Footer'
import {getPublicKey, login } from '@/api/login'
import {rsaEncrypt, setLoginUid, login_uid } from '@/utils/encrypt'
import {errorTipsMap } from '@/utils/errorTips'

export default {
 name: 'Login',
 components: {
    'v-header': Header,
    'v-footer': Footer
  },
  data () {
    return {
      img: require('@/assets/background.svg')
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
          this.getKey(values.userName, values.password)
        }
      });
    },
    getKey (email, password) {
      return getPublicKey(email).then(res => {
        if (res.success === true) {
          password=rsaEncrypt(password, res.data)
          this.submitInfo({email:email,upassword:password})
          return
        }
        this.$notification.error({message: `登录失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
          this.$notification.error({message: '请求出现错误，请稍后再试'})
          console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    submitInfo (loginInfo) {
      return login(loginInfo).then(res => {
        if (res.success === true) {
          setLoginUid(res.data)
          this.$router.push({path:'/userCenter'})
          this.$notification.success({message: '登录成功'})
          return
        }
        this.$notification.error({message: `登录失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
          this.$notification.error({message: '请求出现错误，请稍后再试'})
          console.log('请求出现错误，请稍后再试',ex.message)
      })
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