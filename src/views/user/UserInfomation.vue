<template>
<a-locale-provider :locale="zh_CN">
  <div class="main">
    <div class="tit">
      <h4>基本信息</h4>
    </div>
    <div class="section">
      <a-row>
        <a-col :span="8">
          <a-row style="margin-top:50px;margin-bottom:20px;" type="flex" justify="space-around" align="middle">
            <a-avatar shape="square" :size="128" icon="user" :src="'/api'+userInfo.icon"/>
          </a-row>
          <a-row v-if="isEdit" type="flex" justify="space-around" align="middle">
            <a-upload name="file" :multiple="true" action="//jsonplaceholder.typicode.com/posts/" :headers="headers" @change="handleChange">
              <a-button>
                <a-icon type="upload" /> 修改头像
              </a-button>
            </a-upload>
          </a-row>
        </a-col>
        <a-col :span="16">
          <a-row style="margin-top:50px;">
            <a-col :span="4" class="label-name">用户名:</a-col>
            <a-col :span="16">
              <p v-if="!isEdit" style="margin-top:4px">{{ userInfo.uname }}</p>
              <a-input v-else placeholder="用户名" v-model="userInfo.uname"/>
            </a-col>
          </a-row>
          <a-row style="margin-top:15px;">
            <a-col :span="4" class="label-name">邮箱：</a-col>
            <a-col :span="16">
              <p v-if="!isEdit" style="margin-top:4px">{{ userInfo.email }}</p>
              <a-input v-else placeholder="邮箱" v-model="userInfo.email" maxlength="18"/>
            </a-col>
          </a-row>
          <a-row style="margin-top:15px;">
            <a-col :span="4" class="label-name">手机：</a-col>
            <a-col :span="16">
              <p v-if="!isEdit" style="margin-top:4px">{{ userInfo.telephone }}</p>
              <a-input v-else placeholder="仅大陆手机号码" v-model="userInfo.telephone" maxlength="11"/>
            </a-col>
          </a-row>
          <a-row style="margin-top:15px;">   
            <a-col :span="4" class="label-name">账号类型：</a-col>
            <a-col :span="16">
              <p v-if="!isEdit" style="margin-top:4px">{{ userInfo.type|typeFilter }}</p>
              <a-input v-else :disabled="true" placeholder="账号类型"/>
            </a-col>
          </a-row>
          <a-row style="margin-top:15px;">   
            <a-col :span="4" class="label-name">账号状态：</a-col>
            <a-col :span="16">
              <p v-if="!isEdit" style="margin-top:4px">{{ userInfo.enable|statusFilter }}</p>
              <a-input v-else :disabled="true" placeholder="账号状态"/>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
       
      <!-- <ul>
        <li>
          <label>用户名：</label>
          <p v-if="!isEdit">{{ userInfo.uname }}</p>
          <a-input v-else placeholder="用户名" v-model="userInfo.uname" style="width: 30%"/>
        </li>
        <li>
          <label>邮箱：</label>
          <p v-if="!isEdit">{{ userInfo.email }}</p>
          <a-input v-else placeholder="邮箱" v-model="userInfo.email" style="width: 30%" maxlength="18"/>
        </li>
        <li>
          <label>手机：</label>
          <p v-if="!isEdit">{{ userInfo.telephone }}</p>
          <a-input v-else placeholder="仅大陆手机号码" v-model="userInfo.telephone" style="width: 30%" maxlength="11"/>
        </li>
        <li>
          <label>账号类型：</label>
          <p v-if="!isEdit">{{ userInfo.type|typeFilter }}</p>
          <a-input v-else :disabled="true" placeholder="账号类型" style="width: 30%"/>
        </li>
        <li>
          <label>账号状态：</label>
          <p v-if="!isEdit">{{ userInfo.enable|statusFilter }}</p>
          <a-input v-else :disabled="true" placeholder="账号状态" style="width: 30%"/>
        </li>
      </ul> 
      <ul>
        <a-avatar shape="square" :size="128" icon="user" :src="'/api'+userInfo.icon"/>
      </ul> -->
      <div class="btn-box">
        <a-button v-if="isEdit" class="btn" @click="handleCancel">取消</a-button>
        <a-button v-if="isEdit" class="btn" type="primary" @click="handleSave">保存</a-button>
        <a-button v-else class="btn" type="primary" @click="handleEdit">编辑</a-button>
      </div>
    </div>
  </div>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import { errorTipsMap } from '@/utils/errorTips'
import { isLogin } from '@/api/login'
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
 data () {
  return {
    zh_CN,
    isEdit: false,
    userInfo: {
      uname: '',
      telephone: '',
      email: '',
      type: 0,
      icon: '/api/upload/user/avatar/default_avatar.jpeg',
      enable: true
    }
  };
 },
  methods: {
    moment,
    handleCancel: function() {
      this.isEdit = false
    },
    handleSave: function() {
      this.isEdit = false
      console.log("已保存")
    },
    handleEdit: function() {
      this.isEdit = true
    }
  },
  created () {
    isLogin().then(res => {
      if (res.success === true) {
        if(null!==res.data){
          this.userInfo=res.data
          return
        }
        this.$router.push('/login')
      }
      console.log('isLogin error',errorTipsMap[res.data])
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