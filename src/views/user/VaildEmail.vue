<template>
  <div>
    <a-modal
      title="验证邮箱"
      cancelText="取消"
      okText="验证"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form" >
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
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { errorTipsMap } from '@/utils/errorTips'
import { sendCaptcha, validEmailFunction } from '@/api/login'
export default {
  name:'VaildEmail',
  data(){
    return{
      email:'111',
      captchaInfo:{
        code:'',
        token:''
      },
      form: this.$form.createForm(this),
      visible:false,
      confirmLoading:false,
    }
  },
  methods:{
    show(email){
      this.getCaptcha (email)
      this.email=email
      this.visible=true
    },
    handleOk(){
      this.form.validateFields({ force: true }, (errors, values) => {
        if (errors) {
          console.log('VaildEmail.form.validateFields',errors)
          return
        }
        this.captchaInfo.code=values.captcha
        this.confirmLoading = true

        validEmailFunction(this.captchaInfo).then(res => {
          this.confirmLoading=false
          if (res.success === true) {
            this.$notification.success({message: '邮箱验证通过'})
            this.visible=false
            this.form.resetFields()
            this.$emit('vaild')
            return
          }
          this.$notification.error({message: errorTipsMap[res.data]})
        }).catch(ex => {
          confirmLoading=false
          this.$notification.error({message: '请求出现错误，请稍后再试'})
          console.log('updateInfo error',ex.message)
        })
      });
    },
    handleCancel(){
      this.visible=false
      this.captchaInfo.code=''
      this.form.resetFields()
    },
    getCaptcha (email) {
      return sendCaptcha(email).then(res => {
        if (res.success === true) {
          this.visible=true
          this.captchaInfo=res.data
          //alert(res.data.code)
          this.$notification.success({message: `验证码已发送到邮箱: ${email}`})
          return
        }
        this.$notification.error({message: `验证码发送失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
        console.log('请求出现错误，请稍后再试',ex.message)
        this.$notification.error({message:'请求出现错误，请稍后再试'})
      })
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
    }
  }
}
</script>
<style scoped>

</style>
