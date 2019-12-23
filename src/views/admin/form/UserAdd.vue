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
      label="电话号码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      has-feedback
      >
        <a-input
          v-decorator="[
            'captcha',
            {rules: [{ required: true, message: '验证码!' },{ pattern: /^[0-9]{8}$/ , message: '电话格式不正确'}], validateTrigger: ['change', 'blur']}
          ]"
        />
        <a-button type="primary">获取验证码</a-button>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>

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
      this.form.validateFields((errors, values) => {
        if (errors) {
          return
        }
        alert(values.uname)
        alert(values.upassword)
        alert(values.confirmUpassword)
        alert(values.email)
        alert(values.telephone)
        this.confirmLoading = true;
      });
    },
    handleCancel(e) {
      this.visible = false
    },
    handleValidUpassword (rule, value, callback) {
      let tips='密码长度要在6~18之间'
      //长度要在6~18之间
      if(/\S{6,18}$/.test(value)){
        //只能以字母开头的数字大小写字母
        if (/^[a-zA-Z][a-zA-Z0-9]/.test(value)) {
          // 特殊字符
          if (/[^\w\s]+/.test(value)) {
             this.validateSta.upassword='success'
            tips='密码强度: 强'
          }
          else{
            this.validateSta.upassword='warning'
            tips='密码强度: 弱'
          }
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
        callback();
      }
    },
    getKey (email, password) {
      return getPublicKey(email).then(res => {
        if (res.success === true) {
          this.userInfo.upassword=rsaEncrypt(password, res.data)
          this.submitInfo(this.userInfo,this.captchaInfo)
          return
        }
          this.$notification.error({message: `注册失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
        this.requestFailed(ex)
      })
    },
    submitInfo (info,token) {
      register(info,token).then(res => {
        if (res.success === true) {
          this.$notification.success({message: '注册成功'})
          this.$router.push({path:'/login'})
          return
        }
        this.$notification.error({message: `注册失败: ${errorTipsMap[res.data]}`})
      }).catch(ex => {
        this.requestFailed(ex)
      })
    }
  }
}
</script>
<style scoped>

</style>
