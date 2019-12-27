<!--评论回复-->
<template>
<div>
    <!--
        visible:是否显示当前a-modal
        confirmLoading:加载动画效果
         @ok="handleSubmit"         提交表单数据给后台
         @cancel="handleCancel"     this.visible=false
    -->
    <a-modal
      title="回复评论"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="评论内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-textarea :disabled="true" placeholder="评论内容" v-decorator="['content']" autosize></a-textarea>
          </a-form-item>

          <a-form-item label="回复内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-textarea placeholder="回复内容" v-decorator="['reply']" autosize></a-textarea>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick' //https://blog.csdn.net/suwu150/article/details/75250749
import {updateComment} from '@/api/comment'

export default {
 name: 'CommentReply',
 props: {
    record: {
      type: [Object, String],
      default: ''
    }
  },
  data() {
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
      form: this.$form.createForm(this),
      cid: ''
    }
  },

 components: {},

 computed: {},

 methods: {
    show(record) {
      this.visible = true
    },
    reply(record) {
      this.visible = true
      //通过pick获取编辑record记录需要填充到表单的数据字段
      //注意：setFieldsValue(formData) 填充的数据必须和表单中的 输入元素必须一致
      const {
        form: { setFieldsValue }
      } = this
      const formData = pick(record, 
        ['cid', 'content', 'reply']
      )
      this.cid = formData.cid
      this.$nextTick(() => {
        setFieldsValue({
          'content': formData.content,
          'reply': formData.reply
        })
      })
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          let additon = {
            'cid': this.cid,
            'reply': values.reply
          }
          return updateComment({ ...additon }).then(res => {
            if (res.success === true) {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
              this.$notification.success({
                message: '回复成功'
              })
            } else {
              this.confirmLoading = false
              this.$notification.error({
                message: `回复失败：${res.data}`
              })
            }
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
 }
}

</script>

<style scoped>
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .uploadValidator {
      color: red;
  }
</style>