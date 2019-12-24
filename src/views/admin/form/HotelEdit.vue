<!--编辑酒店-->
<template>
 <div>
    <!--
        visible:是否显示当前a-modal
        confirmLoading:加载动画效果
         @ok="handleSubmit"         提交表单数据给后台
         @cancel="handleCancel"     this.visible=false
    -->
    <a-modal
      title="编辑酒店"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="酒店名字" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['hname',
            {rules: [{required: true, message: '请输入酒店名字'}]}]"></a-input>
          </a-form-item>

          <a-form-item label="酒店地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :maxLength="11" v-decorator="['address',
            {rules: [{required: true, message: '请输入酒店地址'}]}]"></a-input>
          </a-form-item>

          <a-form-item label="酒店图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
                <img alt="酒店图片" style="width: 100%" :src="previewImage" />
            </a-modal>
            <span v-show="isUpload" class="uploadValidator">请上传图片</span>
          </a-form-item>

          <a-form-item label="酒店描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-textarea placeholder="酒店描述"
            v-decorator="['description',
            {rules: [{required: true, message: '请输入酒店描述'}]}]" autosize />
          </a-form-item>

          <a-form-item label="酒店服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-checkbox-group :options="service"
             v-decorator="['service',
             {initialValue: defaultService, rules: [{required: true, message: '请选择酒店服务'}]}]" />
          </a-form-item>

          <a-form-item label="酒店设施" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-checkbox-group :options="facilities"
            v-decorator="['facilities',
            {initialValue: defaultFacilities, rules: [{required: true, message: '请选择酒店设施'}]}]" />
          </a-form-item>

          <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['phone',
            {rules: [{required: true, message: '请输入联系电话'},{validator: handleCheckPhone}]}]"></a-input>
          </a-form-item>

          <a-form-item label="酒店评分" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['rate',
            {rules: [{required: true, message: '请选择酒店评分'}]}]"></a-input>
          </a-form-item>

          <a-form-item label="酒店类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['type', 
            {initialValue: 'type',rules: [{required: true, message: '请选择酒店类型'}]}]" 
            placeholder="请选择">
              <a-select-option value="APARTMENT">公寓</a-select-option>
              <a-select-option value="HOMESTAY">民宿</a-select-option>
              <a-select-option value="HOSTEL">青旅</a-select-option>
              <a-select-option value="ECONOMY">经济连锁</a-select-option>
              <a-select-option value="HIGNEND">高级连锁</a-select-option>
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
import { updateHotel } from '@/api/hotel'

export default {
 name: 'HotelEdit',
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
      previewImage: '',
      facilities: ['停车场', '餐厅', '健身房'],
      service: ['接待外宾', '叫醒服务'],
      defaultService: [],
      defaultFacilities: [],
      hid: ''
   };
 },

 components: {},

 computed: {},

 methods: {
    handleCancel() {
        //关闭酒店编辑框
        this.visible = false
    },
    edit(record) {
        //显示编辑框
        this.visible = true
        //清除上次编辑的数据
        this.isUpload = false
        this.defaultService = []
        this.defaultFacilities = []
        this.fileList = []
        //通过pick获取编辑record记录需要填充到表单的数据字段
        //注意：setFieldsValue(formData) 填充的数据必须和表单中的 输入元素必须一致
        const {
            form: { setFieldsValue }
        } = this
        const formData = pick(record, 
            ['hid', 'hname', 'address', 'img', 'description', 'service', 'facilities', 'phone', 'type', 'rate']
        )
        if(formData.img != null && formData.img != ""){
            let file = {
                uid: '-1',
                name: '酒店图片',
                status: 'done',
                url: `/api${formData.img}`,
            }
            this.fileList.push(file)
        }
        this.defaultService = formData.service.split(',')
        this.defaultFacilities = formData.facilities.split(',')
        this.hid = formData.hid
        this.$nextTick(() => {
            setFieldsValue({
            'hname': formData.hname,
            'address': formData.address,
            'description': formData.description,
            'phone': formData.phone,
            'rate': formData.rate,
            'type': formData.type
            })
        })
    },
    /*-----------文件上传相关函数--------------*/
    handleData() {
        //console.log(`设置文件上传参数`)
        return {
            directoryName: "hotel",
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
            updateHotel({'hid': this.hid, 'img': this.fileList[0].response.data.imgUrl}) //更新酒店图片
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
                updateHotel({'hid': this.hid, 'img': ''}) //更新酒店图片
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
            'hid': this.hid,
            'hname': values.hname,
            'description': values.description,
            'facilities': values.facilities.toString(),
            'service': values.service.toString(),
            'type': values.type,
            'address': values.address,
            'phone': values.phone,
            'img': imgUrl,
            'rate': values.rate
          }
          return updateHotel(parameter).then(res => {
            if (res.success === true) {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
              this.$message.success('更新酒店成功！')
            } else {
              this.confirmLoading = false
              this.$message.error({
                message: '更新酒店失败！'
              })
            }
          }).catch(err => {
              this.confirmLoading = false
              this.$message.error(`更新酒店出错！: ${err.message}`)
          }) 
        } else {
            this.confirmLoading = false
        }
      })
    },
    handleCheckPhone(rule, value, callback) {
      //验证联系电话
      if (value!="" && (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) || /0\\d{2,3}-\\d{7,8}/.test(value))) {
        callback('请输入正确的联系电话')
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