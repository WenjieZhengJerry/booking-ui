<template>
 <a-card :bordered="false">
   <!-- 多条件查询开始 -->

  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-row :gutter="24">
        <a-col key="1" :span="8" >
          <a-form-item label="酒店编号">
            <a-input allowClear v-decorator="['hidKey']" />
          </a-form-item>
        </a-col>
        <a-col key="2" :span="8" >
          <a-form-item label="酒店名字">
            <a-input allowClear v-decorator="['hnameKey']" />
          </a-form-item>
        </a-col>
        <a-col key="3" :span="8" >
          <a-form-item label="酒店地址">
            <a-input allowClear v-decorator="['addressKey']" />
          </a-form-item>
        </a-col>
        <a-col key="4" :span="8" >
          <a-form-item label="酒店类型">
            <a-select v-decorator="['typeKey']" 
            placeholder="请选择" style="width:200px">
              <a-select-option value="APARTMENT">公寓</a-select-option>
              <a-select-option value="HOMESTAY">民宿</a-select-option>
              <a-select-option value="HOSTEL">青旅</a-select-option>
              <a-select-option value="ECONOMY">经济连锁</a-select-option>
              <a-select-option value="HIGNEND">高级连锁</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col key="5" :span="8" >
          <a-form-item label="评分区间">
            <a-input-number v-decorator="['minRateKey']" :min="0" :max="5" />
            -
            <a-input-number v-decorator="['maxRateKey']" :min="0" :max="5" />
            <a-button @click="handleCleanRate" :style="{ marginLeft: '8px' }">清空</a-button>
          </a-form-item>
        </a-col>

        <a-col key="6" :span="8" :style="{ textAlign: 'left' }">
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

   <!-- 多条件查询结束 -->

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
          <router-link :to="{name: 'RoomManage', params: {hid: record.hid}}" title="查看酒店房型"><a-icon type="eye" /></router-link>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)" title="编辑酒店"><a-icon type="edit"/></a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除数据?" okText="是" cancelText="否" @confirm="handleDelete(record.hid)" >
           <a style="color: red;" title="删除酒店"><a-icon type="delete" /></a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <!-- 使用编辑子组件 ref绑定子组件的名字 -->
    <!-- <order-edit ref="editModal" @ok="handleOk" />-->
    <hotel-add ref="addModal" @ok="handleOk" /> 
    <hotel-edit ref="editModal" @ok="handleOk" /> 
  </a-card>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import STable from '@/components/Table'
import Ellipsis from '@/components/Ellipsis'
import { getHotelList, deleteHotel, deleteHotelAll } from '@/api/hotel'
import { parsePage } from '@/utils/pageable'
import HotelAdd from './form/HotelAdd'
import HotelEdit from './form/HotelEdit'

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
   HotelAdd,
   HotelEdit
 },
 filters: {
   typeFilter (type) {
     return hotelTypeMap[type].text
   }
 },
 data () {
  return {
      zh_CN,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
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
        //console.log('loadData.parameter', parameter)
        this.form.validateFields((error, values) => {
          this.queryParam = values
          //console.log(`查询条件${this.queryParam.hidKey}`)
        })
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
      queryParam: {},
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
      //console.log(`编辑酒店${record}`)
      this.$refs.editModal.edit(record)	//4.打开编辑表单
    },
    handleDelete(id) {
      //console.log(`删除酒店${id}`)
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
          //console.log(`批量删除酒店${this.selectedRowKeys}`)
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
    /*打开添加酒店窗口*/
    handleAdd() {
      this.$refs.addModal.add()
    },
    /* 多条件查询 */
    handleSearch(e) {
      e.preventDefault();
      this.$refs.table.refresh(true)
    },
    handleCleanRate() {
      this.form.setFieldsValue({minRateKey: undefined, maxRateKey: undefined})
    },
    handleReset() {
      this.form.resetFields();
      this.$refs.table.refresh(true)
    }
  }
}

</script>
<style scoped>
.ant-advanced-search-form {
  padding: 24px;
  padding-bottom: 0px;
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