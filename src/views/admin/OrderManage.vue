<template>
<a-locale-provider :locale="zh_CN">
 <a-card :bordered="false">
    <!--
		rowKey:必须使用唯一标识的字段
        columns：表头及列信息
        data：表的数据源调用data属性中的loadData函数获取数据
        alert：数据表格的提示框,显示选中行数等信息
        rowSelection；表格选项列
        showPagination：显示分页
        那么columns、loadData、options都必须在对象的data属性中提前设置。
    -->
    <a-button v-if="selectedRowKeys.length > 0">
      <a-icon type="delete" />
      <a-popconfirm title="是否要删除所选？" @confirm="DeleteIds()">
        <a>批量删除</a>
      </a-popconfirm>
    </a-button>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="true"
    >
      <!--slot卡槽扩展列表：-->
      <!--1.序号-->
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <!-- 2.订单状态：枚举适配显示 -->
      <span slot="orderStatus" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <!--3.较长内容使用ellipsis插件省略显示-->
      <span slot="description" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <!--4.操作以及事件绑定-->
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
  </a-card>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import STable from '@/components/Table'
import Ellipsis from '@/components/Ellipsis'
import { getOrderList, deleteOrder, deleteIds } from '@/api/order'
import { parsePage, toOffsetParam } from '@/utils/pageable'

const orderStatusMap = {
  UNPAY: {
    status: 'warning',
    text: '待付款'
  },
  UNUSE: {
    status: 'processing',
    text: '待入住'
  },
  CANCEL: {
    status: 'default',
    text: '已取消'
  },
  FINISH: {
    status: 'success',
    text: '已完成'
  }
}

export default {
 name: 'OrderManage',
 components: {
    STable,
    Ellipsis,
    getOrderList,
    deleteOrder,
    deleteIds
  },
  filters: {
    statusFilter (type) {
      return orderStatusMap[type].text
    },
    statusTypeFilter (type) {
      return orderStatusMap[type].status
    }
  },
  data () {
    return {
      zh_CN,
      columns: [
        {
          title: '主键',
          dataIndex: 'id',
          align: 'center'
        },
        {
          title: '订单编号',
          dataIndex: 'orderNumber',
          align: 'center'
        },
        {
          title: '酒店',
          dataIndex: 'hotel',
          align: 'center'
        },
        {
          title: '入住人',
          dataIndex: 'uName',
          align: 'center'
        },
        {
          title: '金额',
          dataIndex: 'amount',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'orderStatus',
          align: 'center',
          scopedSlots: { customRender: 'orderStatus' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      // 加载数据方法 必须为 Promise 对象，此处先返回空集合
      loadData: parameter => {
        return getOrderList({ ...parameter, ...this.queryParam })
          .then(res => {
            if (res.success === true) {
              return { ...parsePage(res) }
            } else {
              return parsePage()
            }
          })
          .catch(ex => {
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
  methods: {
    handleDetail (record) {
      console.log(record)
      this.$refs.modal.edit(record)
    },
    // 单项删除
    handleDelete (record) {
      deleteOrder(record.id)
        .then(res => {
          if (res.success === true) {
            this.$notification.success({
              message: '删除成功'
            })
            this.$refs.table.refresh(true)
          }
        })
        .catch(err => {
          this.$message.error(`delete order err: ${err.message}`)
        })
    },
    // 批量删除
    DeleteIds () {
      deleteIds(this.selectedRowKeys)
        .then(res => {
          if (res.success === true) {
            this.$notification.success({
              message: '删除成功'
            })
            this.selectedRowKeys = []
            this.selectedRows = []
            this.$refs.table.refresh(true)
          }
        })
        .catch(err => {
          this.$message.error(`delete order err: ${err.message}`)
        })
    },
    tableOption () {
      //    表格选项
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: false,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
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
  created: function () {
    this.tableOption() // 初始化表格选项
  }
}

</script>
<style scoped>
</style>