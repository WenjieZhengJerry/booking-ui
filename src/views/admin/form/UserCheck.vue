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

        <a-row>
          <a-col :span="6"><a-avatar shape="square" :size="128" icon="user" :src="'/api'+data.icon"/></a-col>
          <a-col :span="18">
            <a-row>
              <a-col :span="4" style="margin-bottom:0">用户id</a-col>
              <a-col :span="20" style="margin-bottom:0">{{data.uid}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="4" style="margin-bottom:0">用户名</a-col>
              <a-col :span="20" style="margin-bottom:0">{{data.uname}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="4" style="margin-bottom:0">邮箱</a-col>
              <a-col :span="20" style="margin-bottom:0">{{data.email}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;">   
              <a-col :span="4" style="margin-bottom:0">电话</a-col>
              <a-col :span="20" style="margin-bottom:0">{{data.telephone}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;">   
              <a-col :span="4" style="margin-bottom:0">类型</a-col>
              <a-col :span="20" style="margin-bottom:0">{{0===data.type?'普通用户':'管理员'}}</a-col>
            </a-row>
            <a-row style="margin-top:10px;"> 
              <a-col :span="4" style="margin-bottom:0">状态</a-col>
              <a-col :span="20" style="margin-bottom:0">{{data.enable?'启用':'停用'}}</a-col>
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
  props: ['data'],
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
      confirmLoading: false
    }
  },
  methods: {
    show (record) {
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
