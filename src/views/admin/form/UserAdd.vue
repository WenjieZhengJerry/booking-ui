<template>
  <a-modal
  title="添加管理员"
  :visible="visible"
  cancelText="取消"
  okText="添加"
  @ok="handleOk"
  :confirmLoading="confirmLoading"
  @cancel="handleCancel"
  >
      
    <a-form :form="form" >
      <a-form-item
      label="用户名"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      has-feedback
      >
        <a-input
          v-decorator="[
            'uname',
            {rules: [{ required: true, message: '请输入用户名!' },{ pattern: /^[A-Za-z][a-zA-Z0-9_]{5,15}$/ ,message:'6到16位（字母，数字，下划线）只能以字母开头!'}], validateTrigger: ['change','blur']}
          ]"
        />
      </a-form-item>
      <a-form-item
      label="邮箱地址"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      has-feedback
      >
        <a-input
          v-decorator="[
            'email',
            {rules: [{ required: true, message: '请输入邮箱地址!' },{type: 'email', message: '邮箱格式不正确!'}], validateTrigger: ['change','blur']}
          ]"
        />
      </a-form-item>
      <a-form-item
      label="密码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      has-feedback
      :validate-status="validateSta.upassword"
      :help="helpText.upassword"
      >
        <a-input
          v-decorator="[
            'upassword',
            {rules: [{ required: true, message: '请输入密码!' },{ validator: this.handleValidUpassword }], validateTrigger: ['change', 'blur']}
          ]"
        />
      </a-form-item>
     <a-form-item
      label="确认密码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      has-feedback
      :validate-status="validateSta.confirm"
      >
        <a-input
          v-decorator="[
            'confirm',
            {rules: [{ required: true, message: '请输入确认密码!' },{ validator: this.handleValidConfirm }], validateTrigger: ['change', 'blur']}
          ]"
        />
      </a-form-item>
      <a-form-item
      label="电话号码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      has-feedback
      >
        <a-input
          v-decorator="[
            'telephone',
            {rules: [{ required: true, message: '请输入电话号码!' },{ pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/ , message: '电话格式不正确'}], validateTrigger: ['change', 'blur']}
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
              v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' },{ validator: this.handleValidCaptcha }], validateTrigger: ['change', 'blur']}]"
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
    </a-form>
  </a-modal>
</template>
<script>
import { getPublicKey, sendCaptcha, register } from '@/api/login'
import { errorTipsMap } from '@/utils/errorTips'
import { rsaEncrypt, registerUser } from '@/utils/encrypt'
export default {
  name:'UserAdd',
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      validateSta:{
        upassword:'',
        confirm:''
      },
      disableGetCaptcha: false,
      getCaptchaTest: '获取验证码',
      captchaInfo:{
        token:'',
        code:''
      },
      getCaptchaStatus:{
        time:60,
        isDisable:false,
        hideMessage:0
      },
      helpText:{
        upassword:null
      },
      userInfo:{
        email:'',
        upassword:'',
        telephone:'',
        uname:''
      }
    }
  },
  methods:{
    show() {
        this.visible = true
        this.confirmLoading = false;
    },
    handleOk(e) {
      const { form: { validateFields } } = this;
      this.form.validateFields({ force: true }, (errors, values) => {
        if (errors) {
          console.log('UserAdd.form.validateFields',errors)
          return
        }
        this.userInfo.email=values.email
        this.userInfo.upassword=values.upassword
        this.userInfo.uname=values.uname
        this.userInfo.telephone=values.telephone
        this.confirmLoading = true
        registerUser(this.userInfo,this.captchaInfo,(status,tips)=>{
          this.confirmLoading = false
          if(0===status){
            this.$notification.success({message: tips})
          }
          else{
            this.$notification.error({message: tips})
            console.log(tips)
          }
        })
      });
    },
    handleCancel(e) {
      this.visible = false
    },
    handleValidUpassword (rule, value, callback) {
      let tips='密码长度要在6~18之间'
      this.helpText.upassword=null
      //长度要在6~18之间
      if(/\S{6,18}$/.test(value)){
        //只能以字母开头的数字大小写字母
        if (/^[a-zA-Z][a-zA-Z0-9]/.test(value)) {
          // 特殊字符
          if (/[^\w\s]+/.test(value)) {
            this.validateSta.upassword='success'
            this.helpText.upassword='密码强度: 强'
          }
          else{
            this.validateSta.upassword='warning'
            this.helpText.upassword='密码强度: 弱'
          }
          callback()
        }
        else{
          this.validateSta.upassword='error'
          tips='请输入字母开头的密码'
        }
      }
      else{
        this.validateSta.upassword='error'
      }
      callback(tips)
    }, 
    handleValidConfirm (rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('upassword')) {
        this.validateSta.confirm='error'
        callback('输入密码不一致!');
      } else {
        this.validateSta.confirm='success'
        callback();
      }
    },
    handleValidCaptcha(rule, value, callback){
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
    getCaptcha(){
      const { form: { validateFields }, $message} = this;
      this.form.validateFields(['email'],(errors, values) => {
        if (errors) {
          return
        }
        this.getCaptchaStatus.isDisable = true
        const interval = window.setInterval(() => {
          if (this.getCaptchaStatus.time-- <= 0) {
            this.getCaptchaStatus.time = 60
            this.getCaptchaStatus.isDisable = false
            window.clearInterval(interval)
          }
        }, 1000)

        this.hideMessage = $message.loading('验证码发送中..', 0)

        sendCaptcha(values.email).then(res => {
          setTimeout(this.hideMessage)
          if (res.success === true) {
            this.captchaInfo.token=res.data.token
            this.captchaInfo.code=res.data.code
            alert(res.data.code)
            this.$notification.success({message: '验证码已发送'})
            return
          }
          this.$notification.error({message: `验证码发送失败: ${errorTipsMap[res.data]}`})
        }).catch(ex => {
          setTimeout(this.hideMessage)
          this.$notification.error({message: '请求出现错误，请稍后再试'})
          console.log('请求出现错误，请稍后再试',ex.message)
        })
      });
    }
  }
}
</script>
<style scoped>

</style>
