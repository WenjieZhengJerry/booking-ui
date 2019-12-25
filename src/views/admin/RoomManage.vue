<!--房型管理-->
<template>
 <div>
   <router-link :to="{name: 'HotelManage'}" title="返回酒店管理">
      <a-icon type="rollback" :style="{ fontSize: '30px' }"/>&nbsp;&nbsp;&nbsp;返回酒店管理
   </router-link><br><br>

   <div style="margin-bottom: 16px">
     <a-popconfirm title="确认删除所选数据?" okText="是" cancelText="否" @confirm="handleDeleteAll" >
      <a-button type="danger" :loading="loading">
        批量删除
      </a-button>
     </a-popconfirm>
     <a-divider type="vertical" />
     <a-button type="primary" @click="handleAdd">
        添加房间
    </a-button>
   </div>
    <s-table
      ref="table"
      size="default"
      rowKey="rid"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      showPagination="auto"
    >
      <!-- <span slot="img" slot-scope="text">
        <img style="width:100px;heigth:100px" :src=text />
      </span> -->
      <!--1.较长内容使用ellipsis插件省略显示-->
      <span slot="assitions" slot-scope="text">
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
          <a @click="handleEdit(record)" title="编辑房间"><a-icon type="edit"/></a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除数据?" okText="是" cancelText="否" @confirm="handleDelete(record.rid)" >
           <a style="color: red;" title="删除房间"><a-icon type="delete" /></a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <!-- 使用编辑子组件 ref绑定子组件的名字 -->
    <room-add ref="addModal" @ok="handleOk" />
    <room-edit ref="editModal" @ok="handleOk" />  
 </div>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import STable from '@/components/Table'
import Ellipsis from '@/components/Ellipsis'
import { parsePage } from '@/utils/pageable'
import { getRoomList, deleteRoom, deleteRoomAll } from '@/api/room'
import RoomEdit from './form/RoomEdit'
import RoomAdd from './form/RoomAdd'

const roomTypeMap = {
  STANDARD: {
    text: '标准房'
  },
  SUPERIOR: {
    text: '高级房'
  },
  DELUXE: {
    text: '豪华房'
  },
  BUSINESS: {
    text: '商务房'
  }
}

export default {
 name: 'RoomManage',
 components: {
    STable,
    Ellipsis,
    RoomEdit,
    RoomAdd
 },
 filters: {
   typeFilter (type) {
     return roomTypeMap[type].text
   }
 },
 data () {
    return {
      zh_CN,
      columns: [
        {
          title: '主键',
          dataIndex: 'rid',
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
          title: '房间名字',
          dataIndex: 'rname',
          align: 'center'
        },
        {
          title: '人数上限',
          dataIndex: 'people',
          align: 'center'
        },
        {
          title: '详情',
          dataIndex: 'assitions',
          align: 'center',
          scopedSlots: { customRender: 'assitions' }
        },
        {
          title: '取消策略',
          dataIndex: 'cancel',
          align: 'center',
        },
        {
          title: '早餐',
          dataIndex: 'breakfast',
          align: 'center'
        },
        {
          title: '价格（单价：元）',
          dataIndex: 'price',
          align: 'center'
        },
        {
          title: '库存',
          dataIndex: 'stock',
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
        //console.log('loadData.parameter', parameter)
        /* this.form.validateFields((error, values) => {
          this.queryParam = values
          //console.log(`查询条件${this.queryParam.hidKey}`)
        }) */
        return getRoomList({ "sortField":"rid", ...parameter, "hid": this.hid }).then(res => {
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
      hid: this.$route.params.hid,
      selectedRowKeys: [],
      optionAlertShow: false,
      loading: false
   };
 },

 computed: {},

 methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    handleEdit(record) {
      //console.log(`编辑房间${record.img}`)
      this.$refs.editModal.edit(record)	//4.打开编辑表单
    },
    handleDelete(id) {
      //console.log(`删除房间${id}`)
      deleteRoom(id).then(res => {
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
    handleDeleteAll() {
      if(this.selectedRowKeys=="") {
        this.$message.warning('请选择要删除的数据')
      }else{
        this.loading = true
        deleteRoomAll({ 'ids':this.selectedRowKeys.join(",") }).then(res => {
          //console.log(`批量删除房间${this.selectedRowKeys}`)
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
    /*打开添加房间窗口*/
    handleAdd() {
      console.log(this.hid)
      this.$refs.addModal.add(this.hid)
    }
 }
}

</script>

<style scoped>

</style>