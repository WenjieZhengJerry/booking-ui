<!--添加酒店页面-->
<template>
 <div>
    <!--
        visible:是否显示当前a-modal
        confirmLoading:加载动画效果
         @ok="handleSubmit"         提交表单数据给后台
         @cancel="handleCancel"     this.visible=false
    -->
    <a-modal
      title="添加酒店"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="酒店名字" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="酒店名字" v-decorator="['hname',
            {rules: [{required: true, message: '请输入酒店名字'}]}]"></a-input>
          </a-form-item>

          <a-form-item label="酒店品牌" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="酒店品牌" v-decorator="['brand',
            {rules: [{required: true, message: '请输入酒店品牌'}]}]"></a-input>
          </a-form-item>

          <a-form-item label="酒店地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="酒店地址"
              v-decorator="['address',
              {rules: [{ required: true, message: '地址不能为空' }]}]"
            ></a-input>
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
            {initialValue: description, rules: [{required: true, message: '请输入酒店描述'}]}]" autosize />
            <!-- <a-input placeholder="酒店描述" v-model="description"></a-input> -->
          </a-form-item>

          <a-form-item label="酒店服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
             <a-checkbox-group :options="service"
             v-decorator="['service',
             {rules: [{required: true, message: '请选择酒店服务'}]}]" />
             <!-- <a-checkbox-group :options="service" v-model="checkedServiceList" @change="onSeriveChange" /> -->
          </a-form-item>

          <a-form-item label="酒店设施" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-checkbox-group :options="facilities"
            v-decorator="['facilities',
            {rules: [{required: true, message: '请选择酒店设施'}]}]" />
          </a-form-item>

          <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="联系电话"
              v-decorator="['phone',
              {rules: [{required: true, message: '请输入联系电话'},{validator: handleCheckPhone}]}]"
            ></a-input>
          </a-form-item>

          <a-form-item label="酒店类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['type', 
            {initialValue: 'APARTMENT',rules: [{required: true, message: '请选择酒店类型'}]}]" 
            placeholder="请选择">
              <a-select-option value="APARTMENT">公寓</a-select-option>
              <a-select-option value="HOMESTAY">民宿</a-select-option>
              <a-select-option value="HOSTEL">青旅</a-select-option>
              <a-select-option value="ECONOMY">经济连锁</a-select-option>
              <a-select-option value="HIGNEND">高级连锁</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="酒店位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-decorator="['location', 
            {initialValue: 'LANDMARK',rules: [{required: true, message: '请选择酒店位置'}]}]" 
            placeholder="请选择">
              <a-select-option value="LANDMARK">商圈/地标</a-select-option>
              <a-select-option value="AIRPORT">机场/火车站</a-select-option>
              <a-select-option value="TRANSPRORTATION">轨道交通</a-select-option>
              <a-select-option value="ADMINISTRATIVE">行政区</a-select-option>
              <a-select-option value="VIEWPOINT">景点</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { uploadImg, deleteFile } from '@/api/upload'
import { addHotel } from '@/api/hotel'

export default {
 name: 'HotelAdd',
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
      description: "于2010年开业，东莞市维也纳国际酒店旗舰店，适合广大人群入驻",
      facilities: ['停车场', '餐厅', '健身房'],
      service: ['接待外宾', '叫醒服务'],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      loading: false,
      isUpload: false
   };
 },

 components: {},

 computed: {},

 methods: {
    add() {
      this.visible = true
      this.form.resetFields()
      //解决每次打开添加酒店表单时遗留上次的图片数据和校验提示
      this.fileList = []
      this.isUpload = false
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
        this.isUpload = this.fileList.length==0
        if (!errors && !this.isUpload) {
          let imgUrl = this.fileList[0].response.data.imgUrl
          let parameter = {
            'hname': values.hname,
            'brand': values.brand,
            'location': values.location,
            'description': values.description,
            'facilities': values.facilities.toString(),
            'service': values.service.toString(),
            'type': values.type,
            'address': values.address,
            'phone': values.phone,
            'address': values.address,
            'img': imgUrl,
            'rate': 5.0,
            'brand': values.brand
          }
          return addHotel(parameter).then(res => {
            if (res.success === true) {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
              this.$message.success('添加酒店成功！')
            } else {
              this.confirmLoading = false
              this.$message.error({
                message: '添加酒店失败！'
              })
            }
          }).catch(err => {
              this.confirmLoading = false
              this.$message.error(`添加酒店出错！: ${err.message}`)
          }) 
        } else {
            this.confirmLoading = false
        }
      })
    },
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
        //图片上传成功后将文件上传警告去除
        if(file.status == "done") {
            this.isUpload = false
        }
    },
    handleRemove(file) {
        //返回值为false不删除文件，true时删除文件
        if(file.response.data==undefined||file.response.data.imgUrl=="") {
            this.$message.error(`文件不存在！`)
            return false
        }
        let filePath = file.response.data.imgUrl;
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