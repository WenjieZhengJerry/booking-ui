<template>
  <div class='main'>
    <div class="tit" >
      <h4>修改密码</h4>
    </div>
    <a-form :form="form" style="margin-top:50px;">
      <a-form-item
      label="旧密码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      >
        <a-input-password
        placeholder="旧密码/临时密码" 
        type="password"
        v-decorator="[
          'password',
          {rules: [{ required: true, message: '请输入旧密码!' }]}]"
        />
      </a-form-item>
      <a-form-item
      label="新密码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      :validate-status="validateSta.newPassword"
      :help="helpText.newPassword"
      >
        <a-input-password
        type="password"
        v-decorator="[
          'newPassword',
          {rules: [{ required: true, message: '请输入新密码!' },{ validator: this.handleValidNewPassword }], validateTrigger: ['change', 'blur']}
        ]"
        />
      </a-form-item>
     <a-form-item
      label="确认密码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      :validate-status="validateSta.confirm"
      >
        <a-input-password
        type="password"
        v-decorator="[
          'confirm',
          {rules: [{ required: true, message: '请输入确认密码!' },{ validator: this.handleValidConfirm }], validateTrigger: ['change', 'blur']}
        ]"
        />
      </a-form-item>
      <a-form-item
      label="验证码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 10 }"
      >
        <a-row>
          <a-col class="gutter-row" :span="16">
            <a-form-item
              :wrapper-col="{ span: 20 }"
              has-feedback
              >
              <a-input
              type="text" 
              placeholder="验证码" 
              v-decorator="['captcha', {rules: [{ required: true, message: ' ' },{ validator: this.handleValidCaptcha }], validateTrigger: ['change', 'blur']}]"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-button 
            type="primary" 
            :disabled="getCaptchaStatus.isDisable" 
            @click="getCaptcha">{{!getCaptchaStatus.isDisable && '获取验证码'||(getCaptchaStatus.time+' s')}}</a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item>
        <a-row type="flex" justify="space-around" align="middle">
          <a-button type="primary" @click="handleSubmit" style="margin:auto;float:left">重置密码</a-button>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

 <script>
import { getPublicKey, sendCaptcha, updatePassword, isLogin, logout } from '@/api/login'
import { errorTipsMap } from '@/utils/errorTips'
import { rsaEncrypt, user_info, setUserInfo } from '@/utils/encrypt'
export default {
  name:'UserAdd',
  data() {
    return {
      form: this.$form.createForm(this),
      validateSta:{
        newPasswoed:'',
        confirm:''
      },
      disableGetCaptcha: false,
      captchaInfo:{   //验证码信息
        token:'',
        code:''
      },
      passwordInfo:{
        password:'',
        newPassword:''
      },
      getCaptchaStatus:{
        time:60,
        isDisable:false,
        hideMessage:0
      },
      helpText:{
        newPassword:null
      },
      userInfo:user_info
    }
  },
  methods:{
    init(){ //  重置表单
      this.captchaInfo.token=''
      this.captchaInfo.code=''
      this.disableGetCaptcha=false
      this.validateSta.newPassword=null
      this.validateSta.confirm=null
      this.helpText.newPassword=null
      this.form.resetFields()
    },
    handleSubmit() { //  提交表单
      const { form: { validateFields } } = this;
      this.form.validateFields({ force: true }, (errors, values) => {
        if (errors) {
          console.log('Setting.form.validateFields',errors)
          return
        }
        this.passwordInfo.password=values.password
        this.passwordInfo.newPassword=values.newPassword
        this.captchaInfo.code=values.captcha
        this.getKey()
      });
    },
    handleValidNewPassword (rule, value, callback) {  //  验证密码
      //长度要在6~18之间
      if(/\S{6,18}$/.test(value)){
        //只能以字母开头的数字大小写字母
        if (/^[a-zA-Z][a-zA-Z0-9]/.test(value)) {
          // 特殊字符
          if (/[^\w\s]+/.test(value)) {
            this.validateSta.newPassword='success'
            this.helpText.newPassword='密码强度: 强'
          }
          else{
            this.validateSta.newPassword='warning'
            this.helpText.newPassword='密码强度: 弱'
          }
          callback()
        }
        else{
          this.validateSta.newPassword='error'
          this.helpText.newPassword='请输入字母开头的密码'
          callback('请输入字母开头的密码')
        }
      }
      else{
        this.validateSta.newPassword='error'
        this.helpText.newPassword='密码长度要在6~18之间'
        callback('密码长度要在6~18之间')
      }
    }, 
    handleValidConfirm (rule, value, callback) {  //  验证确认密码
      if (value && value !== this.form.getFieldValue('newPassword')) {
        this.validateSta.confirm='error'
        callback('输入密码不一致!');
      } else {
        this.validateSta.confirm='success'
        callback();
      }
    },
    handleValidCaptcha(rule, value, callback){  //  验证验证码
      if (undefined===value) {
        callback('请输入验证码')
      }
      if(4!=value.length){
        callback('请输入4位验证码')
      }
      if(value!==this.captchaInfo.code){
        callback('验证码不正确')
      }
      callback()
    },
    getCaptcha(){ // 获取验证码
      this.getCaptchaStatus.isDisable = true
      const interval = window.setInterval(() => {
        if (this.getCaptchaStatus.time-- <= 0) {
          this.getCaptchaStatus.time = 60
          this.getCaptchaStatus.isDisable = false
          window.clearInterval(interval)
        }
      }, 1000)

      this.getCaptchaStatus.hideMessage = this.$message.loading('验证码发送中..', 0)

      sendCaptcha(this.userInfo.email).then(res => { // 获取验证码
        setTimeout(this.getCaptchaStatus.hideMessage)
        if (res.success === true) {
          this.captchaInfo=res.data
          this.$notification.success({message: `验证码已发送到邮箱: ${this.userInfo.email}`})
          //alert(res.data.code)
          return
        }
        this.$notification.error({message: `验证码发送失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
        setTimeout(this.getCaptchaStatus.hideMessage)
        this.$notification.error({message: '请求出现错误，请稍后再试'})
        console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    getKey(){
      getPublicKey(this.userInfo.email).then(res => {
        if (res.success === true) {
          this.passwordInfo.password=rsaEncrypt(this.passwordInfo.password, res.data)
          this.passwordInfo.newPassword=rsaEncrypt(this.passwordInfo.newPassword, res.data)
          this.submit(this.passwordInfo,this.captchaInfo)
          return
        }
        cb(1,`登录失败: ${errorTipsMap[res.data]}`)
      }).catch(ex => {
        cb(2,'请求出现错误，请稍后再试')
        console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    submit(passwordInfo,captchaInfo){
      updatePassword(passwordInfo,captchaInfo).then(res => { 
        if (res.success === true) {
          this.$notification.success({message: '重置成功'})
          this.init()
          this.exit()
          return
        }
        this.$notification.error({message: `重置失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
        this.$notification.error({message: '请求出现错误，请稍后再试'})
        console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    exit(){
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
          this.userInfo=res.data
          return
        }
        console.log('isLogin error',errorTipsMap[res.data])
        this.userInfo=null
        this.$router.push('/login')
      }).catch(ex => {
        console.log('isLogin error',ex.message)
      })
    }
    else{
      this.userInfo=user_info
    }
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
</style>