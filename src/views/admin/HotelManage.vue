<template>
 <a-card :bordered="false">
   <div style="margin-bottom: 16px">
     <a-popconfirm title="确认删除所选数据?" okText="是" cancelText="否" @confirm="handleDeleteAll" >
      <a-button type="danger" :loading="loading">
        批量删除
      </a-button>
     </a-popconfirm>
     <a-divider type="vertical" />
     <a-button type="primary" @click="handleAdd">
        添加酒店
    </a-button>
   </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      showPagination="auto"
    >
      <span slot="img">
        <img style="width:100px;heigth:100px" src="@/assets/hotel-demo1.jpg" />
      </span>
      <!--3.较长内容使用ellipsis插件省略显示-->
      <span slot="description" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <!-- <span slot="createTime" slot-scope="text">{{ text | moment('YYYY/MM/DD hh:mm:ss') }}</span>
      <span slot="orderStatus" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span> -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleAddRoom(record.id)">添加房型</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除数据?" okText="是" cancelText="否" @confirm="handleDelete(record.id)" >
           <a style="color: red;">删除</a>
          </a-popconfirm>
        </template>
      </span>
      <!-- 使用编辑子组件 ref绑定子组件的名字 -->
    </s-table>
    <!-- <order-edit ref="editModal" @ok="handleOk" />
    <order-add ref="addModal" @ok="handleOk" /> -->
  </a-card>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import STable from '@/components/Table'
import Ellipsis from '@/components/Ellipsis'
import { getHotelList, deleteHotel, deleteHotelAll } from '@/api/hotel'
import { parsePage } from '@/utils/pageable'


export default {
 name: 'HotelManage',
 components: {
   STable,
   Ellipsis
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
          title: '图片',
          dataIndex: 'img',
          align: 'center',
          scopedSlots: { customRender: 'img' }
        },
        {
          title: '酒店名字',
          dataIndex: 'hname',
          align: 'center'
        },
        {
          title: '地址',
          dataIndex: 'address',
          align: 'center'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: '服务',
          align: 'center',
          dataIndex: 'service',
        },
        {
          title: '设施',
          dataIndex: 'facilities',
          align: 'center'
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          align: 'center'
        },
        {
          title: '评分',
          dataIndex: 'rate',
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getHotelList({ ...parameter, ...this.queryParam }).then(res => {
            if (res.success === true) {
              return { ...parsePage(res) }
            } else {
              return parsePage()
            }
        }).catch(ex => {
          return parsePage()
        })
        // return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
        //  return res.result
        // })
      },
      selectedRowKeys: [],
      optionAlertShow: false,
      loading: false
    }
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleEdit(record) {
      console.log(`编辑酒店${record.id}`)
    },
    handleDelete(id) {
      console.log(`删除酒店${id}`)
    },
    handleAddRoom(id) {
      console.log(`酒店${id}进行添加房型操作`)
    },
    handleDeleteAll() {
      if(this.selectedRowKeys=="") {
        this.$message.warning('请选择要删除的数据');
      }else{
        console.log(`批量删除酒店${this.selectedRowKeys}`)
      }
    },
    handleAdd() {
      console.log(`添加酒店操作`)
    }
  }
}

</script>
<style scoped>
</style>