<template>
 <div>
    <!--
        visible:是否显示当前a-modal
        confirmLoading:加载动画效果
         @ok="handleSubmit"         提交表单数据给后台
         @cancel="handleCancel"     this.visible=false
    -->
    <a-modal
      title="编辑订单"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="下单人" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['user.uname']" :disabled="true"></a-input>
          </a-form-item>

          <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :maxLength="11" v-decorator="['user.telephone']" :disabled="true"></a-input>
          </a-form-item>

          <a-form-item label="入住人" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['checkInPerson',
            {rules: [{ required: true, message: '入住人不能为空' }]}]" ></a-input>
          </a-form-item>

          <a-form-item label="酒店" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['hotel.hname']" :disabled="true" ></a-input>
          </a-form-item>

          <a-form-item label="房间名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['room.rname']" :disabled="true"></a-input>
          </a-form-item>

          <a-form-item label="单价" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number v-model="price" @change="handlePrice" placeholder="单价" ></a-input-number>
            &nbsp;元
          </a-form-item>

          <a-form-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-model="count" placeholder="请选择" @change="handleCount">
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
              <a-select-option value="3">3</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="总价" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number placeholder="总价" v-model="totalPrice"></a-input-number>
            &nbsp;元
          </a-form-item>

          <a-form-item label="订单状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['status']" placeholder="请选择" >
              <a-select-option value="UNUSE">待入住</a-select-option>
              <a-select-option value="UNPAY">待付款</a-select-option>
              <a-select-option value="SUCCESS">已完成</a-select-option>
              <a-select-option value="CANCEL">已取消</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="订单备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['remark']" ></a-input>
          </a-form-item>

          <a-form-item label="下单时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              style="width: 100%"
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              v-decorator="['createTime']"
              disabled
            />
          </a-form-item>

          <a-form-item label="入住时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              style="width: 100%"
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              placeholder="请选择入住时间"
              v-decorator="['startTime', {rules: [{ required: true, message: '入住时间不能为空' }]}]"
            />
          </a-form-item>

          <a-form-item label="离店时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              style="width: 100%"
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              placeholder="请选择离店时间"
              v-decorator="['endTime', {rules: [{ required: true, message: '离店时间不能为空' }]}]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment' //日期处理moment.js工具模块
import pick from 'lodash.pick' //https://blog.csdn.net/suwu150/article/details/75250749
import { updateOrder } from '@/api/order'

export default {
 name: 'OrderEdit',
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
      price: '',
      count: '',
      totalPrice: '',
      oid: ''
    }
  },
  methods: {
    show(record) {
      this.visible = true
    },
    edit(record) {
      this.visible = true
      //通过pick获取编辑record记录需要填充到表单的数据字段
      //注意：setFieldsValue(formData) 填充的数据必须和表单中的 输入元素必须一致
      const {
        form: { setFieldsValue }
      } = this
      const formData = pick(record, 
        ['hotel', 'user', 'room', 'checkInPerson', 'remark', 'price', 'count',
          'totalPrice', 'status', 'createTime', 'startTime', 'endTime', 'oid']
      )
      formData.createTime = moment(record.createTime)
      formData.startTime = moment(record.startTime)
      formData.endTime = moment(record.endTime)
      this.price = formData.price
      this.count = formData.count
      this.totalPrice = formData.totalPrice
      this.oid = formData.oid
      this.$nextTick(() => {
        setFieldsValue({
          'user.uname': formData.user.uname,
          'user.telephone': formData.user.telephone,
          'checkInPerson': formData.checkInPerson,
          'remark': formData.remark,
          'hotel.hname': formData.hotel.hname,
          'room.rname': formData.room.rname,
          'status': formData.status,
          'createTime': formData.createTime,
          'startTime': formData.startTime,
          'endTime': formData.endTime 
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
          //把不是表单的4个元素添加进来
          let additon = {
            'oid': this.oid,
            'price': this.price,
            'count': this.count,
            'totalPrice': this.totalPrice
          }
          return updateOrder({ ...values, ...additon }).then(res => {
            if (res.success === true) {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
              this.$notification.success({
                message: '更新成功'
              })
            } else {
              this.confirmLoading = false
              this.$notification.error({
                message: res.data
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
    },
    handlePrice() {
      this.totalPrice = Math.ceil(this.price * this.count)
    },
    handleCount() {
      this.totalPrice = Math.ceil(this.price * this.count)
    }
  }
}

</script>
<style scoped>
</style>