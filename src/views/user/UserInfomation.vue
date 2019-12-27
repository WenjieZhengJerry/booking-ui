<template>
<a-locale-provider :locale="zh_CN">
  <a-card :busered="false" :bordered="false">
    <div class="main">
      <div class="tit">
        <h4>基本信息</h4>
      </div>
          <div class="section">
        <a-row type="flex" justify="space-around" align="middle" style="margin-top:50px;">
          <a-col :span="16">
            <a-row>
              <a-col :span="4" class="label-name">用户名:</a-col>
              <a-col :span="16">
                <p v-if="!isEdit" style="margin-top:4px">{{ info.uname }}</p>
                <a-input v-else placeholder="用户名" v-model="info.uname"/>
              </a-col>
            </a-row>
            <a-row style="margin-top:15px;">
              <a-col :span="4" class="label-name">邮箱：</a-col>
              <a-col :span="16">
                <p v-if="!isEdit" style="margin-top:4px">{{ info.email }}</p>
                <a-input v-else placeholder="邮箱" v-model="info.email" maxlength="18"/>
              </a-col>
            </a-row>
            <a-row style="margin-top:15px;">
              <a-col :span="4" class="label-name">手机：</a-col>
              <a-col :span="16">
                <p v-if="!isEdit" style="margin-top:4px">{{ info.telephone }}</p>
                <a-input v-else placeholder="仅大陆手机号码" v-model="info.telephone" maxlength="11"/>
              </a-col>
            </a-row>
            <a-row style="margin-top:15px;">   
              <a-col :span="4" class="label-name">账号类型：</a-col>
              <a-col :span="16">
                <p v-if="!isEdit" style="margin-top:4px">{{ info.type|typeFilter }}</p>
                <a-input v-else :disabled="true" placeholder="账号类型"/>
              </a-col>
            </a-row>
            <a-row style="margin-top:15px;">   
              <a-col :span="4" class="label-name">账号状态：</a-col>
              <a-col :span="16">
                <p v-if="!isEdit" style="margin-top:4px">{{ info.enable|statusFilter }}</p>
                <a-input v-else :disabled="true" placeholder="账号状态"/>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row style="margin-top:50px;margin-bottom:20px;" type="flex" justify="space-around" align="middle">
              <a-avatar shape="square" :size="128" icon="user" :src="'/api'+info.icon"/>
            </a-row>
            <a-row v-if="isEdit" type="flex" justify="space-around" align="middle">
              <input type="file" class="file" hidden="hidden" @change="changeAvatar" ref="avatar"/>
                <a-button @click="handleChangeAvatar">
                  <a-icon type="upload" /> 修改头像
                </a-button>
            </a-row>
          </a-col>
        </a-row>
        <div class="btn-box">
          <a-button v-if="isEdit" class="btn" @click="handleCancel">取消</a-button>
          <a-button v-if="isEdit" class="btn" type="primary" @click="handleVaild">保存</a-button>
          <a-button v-else class="btn" type="primary" @click="handleEdit">编辑</a-button>
        </div>
      </div>
    </div>
    <vaild-email ref="vaildModal" @vaild="handleSubmit" />
  </a-card>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import { user_info, setUserInfo } from '@/utils/encrypt'
import { errorTipsMap } from '@/utils/errorTips'
import { isLogin, logout, updateInfo, updateAvatar, validEmailFunction } from '@/api/login'
import VaildEmail from './VaildEmail'
const userTypeMap = {
  '0': {
    text: '普通用户'
  },
  '1': {
    text: '管理员'
  }
}
const userStatusMap = {
  true: {
    text: '启用'
  },
  false: {
    text: '停用'
  }
}
export default {
 name: 'UserInfomation',
  components: {
    VaildEmail
  },
 data () {
  return {
    zh_CN,
    isEdit: false,
    formLayout: 'horizontal',
    sourceEmail:'',
    info: {
      uname: '',
      telephone: '',
      email: '',
      type: 0,
      icon: '/upload/user/avatar/default_avatar.jpeg',
      enable: true
    },
    hideMessage:0,
    headers: {
      authorization: 'authorization-text',
    }
  };
 },
  methods: {
    moment,
    handleCancel: function() {
      this.info=user_info
      this.isEdit = false
    },
    handleVaild(){
      if(this.sourceEmail!==this.info.email){
        this.$refs.vaildModal.show(this.info.email)
        return
      }
      this.handleSubmit()
    },
    handleSubmit () {
      if(this.valid()){
        this.hideMessage = this.$message.loading('保存中...', 0);

        updateInfo(this.info).then(res => {
          setTimeout(this.hideMessage)
          if (res.success === true) {
            setUserInfo(this.info)
            this.sourceEmail=this.info.email
            this.$notification.success({message: '用户信息已更新'})
            this.isEdit = false
            this.$router.go(0)
            return
          }
          this.$notification.error({message: errorTipsMap[res.data]})
        }).catch(ex => {
          setTimeout(this.hideMessage)
          this.$notification.error({message: '请求出现错误，请稍后再试'})
          console.log('updateInfo error',ex.message)
        })
      }
    },
    handleEdit: function() {
      this.isEdit = true
    },
    valid(){
      let v=true
      if(!/^[A-Za-z][a-zA-Z0-9_]{5,15}$/.test(this.info.uname)){
        this.$notification.error({message: '用户名为6到16位（字母，数字，下划线）只能以字母开头!'})
        v=false
      }
      if(!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(this.info.email)){
        this.$notification.error({message: '邮箱格式不正确!'})
        v=false
      }
      if(!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(this.info.telephone)){
        this.$notification.error({message: '手机号格式不正确!'})
        v=false
      }
      return v
    },
    handleChangeAvatar(){
      console.log(this.$refs.avatar)
      this.$refs.avatar.click()
    },
    changeAvatar() {
      if(!/(\.*.jpg$)|(\.*.png$)|(\.*.jpeg$)|(\.*.gif$)|(\.*.bmp$)/.test(this.$refs.avatar.value)){
        this.$notification.error({message: '仅支持jpg/jpeg/png/gif/bmp格式的头像！'})
        return
      }
      let formData = new window.FormData()
      formData.append('multipartFile', document.querySelector('input[type=file]').files[0])
      updateAvatar(formData).then(res => {
        if (res.success === true) {
          this.$notification.success({message: '头像更新成功'})
          this.$router.go(0)
          return
        }
        this.$notification.error({message: errorTipsMap[res.data]})
      }).catch(ex => {
        setTimeout(this.hideMessage)
        this.$notification.error({message: '请求出现错误，请稍后再试'})
        console.log('updateInfo error',ex.message)
      })
    },
  },
  created () {
    if(null!==user_info){
      this.info=user_info
      this.sourceEmail=user_info.email
      return
    }
    isLogin().then(res => {
      if (res.success === true) {
        this.info=res.data
        setUserInfo(res.data)
        this.sourceEmail=res.data.email
        return
      }
      console.log('isLogin error',errorTipsMap[res.data])
      this.info=null
      this.$router.push('/login')
    }).catch(ex => {
      console.log('isLogin error',ex.message)
    })
  },
  filters: {
    typeFilter (type) {
      return userTypeMap[type].text
    },
    statusFilter (type) {
      return userStatusMap[type].text
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

.section {
  padding-top: 10px;
}

.section li {
  color: #666;
  padding-top: 10px;
  height: 30px;
  padding-left: 120px;
  position: relative;
  list-style-type: none;
  margin-top: 20px;
}

.section li label {
  position: absolute;
  left: 0;
  top: 10px;
  line-height: 30px;
  color: #999;
  width: 100px;
  text-align: right;
  margin-right: 15px;
}

.section li p {
  display: inline-block;
  color: #333;
  font-size: 14px;
  line-height: 30px;
}

.section .btn-box {
  margin-top: 40px;
  width: 42%;
}

.section .btn-box .btn {
  float: right;
  margin-left: 10px;
}

.label-name{
  margin-top:5px;
  margin-right:5px;
  text-align:right;
}

</style>