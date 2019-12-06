<template>
<a-locale-provider :locale="zh_CN">
 <a-card :bordered="false">
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-row :gutter="24">
        <a-col key="1" :span="8" >
          <a-form-item label="订单编号">
            <a-input allowClear v-decorator="['orderNumber']" />
          </a-form-item>
        </a-col>
        <a-col key="2" :span="8" >
          <a-form-item label="用户姓名">
            <a-input allowClear v-decorator="['uName']" />
          </a-form-item>
        </a-col>
        <a-col key="3" :span="8" >
          <a-form-item label="入住时间">
            <a-date-picker v-decorator="['startTime']" style="width: 200px" />
          </a-form-item>
        </a-col>
        <a-col key="4" :span="8" >
          <a-form-item label="订单状态">
            <a-select 
              v-decorator="[
                'orderStatus',
                {
                  initialValue: 'all'
                }
              ]" style="width: 200px"
            >
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="unuse">待入住</a-select-option>
              <a-select-option value="unpay">待付款</a-select-option>
              <a-select-option value="success">已完成</a-select-option>
              <a-select-option value="cancel">已取消</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col key="5" :span="8" >
          <a-form-item label="酒店名称">
            <a-select 
              v-decorator="[
                'hName',
                {
                  initialValue: 'all'
                }
              ]" style="width: 200px"
            >
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="hotel1">维也纳国际酒店</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col key="6" :span="8" >
          <a-form-item label="金额区间">
            <a-input-number v-decorator="['minPrice']" :min="0" :max="9999" />
            -
            <a-input-number v-decorator="['maxPrice']" :min="0" :max="9999" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'right' }">
          <a-popconfirm @confirm="DeleteIds()">
            <template slot="title">
              是否要删除所选？
            </template> 
            <a-button :disabled="isDelete" type="danger">
              <a-icon type="delete" />
              批量删除
            </a-button>
          </a-popconfirm>
          <a-button type="primary" html-type="submit" :style="{ marginLeft: '8px' }">
            查询
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            重置
          </a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
    <!--
		rowKey:必须使用唯一标识的字段
        columns：表头及列信息
        data：表的数据源调用data属性中的loadData函数获取数据
        alert：数据表格的提示框,显示选中行数等信息
        rowSelection；表格选项列
        showPagination：显示分页
        那么columns、loadData、options都必须在对象的data属性中提前设置。
    -->
    <s-table
      ref="table"
      size="default"
      rowKey="oid"
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
      <span slot="status" slot-scope="text">
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
  SUCCESS: {
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
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      isDelete: true,
      columns: [
        {
          title: '订单编号',
          dataIndex: 'oid',
          align: 'center'
        },
        {
          title: '酒店',
          dataIndex: 'hotel.hname',
          align: 'center'
        },
        {
          title: '入住人',
          dataIndex: 'user.uname',
          align: 'center'
        },
        {
          title: '总价',
          dataIndex: 'totalprice',
          sorter: true,
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'status' }
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
              console.log("我成功了")
              return { ...parsePage(res) }
            } else {
              console.log("我失败了")
              return parsePage()
            }
          })
          .catch(ex => {
            console.log("我异常了" + ex)
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
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
      });
    },

    handleReset() {
      this.form.resetFields();
    },

    handleDetail (record) {
      console.log(record)
      this.$refs.modal.edit(record)
    },
    // 单项删除
    handleDelete (record) {
      deleteOrder(record.oid)
        .then(res => {
          if (res.success === true) {
            this.$notification.success({
              message: '删除成功'
            })
            this.$refs.table.refresh(true)
          }
        })
        .catch(err => {
          this.$message.error(`删除订单失败: ${err.message}`)
        })
    },
    // 批量删除
    DeleteIds () {
      let ids = []
      for (let i = 0; i < this.selectedRows.length; i++) {
        ids.push(this.selectedRows[i].oid)
      }
      deleteIds(ids)
        .then(res => {
          if (res.success === true) {
            this.$notification.success({
              message: '删除成功'
            })
            this.selectedRowKeys.length = 0
            this.selectedRows.length = 0
            this.isDelete = true
            this.$refs.table.refresh(true)
          }
        })
        .catch(err => {
          this.$message.error(`批量删除失败: ${err.message}`)
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
      this.selectedRowKeys.length > 0 ? this.isDelete = false : this.isDelete = true
    }
  },
  created: function () {
    this.tableOption() // 初始化表格选项
  }
}

</script>
<style scoped>
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search {
  margin-bottom: 15px;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
</style>