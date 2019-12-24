<template>
  <a-modal
    title="搜索"
    cancelText="取消"
    okText="搜索"
    :visible="visible"
    @ok="$emit('search',searchParams)"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >

    <a-card :busered="false" :bordered="false">
      <a-row>
        <a-col :span="4" style="margin-top:5px"><label>用户名:</label></a-col>
        <a-col :span="20"><a-input placeholder="请输入用户名" v-model="searchParams.uname" /></a-col>
      </a-row>
      <a-row style="margin-top:15px;">
        <a-col :span="4" style="margin-top:5px"><label>邮箱:</label></a-col>
        <a-col :span="20"><a-input placeholder="邮箱" v-model="searchParams.email" /></a-col>
      </a-row>
      <a-row style="margin-top:15px;">
        <a-col :span="4" style="margin-top:5px"><label>电话:</label></a-col>
        <a-col :span="20"><a-input placeholder="电话" v-model="searchParams.telephone" /></a-col>
      </a-row>
      <a-row style="margin-top:15px;">
        <a-col :span="4" style="margin-top:5px"><label>用户类型:</label></a-col>
        <a-col :span="8">
          <a-select defaultValue="null" v-model="searchParams.type" style="width: 100px">
            <a-select-option value="null">不限</a-select-option>
            <a-select-option value="0">普通用户</a-select-option>
            <a-select-option value="1">管理员</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4" style="margin-top:5px"> <label>用户状态:</label></a-col>
        <a-col :span="8">
          <a-select defaultValue="null" v-model="searchParams.enable" style="width: 80px">
            <a-select-option value="null">不限</a-select-option>
            <a-select-option value="true">启用</a-select-option>
            <a-select-option value="false">停用</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-card>
  </a-modal>
</template>
<script>
export default {
  name:'UserSearch',
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      searchParams:{
        uname:'',
        email:'',
        telephone:'',
        type:'null',
        enable:'null',
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    init(){
      this.searchParams.uname=''
      this.searchParams.email=''
      this.searchParams.telephone=''
      this.searchParams.type='null'
      this.searchParams.enable='null'
    },
    hide(){
      this.init()
      this.visible = false
    },
    //handleOk(e) {
    //   this.ModalText = 'The modal will be closed after two seconds';
    //   this.confirmLoading = true;
    //   setTimeout(() => {
    //     this.visible = false;
    //     this.confirmLoading = false;
    //   }, 2000);
    //},
    handleCancel(e) {
      this.init()
      this.visible = false
    },
  }
}
</script>
<style scoped>

</style>
