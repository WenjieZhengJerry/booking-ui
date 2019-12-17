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
      rowKey="hid"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      showPagination="auto"
    >
      <!-- <span slot="img" slot-scope="text">
        <img style="width:100px;heigth:100px" :src=text />
      </span> -->
      <!--1.较长内容使用ellipsis插件省略显示-->
      <span slot="description" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <!-- 2.酒店类型：枚举适配显示 -->
      <span slot="type" slot-scope="text">
        {{text | typeFilter}}
      </span>
      <!-- <span slot="createTime" slot-scope="text">{{ text | moment('YYYY/MM/DD hh:mm:ss') }}</span>
      <span slot="orderStatus" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span> -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleAddRoom(record.id)" title="查看酒店房型"><a-icon type="eye" /></a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)" title="编辑酒店"><a-icon type="edit"/></a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除数据?" okText="是" cancelText="否" @confirm="handleDelete(record.hid)" >
           <a style="color: red;" title="删除酒店"><a-icon type="delete" /></a>
          </a-popconfirm>
        </template>
      </span>
      <!-- 使用编辑子组件 ref绑定子组件的名字 -->
    </s-table>
    <!-- <order-edit ref="editModal" @ok="handleOk" />-->
    <hotel-add ref="addModal" @ok="handleOk" /> 
  </a-card>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import STable from '@/components/Table'
import Ellipsis from '@/components/Ellipsis'
import { getHotelList, deleteHotel, deleteHotelAll } from '@/api/hotel'
import { parsePage } from '@/utils/pageable'
import HotelAdd from './form/HotelAdd'

const hotelTypeMap = {
  APARTMENT: {
    text: '公寓'
  },
  HOMESTAY: {
    text: '民宿'
  },
  HOSTEL: {
    text: '青旅'
  },
  ECONOMY: {
    text: '经济连锁'
  },
  HIGNEND: {
    text: '高级连锁'
  }
}

export default {
 name: 'HotelManage',
 components: {
   STable,
   Ellipsis,
   HotelAdd
 },
 filters: {
   typeFilter (type) {
     return hotelTypeMap[type].text
   }
 },
 data () {
  return {
      zh_CN,
      columns: [
        {
          title: '主键',
          dataIndex: 'hid',
          align: 'center'
        },
        {
          title: '图片',
          dataIndex: 'img',
          align: 'center',
          customRender: (text) => {
            let url = "/api" + text
            return <img style="width:100px;height:80px;" src={url} />
          },
          //scopedSlots: { customRender: 'img' }
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
          align: 'center',
          width: '80px',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getHotelList({ "sortField":"hid", ...parameter, ...this.queryParam }).then(res => {
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
    handleOk() {
      this.$refs.table.refresh()
    },
    handleEdit(record) {
      console.log(`编辑酒店${record.id}`)
    },
    handleDelete(id) {
      console.log(`删除酒店${id}`)
      deleteHotel(id).then(res => {
        if(res.success === true) {
          this.$notification.success({
            message: "删除成功!"
          })
        }
        this.$refs.table.refresh(true)
      }).catch( err => {
        this.$message.error(`删除失败: ${err.message}`)
      })
    },
    handleAddRoom(id) {
      console.log(`酒店${id}进行添加房型操作`)
    },
    handleDeleteAll() {
      if(this.selectedRowKeys=="") {
        this.$message.warning('请选择要删除的数据')
      }else{
        this.loading = true
        deleteHotelAll({ 'ids':this.selectedRowKeys.join(",") }).then(res => {
          console.log(`批量删除酒店${this.selectedRowKeys}`)
          if(res.success === true) {
            this.$notification.success({
              message: "批量删除成功！"
            })
            this.loading = false
          }
          this.selectedRowKeys = []
          this.$refs.table.refresh(true)
        }).catch(err => {
          this.loading = false
          this.$message.error(`批量删除失败: ${err.message}`)
        })
      }
    },
    handleAdd() {
      console.log(`添加酒店操作`)
      this.$refs.addModal.add()
    }
  }
}

</script>
<style scoped>
</style>