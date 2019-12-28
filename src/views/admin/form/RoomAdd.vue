<!--添加房间-->
<template>
  <div>
    <!--
        visible:是否显示当前a-modal
        confirmLoading:加载动画效果
         @ok="handleSubmit"         提交表单数据给后台
         @cancel="handleCancel"     this.visible=false
    -->
    <a-modal
      title="添加房间"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="房间名字" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['rname',
            {rules: [{required: true, message: '请输入房间名字'}]}]"></a-input>
          </a-form-item>
          <!-- action="/api/upload" -->
          <a-form-item label="房间图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-upload
            action="/upload"
            :data="handleData"
            listType="picture-card"
            :fileList="fileList"
            @preview="handlePreview"
            @change="handleChange"
            :remove="handleRemove"
            >
            <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
            </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelUploadImg">
                <img alt="房间图片" style="width: 100%" :src="previewImage" />
            </a-modal>
            <span v-show="isUpload" class="uploadValidator">请上传图片</span>
          </a-form-item>

          <a-form-item label="房间详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-textarea placeholder="房间详情"
            v-decorator="['assitions',
            {initialValue: assitions, rules: [{required: true, message: '请输入房间详情'}]}]" autosize />
          </a-form-item>

          <a-form-item label="人数上限" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['people',
            {initialValue: '2',rules: [{required: true, message: '请选择人数上限'}]}]" placeholder="请选择">
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
              <a-select-option value="3">3</a-select-option>
              <a-select-option value="4">4</a-select-option>
              <a-select-option value="5">5</a-select-option>
              <a-select-option value="6">6</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="取消策略" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['cancel',
            {initialValue: '限时取消',rules: [{required: true, message: '请选择取消策略'}]}]" placeholder="请选择">
              <a-select-option value="限时取消">限时取消</a-select-option>
              <a-select-option value="免费取消">免费取消</a-select-option>
              <a-select-option value="不支持取消">不支持取消</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="房间早餐" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['breakfast',
            {initialValue: '含早',rules: [{required: true, message: '请选择房间早餐'}]}]" placeholder="请选择">
              <a-select-option value="含早">含早</a-select-option>
              <a-select-option value="不含早">不含早</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="房间价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['price',
            {rules: [{required: true, message: '请输入房间价格'},{validator: handleCheckPrice}]}]"></a-input>
          </a-form-item>

           <a-form-item label="房间库存" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['stock',
            {rules: [{required: true, message: '请输入房间库存'},{validator: handleCheckStock}]}]"></a-input>
          </a-form-item>

          <a-form-item label="房间类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['type', 
            {initialValue: 'STANDARD',rules: [{required: true, message: '请选择房间类型'}]}]" 
            placeholder="请选择">
              <a-select-option value="STANDARD">标准房</a-select-option>
              <a-select-option value="SUPERIOR">高级房</a-select-option>
              <a-select-option value="DELUXE">豪华房</a-select-option>
              <a-select-option value="BUSINESS">商务房</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { uploadImg, deleteFile } from '@/api/upload'
import { addRoom } from '@/api/room'

export default {
 name: 'RoomAdd',
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
      previewVisible: false,
      previewImage: '',
      fileList: [],
      loading: false,
      isUpload: false,
      assitions: '床型：单床1.8米,面积：12㎡,不允许加床,外窗',
      hid: ''
   };
 },

 components: {},

 computed: {},

 methods: {
    add(hid) {
      this.visible = true
      this.form.resetFields()
      //解决每次打开添加房间表单时遗留上次的图片数据和校验提示
      this.fileList = []
      this.isUpload = false
      this.hid = hid
      console.log(`添加房间${hid}`)
    },
    handleCancel() {
      //关闭添加房间表单
      this.visible = false
    },
    handleSubmit() {
      console.log(`添加房间${this.hid}`)
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        this.isUpload = this.fileList.length==0
        if (!errors && !this.isUpload) {
          let imgUrl = this.fileList[0].response.data.imgUrl
          let parameter = {
            'rname': values.rname,
            'people': values.people,
            'assitions': values.assitions,
            'cancel': values.cancel,
            'breakfast': values.breakfast,
            'price': values.price,
            'stock': values.stock,
            'type': values.type,
            'img': imgUrl,
            'hid': this.hid
          }
          return addRoom(parameter).then(res => {
            if (res.success === true) {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
              this.$message.success('添加房间成功！')
            } else {
              this.confirmLoading = false
              this.$message.error({
                message: '添加房间失败！'
              })
            }
          }).catch(err => {
              this.confirmLoading = false
              this.$message.error(`添加房间出错！: ${err.message}`)
          }) 
        } else {
            this.confirmLoading = false
        }
      })
    },
   /*-----------文件上传相关函数--------------*/
    handleData() {
        //console.log(`设置文件上传参数`)
        return {
            directoryName: "room",
        }
    },
    handleCancelUploadImg() {
        //console.log('关闭图片预览')
        this.previewVisible = false;
    },
    handlePreview(file) {
        //图片预览
        //console.log(`图片路径:${file.response.data.imgUrl}`)
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    },
    handleChange({ file,fileList }) {
        //上传文件列表改变时更新本地文件列表
        /* console.log(JSON.stringify(file)); // file 是当前正在上传的 单个 img
        console.log(JSON.stringify(fileList)); // fileList 是已上传的全部 img 列表 */
        this.fileList = fileList;
        //文件上传成功更新数据库中酒店图片路径
        if(file.status == "done") {
            this.isUpload = false
        }
    },
    handleRemove(file) {
        //返回值为false不删除文件，true时删除文件
        if(file == undefined || file.response.data == undefined || file.response.data.imgUrl == "") {
            this.$message.error(`文件不存在！`)
            return false
        }
        let filePath = file.response.data.imgUrl
        deleteFile({"filePath" : filePath}).then(res => {
            if(res.success === true){
                this.$message.success(`文件删除成功！`)
                return true;
            }else{
                this.$message.error(`文件删除失败！`)
                return false;
            }
        }).catch(err => {
            this.$message.error(`文件删除出错！: ${err.message}`)
        })
    },
    /*-----------文件上传相关函数结束--------------*/
    /* 自定义验证规则 */
    handleCheckStock(rule, value, callback) {
      //验证库存只能为非负整数
      if (value!="" && (!(/^\d+$/.test(value)))) {
        callback('请输入正确的库存')
      }
      callback()
    },
    handleCheckPrice(rule, value, callback) {
      //验证价格只能为非负浮点数
      if (value!="" && (!(/^\d+(\.\d+)?$/.test(value)))) {
        callback('请输入正确的的价格')
      }
      callback()
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