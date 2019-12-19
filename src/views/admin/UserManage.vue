<!--  -->
<template>
  <a-card :busered="false">
    <!--
      advanced:高级查询切换显示
      toggleAdvanced:切换的方法控制advanced
      resetSearchForm:重置查询表单
    -->
    <!--<div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="订单编号">
              <a-input v-model="queryParam.userNumber" placeholder />
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item
                label="起止日期"
                :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
              >
                <a-range-picker
                  v-model="createTime"
                  name="createTime"
                  style="width: 100%"
                  format="YYYY/MM/DD HH:mm:ss"
                  showTime
                  @change="onChange"
                  v-decorator="[
                    'buildTime',
                    {rules: [{ required: true, message: '请选择起止日期' }]}
                  ]"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>-->
    <!--
		rowKey:必须使用唯一标识的字段
        columns：表头及列信息
        data：表的数据源调用data属性中的loadData函数获取数据
        alert：数据表格的提示框,显示选中行数等信息
        rowSelection；表格选项列
        showPagination：显示分页
        那么columns、loadData、options都必须在对象的data属性中提前设置。
    -->
    <!--
    <a-button type="danger" @click="handleBatchDelete">批量删除</a-button>
    -->
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <!--slot卡槽扩展列表：-->
      <!--序号-->
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <!--较长内容使用ellipsis插件省略显示-->
      <span slot="name" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <!--用户类型：枚举适配显示-->
      <span slot="type" slot-scope="text">
        <a-tag :color="text | colorTypeFilter">{{text | typeFilter}}</a-tag>
        <!--
        <a-badge :status="text | statusTypeFilter" :text="text | typeFilter" />
        -->
      </span>
      <!--用户状态：枚举适配显示-->
      <span slot="status" slot-scope="text,record">
        <a-switch checkedChildren="启用" unCheckedChildren="停用" :checked="text" @change="changeStatus(!text,record)"/>
        <!-- 
        <a-badge :status="text | statusEnableFilter" :text="text | enableFilter" />
        -->
      </span>
      <!--操作以及事件绑定-->
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.uid)">删除</a>
        </template>
      </span>
    </s-table>
    <user-edit ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import STable from '@/components/Table'
import Ellipsis from '@/components/Ellipsis'
import { getUsers, deleteUser, deleteUserBatch, updateUser } from '@/api/user'
import { parsePage } from '@/utils/pageable'
import UserEdit from './form/UserEdit'
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
// const userEnableMap = {
//   false: {
//     status: false,
//     // status: 'warning',
//     text: '不可用'
//   },
//   true: {
//     status: true,
//     // status: 'error',
//     text: '可用'
//   }
// }
export default {
  name: 'UserManage',
  // import引入的组件需要注入到对象中才能使用
  components: {
    STable,
    Ellipsis,
    UserEdit
  },
  	// private Long uid; //用户主键
	// private String uname; //用户名
	// private String upassword; //用户密码
	// private String salt; //用户密码盐
	// private String email; //用户邮箱
	// @Size(min=11,max=11)
	// private String telephone; //用户电话
	// private Integer type; //用户类型（0表示普通用户、1表示管理员）
	// private String icon; //用户头像
	// private Boolean enable; //用户可用性（0表示不可用，1表示可用）
  data () {
    // 这里存放数据
    return {
      // 快捷查询和高级查询切换
      advanced: false,
      // 查询条件
      queryParam: {},
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '用户id',
          dataIndex: 'uid'
        },
        {
          title: '用户名',
          dataIndex: 'uname',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '电话',
          dataIndex: 'telephone',
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '状态',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'status' },
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getUsers({ ...parameter, ...this.queryParam }).then(res => {
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
    handleEdit (record) {
      console.log(record)
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    handleDelete (recordId) {
      console.log(recordId)
      deleteUser(recordId).then(res => {
        if (res.success === true) {
          this.$notification.success({
            message: '删除成功'
          })
          this.$refs.table.refresh(true)
        }
      })
        .catch(err => {
          $message.error(`删除失败: ${err.message}`)
        })
    },
    handleBatchDelete () {
      if (this.selectedRowKeys.length < 1) {
        this.$notification.warning({
          message: '请选择数据'
        })
        return
      }
      deleteBatchUser(this.selectedRowKeys).then(res => {
        console.log(res)
        if (res.success === true) {
          this.selectedRowKeys = []
          this.$notification.success({
            message: '删除成功'
          })
          this.$refs.table.refresh(true)
        }
      })
        .catch(err => {
          $message.error(`删除失败: ${err.message}`)
        })
    },
    changeStatus (newEnable, record) {
      record.enable=newEnable
      updateUser(record).then(res => {
        if (res.success === true) {
          this.$notification.success({
            message: '更新成功'
          })
          this.$refs.table.refresh(true)
        }
      })
        .catch(err => {
          $message.error(`更新失败: ${err.message}`)
        })
    },
    // 时间区间日历组件发送改变时 重新生成查询条件
    // onChange (dates, dateStrings) {
    //   console.log('From: ', dates[0], ', to: ', dates[1])
    //   console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    //   this.queryParam = {
    //     createTimeStart: dateStrings[0],
    //     createTimeEnd: dateStrings[1]
    //   }
    // },
    // 切换方法
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 表单和查询条件重置
    // resetSearchForm () {
    //   this.queryParam = {}
    //   this.createTime = undefined
    // },
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
    // ,
    // enableFilter (type) {
    //   return userEnableMap[type].text
    // },
    // statusEnableFilter (type) {
    //   return userEnableMap[type].status
    // }
  }
}
</script>
<style>

</style>
