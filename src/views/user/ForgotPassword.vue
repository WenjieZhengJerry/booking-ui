<template>
  <div>
    <a-modal
      title="忘记密码"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      :cancelText="'取消'"
      :okText="'找回密码'"
    >
      
      <a-form :form="form" >
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
              <div class="graphCaptcha" @click="getGraphCaptcha">
                <img alt="验证码" :src="graph" style="width:85px;height:30px;margin-top:-13px;">
              </div>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>
<script>
import { sendCaptcha, findPassword } from '@/api/login'
import { errorTipsMap } from '@/utils/errorTips'
export default {
  name:'ForgotPassword',
  data(){
    return{
      visible: false,
      confirmLoading: false,
      email:'',
      graph:'',
      captchaInfo:{
        token:'',
        code:''
      },
      form: this.$form.createForm(this)
    }
  },
  methods:{
    show(email) {
      this.form.setFieldsValue({email: this.email})
      this.visible = true
      this.email=email
      this.getGraphCaptcha()
    },
    handleOk(e) {
      const { form: { validateFields } } = this;
      this.form.validateFields({ force: true }, (errors, values) => {
        if (errors) {
          console.log('ForgotPassword.form.validateFields',errors)
          return
        }
        this.captchaInfo.code=values.captcha
        this.confirmLoading = true
        findPassword(values.email,this.captchaInfo).then(res => {
          this.confirmLoading = false
          if (res.success === true) {
            this.init()
            this.$notification.success({message: `找回信息已发送到邮箱: ${values.email}`})
            this.visible = false
            return
          }
          this.$notification.error({message: `找回失败: ${errorTipsMap[res.data]}`})
        })
        .catch(ex => {
          this.$notification.error({message: '请求出现错误，请稍后再试'})
          console.log('请求出现错误，请稍后再试',ex.message)
        })
      })
    },
    handleCancel(e) {
      this.confirmLoading = false
      this.visible = false
    },
    handleValidCaptcha(rule, value, callback){
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
    getGraphCaptcha(){
      sendCaptcha('').then(res => {
        if (res.success === true) {
          console.log(res.data)
          this.captchaInfo.token=res.data.token
          this.captchaInfo.code=res.data.code
          this.graph=res.data.img
          return
        }
        this.$notification.error({message: `验证码发送失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
        setTimeout(this.hideMessage)
        this.$notification.error({message: '请求出现错误，请稍后再试'})
        console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    init(){
      this.email=''
      this.captchaInfo.token=''
      this.captchaInfo.code=''
      this.graph=''
      this.form.resetFields()
    }
  }
}
</script>
<style scoped>
.graphCaptcha{
  width:87px;
  height:32px;
  margin-top:3px;
  border-style: solid;
  border-width: 1px;
  border-color: dimgrey;
}
</style>
