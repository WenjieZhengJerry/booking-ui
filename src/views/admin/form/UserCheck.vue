<template>
  <div>
    <!--
        visible:是否显示当前a-modal
        confirmLoading:加载动画效果
         @ok="handleSubmit"         提交表单数据给后台
         @cancel="handleCancel"     this.visible=false
    -->
    <a-modal
      title="用户信息"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :footer="null"
      @cancel="handleCancel" >

      <a-spin :spinning="confirmLoading">
        <!-- :src="'/api'+info.icon" -->
        <a-row>
          <a-col :span="6"><a-avatar shape="square" :size="128" icon="user" :src="info.icon"/></a-col>
          <a-col :span="18">
            <a-row>
              <a-col :span="4" style="margin-bottom:0">用户id</a-col>
              <a-col :span="20" style="margin-bottom:0">{{info.uid}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="4" style="margin-bottom:0">用户名</a-col>
              <a-col :span="20" style="margin-bottom:0">{{info.uname}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="4" style="margin-bottom:0">邮箱</a-col>
              <a-col :span="20" style="margin-bottom:0">{{info.email}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;">   
              <a-col :span="4" style="margin-bottom:0">电话</a-col>
              <a-col :span="20" style="margin-bottom:0">{{info.telephone}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;">   
              <a-col :span="4" style="margin-bottom:0">类型</a-col>
              <a-col :span="20" style="margin-bottom:0">{{0===info.type?'普通用户':'管理员'}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;"> 
              <a-col :span="4" style="margin-bottom:0">状态</a-col>
              <a-col :span="20" style="margin-bottom:0">{{info.enable?'启用':'停用'}}</a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'UserCheck',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      info:{}
    }
  },
  methods: {
    show (record) {
      this.info=record
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
