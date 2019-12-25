<!--  -->
<template>
<a-locale-provider :locale="zh_CN">
  <div>
    <a-card :busered="false" :bordered="false">
      <a-row :gutter="0">
        <a-col style="float:left;margin-top:20px;margin-bottom:-20px;">
          <a-dropdown>
            <a-menu slot="overlay" @click="handleMenuBatchClick">
              <a-menu-item key="enable"><a-icon type="unlock" theme="twoTone" twoToneColor="#00ffff"/>启用</a-menu-item>
              <a-menu-item key="disable"><a-icon type="lock" theme="twoTone" twoToneColor="#ffc0cb"/>停用</a-menu-item>
              <a-menu-item key="delete"><a-icon type="delete" theme="twoTone" twoToneColor="#ff0000"/>删除</a-menu-item>
            </a-menu>
            <a-button type="primary">
             <a-icon type="ordered-list" /> 批处理 <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </a-col>
        <a-col style="float:left;margin-top:20px;margin-bottom:-20px;margin-left:10px">
          <a-button type="primary" @click="handleSearch"><a-icon type="search" />查询</a-button>
        </a-col>
        <a-col style="float:left;margin-top:20px;margin-bottom:-20px;margin-left:10px">
          <a-button type="primary" @click="handleAdd"><a-icon type="plus" />添加管理员</a-button>
        </a-col>
      </a-row>
    </a-card>
    <!--
    rowKey:必须使用唯一标识的字段
        columns：表头及列信息
        data：表的数据源调用data属性中的loadData函数获取数据
        alert：数据表格的提示框,显示选中行数等信息
        rowSelection；表格选项列
        showPagination：显示分页
        那么columns、loadData、options都必须在对象的data属性中提前设置。
    -->
    <a-card :busered="false" :bordered="false">
      <s-table
        ref="table"
        size="default"
        rowKey="uid"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        showPagination="auto"
      >
        <!--slot卡槽扩展列表：-->
        <!--序号
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        -->
        <!--较长内容使用ellipsis插件省略显示-->
        <span slot="name" slot-scope="text">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </span>
        <!--用户类型：枚举适配显示-->
        <span slot="type" slot-scope="text">
          <a-tag :color="text | colorTypeFilter">{{text | typeFilter}}</a-tag>
        </span>
        <!--用户状态：枚举适配显示-->
        <span slot="status" slot-scope="text,record">
          <a-switch checkedChildren="启用" unCheckedChildren="停用" :checked="text" @change="changeStatus(!text,record)"/>
        </span>
        <!--操作以及事件绑定-->
        <span slot="check" slot-scope="text, record">
          <template>
            <a @click="handleCheck(record)" title="查看用户信息"><a-icon type="user" /></a>
            <a-divider type="vertical" />
              <a-popconfirm title="确认要删除该用户吗?" @confirm="handleDelete(record.uid)" cancelText="不要" okText="是的">
              <a title="删除用户"><a-icon type="delete" theme="twoTone" twoToneColor="#ff0000"/></a>
            </a-popconfirm>
            <!--
            <a-divider type="vertical" />
            <a @click="handleDelete(record.uid)"><a-icon type="ordered-list"/></a>
            -->
           </template>
        </span>
      </s-table>
      <user-check ref="checkModal"/>
      <user-search ref="searchModel" @search="searchUser" />
      <user-add ref="addModel" @add="addUser" />
    </a-card>
  </div>
</a-locale-provider>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import STable from '@/components/Table'
import Ellipsis from '@/components/Ellipsis'
import UserCheck from './form/UserCheck'
import UserSearch from './form/UserSearch'
import UserAdd from './form/UserAdd'
import { getUsers, deleteUser, deleteUserBatch, updateUser, updateUserStatusBatch } from '@/api/user'
import { parsePage } from '@/utils/pageable'
import {errorTipsMap } from '@/utils/errorTips'
const userTypeMap = {
  '0': {
    type: 'warning',
    text: '普通用户',
    color: 'cyan'
  },
  '1': {
    type: 'error',
    text: '管理员',
    color: 'red'
  }
}
export default {
  name: 'UserManage',
  // import引入的组件需要注入到对象中才能使用
  components: {
    STable,
    Ellipsis,
    UserCheck,
    UserSearch,
    UserAdd
  },
  data () {
    // 这里存放数据
    return {
      zh_CN,
      // 查询条件
      queryParams: { },
      columns: [
        {
          title: '用户id',
          width: '10%',
          dataIndex: 'uid'
        },
        {
          title: '用户名',
          dataIndex: 'uname',
          width: '16%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '邮箱',
          width: '16%',
          dataIndex: 'email'
        },
        {
          title: '电话',
          width: '14%',
          dataIndex: 'telephone',
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: '14%',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '状态',
          dataIndex: 'enable',
          width: '14%',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '查看/操作',
          dataIndex: 'check',
          width: '14%',
          scopedSlots: { customRender: 'check' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        console.log('loadData.queryParams', this.queryParams)
        return getUsers({ ...parameter, ...this.queryParams }).then(res => {
          if (res.success === true) {
            return { ...parsePage(res) }
          } else {
            return parsePage()
          }
        }).catch(ex => {
          return parsePage()
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  // 监听属性 类似于data概念
  computed: {

  },
  // 监控data中的数据变化
  watch: {

  },
  // 方法集合
  methods: {
    handleCheck (record) { // 点击查看用户信息
      this.$refs.checkModal.show(record)
    },
    handleSearch () { // 显示搜索框
      this.$refs.searchModel.show()
    },
    handleAdd(){
      this.$refs.addModel.show()
    },
    searchUser(params){ // 点击搜索事件
      this.queryParams.uname=0>=params.uname.length?null:params.uname;
      this.queryParams.email=0>=params.email?null:params.email;
      this.queryParams.telephone=0>=params.telephone?null:params.telephone;
      this.queryParams.type='null'===params.type?null:params.type;
      this.queryParams.enable='null'===params.enable?null:params.enable;
      this.$refs.table.refresh(true)
      this.$refs.searchModel.hide()
    },
    addUser(){
      this.$refs.addModel.hide()
      this.$refs.table.refresh(true)
    },
    handleDelete (recordId) {
      console.log(recordId)
      deleteUser(recordId).then(res => {
        if (res.success === true) {
          this.$notification.success({message: '删除成功'})
          this.$refs.table.refresh(true)
          return
        }
        this.$notification.error({message: `删除失败: ${errorTipsMap[res.data]}`})
      })
      .catch(ex => {
        this.$notification.error({message: '请求出现错误，请稍后再试'})
        console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    changeStatus (newEnable, record) {
      record.enable=newEnable
      updateUser(record).then(res => {
        if (res.success === true) {
          this.$notification.success({message: '更新成功'})
          this.$refs.table.refresh()
          return
        }
        this.$notification.error({message: `更新失败: ${errorTipsMap[res.data]}`})
      })
      .catch(ex => {
        this.$notification.error({message: '请求出现错误，请稍后再试'})
        console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    handleMenuBatchClick (menu) {
      if (this.selectedRowKeys.length < 1) {
        this.$notification.warning({message: '请选择数据'})
        return
      }
      if("enable"===menu.key){
        this.changeStatusBatch(true,this.selectedRows);
      }
      else if("disable"===menu.key){
        this.changeStatusBatch(false,this.selectedRows);
      }
      else if("delete"===menu.key){
        this.showDeleteBatchConfirm(this.handleDeleteBatch);
      }
    },
    changeStatusBatch (newEnable, records) {
      let uids=[]
      for(let len=records.length-1;len>=0;len--){
        uids.push(records[len].uid)
      }
      updateUserStatusBatch(uids,{status:newEnable}).then(res => {
        if (res.success === true) {
          this.$notification.success({message: '更新成功'})
          this.$refs.table.refresh()
          return
        }
        this.$notification.error({message: `更新失败: ${errorTipsMap[res.data]}`})
      })
      .catch(ex => {
        this.$notification.error({message: '请求出现错误，请稍后再试'})
        console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    showDeleteBatchConfirm (callback){
      this.$confirm({
        title: '确认要删除这些用户吗?',
        content: '',
        okText: '是的',
        okType: 'danger',
        cancelText: '不要',
        onOk() {
          callback()
        },
        onCancel() {},
      });
    },
    handleDeleteBatch () {
      deleteUserBatch(this.selectedRowKeys).then(res => {
        if (res.success === true) {
          this.selectedRowKeys=[]
          this.$notification.success({message: '删除成功'})
          this.$refs.table.refresh(true)
          return
        }
        this.$notification.error({message: `更新失败: ${errorTipsMap[res.data]}`})
      })
      .catch(ex => {
        this.$notification.error({message: '请求出现错误，请稍后再试'})
        console.log('请求出现错误，请稍后再试',ex.message)
      })
    },
    // 时间区间日历组件发送改变时 重新生成查询条件
    onChange (dates, dateStrings) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
      this.queryParam = {
        createTimeStart: dateStrings[0],
        createTimeEnd: dateStrings[1]
      }
    },
    // 表单和查询条件重置
    resetSearchForm () {
      this.queryParam.uname=null,
      this.queryParam.type='null',
      this.queryParam.enable='null'
    },
    tableOption () {
      // 表格选项
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                // Column configuration not to be checked
                // disabled: record.no === 'No 2',
                // name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      // 表格行选中改变
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.tableOption()	// 初始化表格选项
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {}, // 如果页面有keep-alive缓存功能，这个函数会触发
  filters: {
    typeFilter (type) {
      return userTypeMap[type].text
    },
    statusTypeFilter (type) {
      return userTypeMap[type].type
    },
    colorTypeFilter (type) {
      return userTypeMap[type].color
    }
  }
}
</script>
<style>


</style>
