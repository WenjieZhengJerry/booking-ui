<template>
<div>
 <!-- 头部 -->
  <v-header />
  <div class="register" :style="{backgroundImage: 'url(' + img + ')'}">
    <div class="register-div">
      <div class="title">
        <h1>注册</h1>
      </div>
      <div class="register-box">
        <a-form ref="formRegister" :form="form" id="formRegister">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="邮箱"
              v-decorator="['email', {rules: [{ required: true, type: 'email', message: '请输入邮箱地址' }], validateTrigger: ['change', 'blur']}]"
            ></a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              type="password"
              autocomplete="false"
              placeholder="至少6位密码，区分大小写"
              v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
            ></a-input-password>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              type="password"
              autocomplete="false"
              placeholder="确认密码"
              v-decorator="['password2', {rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
            ></a-input-password>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="14">
              <a-form-item>
                <a-input size="large" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }, { validator: this.handleCaptchaCheck }], validateTrigger: ['change', 'blur']}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="10">
              <a-button
              type="primary" 
              class="getCaptcha"
              size="large"
              :disabled="state.smsSendBtn"
              @click.stop.prevent="getCaptcha"
              v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"></a-button>
            </a-col>
          </a-row>

          <a-form-item>
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="register-button"
              :loading="registerBtn"
              @click.stop.prevent="handleSubmit"
              :disabled="registerBtn">注册
            </a-button>
            <router-link class="toLogin" to="/login">使用已有账户登录</router-link>
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
import { mixinDevice } from '@/utils/mixin.js'
import { getPublicKey, sendCaptcha, register } from '@/api/login'
import { rsaEncrypt, registerUser } from '@/utils/encrypt'
import { errorTipsMap } from '@/utils/errorTips'

const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}

export default {
 name: 'Register',
 components: {
    'v-header': Header,
    'v-footer': Footer
  },
  mixins: [mixinDevice], 
 data () {
  return {
    img: require('@/assets/background.svg'),
    form: this.$form.createForm(this),
    state: {
      time: 60,
      smsSendBtn: false,
      passwordLevel: 0,
      passwordLevelChecked: false,
      percent: 10,
      progressColor: '#FF0000'
    },
    registerBtn: false,
    captchaInfo:{
      code: '',
      token: ''
    },
    userInfo:{
      email:'',
      upassword:''
    },
    hide: 0,
  };
 },
  methods: {
    handlePasswordLevel (rule, value, callback) {
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },

    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },

    handleCaptchaCheck (rule, value, callback) {
      if (undefined===value) {
        callback(new Error('请输入验证码'))
      }
      if(4!=value.length){
        callback(new Error('请输入4位验证码'))
      }
      if(value!==this.captchaInfo.code){
        callback(new Error('验证码不正确'))
      }
      callback()
    },

    handleSubmit () {
      const { form: { validateFields }, state, $router } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.captchaInfo.code=values.captcha
          this.userInfo.email=values.email
          this.userInfo.upassword=values.password
          registerUser(this.userInfo,this.captchaInfo,(status,tips)=>{
            if(0===status){
              this.$notification.success({message: tips})
              this.$router.push({path:'/login'})
            }
            else{
              this.$notification.error({message: tips})
              console.log(tips)
            }
          })
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state, $message, $notification } = this
      
      validateFields(['email'], { force: true },
        (err, values) => {
          if (!err) {
            state.smsSendBtn = true

            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)

            this.hide = $message.loading('验证码发送中..', 0)
            this.send(values.email)
          }
        }
      )
    },
    send (email) {
      return sendCaptcha(email).then(res => {
        setTimeout(this.hide)
        if (res.success === true) {
          this.captchaInfo.token=res.data.token
          this.captchaInfo.code=res.data.code
          //alert(res.data.code)
          this.$notification.success({message: `验证码已发送到邮箱: ${email}`})
          return
        }
        this.$notification.error({message: `验证码发送失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
        setTimeout(this.hide)
        console.log('请求出现错误，请稍后再试',ex.message)
        this.requestFailed(ex)
      })
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.registerBtn = true
    }
  }
}

</script>
<style scoped>
.register {
  height: 690px;
}

.register-div {
  width: 50%;
  margin: auto;
}

.register-div .title {
  padding: 180px 0 0 46%;
}

.register-div .title h1 {
  color: #1890ff;
}

.register-div .register-box {
  width: 50%;
  margin-left: 25%;
}

.getCaptcha {
  display: block;
  width: 100%;
  height: 40px;
}

.register-button {
  width: 50%;
}

.toLogin {
  float: right;
  line-height: 40px;
}
</style>