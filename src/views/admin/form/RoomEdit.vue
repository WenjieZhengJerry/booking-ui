<!--编辑房间-->
<template>
 <div>
    <!--
        visible:是否显示当前a-modal
        confirmLoading:加载动画效果
         @ok="handleSubmit"         提交表单数据给后台
         @cancel="handleCancel"     this.visible=false
    -->
    <a-modal
      title="编辑房间"
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

          <a-form-item label="房间图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-upload
            action="/api/upload"
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
            {rules: [{required: true, message: '请输入房间详情'}]}]" autosize />
          </a-form-item>

          <a-form-item label="人数上限" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['people',
            {initialValue: 'people',rules: [{required: true, message: '请选择人数上限'}]}]" placeholder="请选择">
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
            {initialValue: 'cancel',rules: [{required: true, message: '请选择取消策略'}]}]" placeholder="请选择">
              <a-select-option value="限时取消">限时取消</a-select-option>
              <a-select-option value="免费取消">免费取消</a-select-option>
              <a-select-option value="不支持取消">不支持取消</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="房间早餐" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['breakfast',
            {initialValue: 'breakfast',rules: [{required: true, message: '请选择房间早餐'}]}]" placeholder="请选择">
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
            {initialValue: 'type',rules: [{required: true, message: '请选择房间类型'}]}]" 
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
import pick from 'lodash.pick' //https://blog.csdn.net/suwu150/article/details/75250749
import { uploadImg, deleteFile } from '@/api/upload'
import { updateRoom } from '@/api/room'

export default {
 name: 'RoomEdit',
 props: {
    record: {
      type: [Object, String],
      default: ''
    }
  },
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
      isUpload: false,
      rid: ''
   };
 },

 components: {},

 computed: {},

 methods: {
   handleCancel() {
        //关闭酒店编辑框
        this.visible = false
        //清除上次编辑的数据
        this.isUpload = false
        this.defaultService = []
        this.defaultFacilities = []
        this.fileList = []
    },
    edit(record) {
        //显示编辑框
        this.visible = true
        //通过pick获取编辑record记录需要填充到表单的数据字段
        //注意：setFieldsValue(formData) 填充的数据必须和表单中的 输入元素必须一致
        const {
            form: { setFieldsValue }
        } = this
        const formData = pick(record, 
            ['rid', 'rname', 'people', 'assitions', 'cancel', 'breakfast', 'price', 'stock', 'img', 'type']
        )
        this.rid = formData.rid
        this.$nextTick(() => {
            setFieldsValue({
            'rname': formData.rname,
            'people': formData.people,
            'assitions': formData.assitions,
            'price': formData.price,
            'cancel': formData.cancel,
            'breakfast': formData.breakfast,
            'stock': formData.stock,
            'type': formData.type
            })
        })
        if(formData.img != null && formData.img != ""){
            let file = {
                uid: '-1',
                name: '房间图片',
                status: 'done',
                url: `/api${formData.img}`,
            }
            this.fileList.push(file)
        }
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
            updateRoom({'rid': this.rid, 'img': this.fileList[0].response.data.imgUrl}) //更新房间图片
        }
    },
    handleRemove(file) {
        //返回值为false不删除文件，true时删除文件
        /* if(file == undefined || file.response.data == undefined || file.response.data.imgUrl == "") {
            this.$message.error(`文件不存在！`)
            return false
        } */
        let filePath = file.response != undefined ? file.response.data.imgUrl : this.fileList[0].url.substring(4);
        deleteFile({"filePath" : filePath}).then(res => {
            if(res.success === true){
                updateRoom({'rid': this.rid, 'img': ''}) //更新房间图片
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
    handleSubmit() {
        const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        this.isUpload = this.fileList.length==0
        if (!errors && !this.isUpload) {
          let imgUrl = this.fileList[0].response != undefined ? this.fileList[0].response.data.imgUrl : this.fileList[0].url.substring(4)
          let parameter = {
            'rid': this.rid,
            'rname': values.rname,
            'people': values.people,
            'assitions': values.assitions,
            'cancel': values.cancel,
            'breakfast': values.breakfast,
            'price': values.price,
            'stock': values.stock,
            'type': values.type,
            'img': imgUrl
          }
          return updateRoom(parameter).then(res => {
            if (res.success === true) {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
              this.$message.success('更新房间成功！')
            } else {
              this.confirmLoading = false
              this.$message.error({
                message: '更新房间失败！'
              })
            }
          }).catch(err => {
              this.confirmLoading = false
              this.$message.error(`更新房间出错！: ${err.message}`)
          }) 
        } else {
            this.confirmLoading = false
        }
      })
    },
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