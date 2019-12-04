<template>
<a-locale-provider :locale="zh_CN">
  <div class="main">
    <div class="tit">
      <h4>基本信息</h4>
    </div>
    <div class="section">
      <ul>
        <li>
          <label>姓名：</label>
          <p v-if="!isEdit">{{ user.uName }}</p>
          <a-input v-else placeholder="真实姓名" v-model="user.uName" style="width: 30%"/>
        </li>
        <li>
          <label>证件类型：</label>
          <p v-if="!isEdit">{{ user.idType }}</p>
          <a-select v-else defaultValue="IDcard" style="width: 120px">
            <a-select-option value="IDcard">身份证</a-select-option>
          </a-select>
        </li>
        <li>
          <label>证件号：</label>
          <p v-if="!isEdit">{{ user.idNumber }}</p>
          <a-input v-else placeholder="身份证号码" v-model="user.idNumber" style="width: 30%" maxlength="18"/>
        </li>
        <li>
          <label>手机：</label>
          <p v-if="!isEdit">{{ user.phone }}</p>
          <a-input v-else placeholder="仅大陆手机号码" v-model="user.phone" style="width: 30%" maxlength="11"/>
        </li>
        <li>
          <label>邮箱：</label>
          <p v-if="!isEdit">{{ user.email }}</p>
          <a-input v-else placeholder="邮箱" v-model="user.email" style="width: 30%"/>
        </li>
        <li>
          <label>生日：</label>
          <p v-if="!isEdit">{{ user.birthday }}</p>
          <a-date-picker v-else :defaultValue="moment(user.birthday, 'YYYY-MM-DD')" />
        </li>
      </ul>
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

export default {
 name: 'UserInfomation',
 data () {
  return {
    zh_CN,
    isEdit: false,
    user: {
      uName: '小泽又沐风',
      idType: '身份证',
      idNumber: '440000201911230000',
      phone: '12345678910',
      email: '987654321@qq.com',
      birthday: '2019-11-23'
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

</style>