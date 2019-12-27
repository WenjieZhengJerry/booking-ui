<!--订单评价表单-->
<template>
 <div>
    <!--
        visible:是否显示当前a-modal
        confirmLoading:加载动画效果
         @ok="handleSubmit"         提交表单数据给后台
         @cancel="handleCancel"     this.visible=false
    -->
    <a-modal
      title="订单评价"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="订单评分" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-rate v-model="rate" allowHalf />
          </a-form-item>

          <a-form-item label="评价内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-textarea placeholder="评价内容" v-decorator="['content']" autosize />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'

export default {
 name: 'EvaluationOrder',
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
      form: this.$form.createForm(this),
      rate: 0,
      oid: ''
   };
 },

 components: {},

 computed: {},

 methods: {
    evaluate(oid) {
      this.visible = true
      this.oid = oid
      this.rate = 0
      this.form.resetFields()
    },
    handleCancel() {
      //关闭添加酒店表单
      this.visible = false
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          let parameter = {
            'content': values.content,
            'rate': this.rate,
            'oid': this.oid
          }
          console.log("评价数据" + JSON.stringify(parameter))
          return addComment(parameter).then(res => {
            if (res.success === true) {
              this.visible = false
              this.confirmLoading = false
              this.$message.success('评价成功！')
            } else {
              this.confirmLoading = false
              this.$message.error('评价失败！')
            }
          }).catch(err => {
              this.confirmLoading = false
              this.$message.error(`评价出错！: ${err.message}`)
          }) 
        } else {
            this.confirmLoading = false
        }
      })
    },
 }
}

</script>

<style scoped>

</style>