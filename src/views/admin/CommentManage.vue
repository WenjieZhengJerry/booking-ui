<template>
<a-locale-provider :locale="zh_CN">
 <a-card :bordered="false">
   <!-- 多条件查询开始 -->

  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-row :gutter="24">
        <a-col key="1" :span="8" >
          <a-form-item label="评论编号">
            <a-input allowClear v-decorator="['cidKey']" />
          </a-form-item>
        </a-col>
        <a-col key="2" :span="8" >
          <a-form-item label="用户姓名">
            <a-input allowClear v-decorator="['unameKey']" />
          </a-form-item>
        </a-col>
        <a-col key="3" :span="8" >
          <a-form-item label="酒店名字">
            <a-input allowClear v-decorator="['hnameKey']" />
          </a-form-item>
        </a-col>
        <a-col key="4" :span="8" >
          <a-form-item label="评论类型">
            <a-select v-decorator="['typeKey']" 
            placeholder="请选择" style="width:200px">
              <a-select-option value="PRAISE">好评</a-select-option>
              <a-select-option value="AVERAGE">中评</a-select-option>
              <a-select-option value="CRITICIZE">差评</a-select-option>
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
        <a-col key="6" :span="8" >
          <a-form-item label="评论时间">
            <a-date-picker format="YYYY-MM-DD HH:mm:ss" v-decorator="['dateKey']" style="width: 200px" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'right' }">
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
   </div>
    <s-table
      ref="table"
      size="default"
      rowKey="cid"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      showPagination="auto"
    >
      <!-- <span slot="img" slot-scope="text">
        <img style="width:100px;heigth:100px" :src=text />
      </span> -->
      <!--1.较长内容使用ellipsis插件省略显示-->
      <span slot="content" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="reply" slot-scope="text">
        <template v-if="text && text.length > 0">
            <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
        </template>
        <template v-else>
            <a-icon type="ellipsis" title="未回复"/>
        </template>
      </span>
      <!-- 2.评论类型：枚举适配显示 -->
      <span slot="type" slot-scope="text">
        {{text | typeFilter}}
      </span>
      <!-- <span slot="createTime" slot-scope="text">{{ text | moment('YYYY/MM/DD hh:mm:ss') }}</span>
      <span slot="orderStatus" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span> -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleReply(record)" title="回复评论"><a-icon type="message"/></a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除数据?" okText="是" cancelText="否" @confirm="handleDelete(record.cid)" >
           <a style="color: red;" title="删除评论"><a-icon type="delete" /></a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <!-- 使用编辑子组件 ref绑定子组件的名字 -->
    <!-- <order-edit ref="editModal" @ok="handleOk" />-->
    <comment-reply ref="replyModal" @ok="handleOk" /> 
  </a-card>
  </a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import STable from '@/components/Table'
import Ellipsis from '@/components/Ellipsis'
import moment from 'moment' //日期处理moment.js工具模块
import { getCommentList, deleteComment, deleteCommentAll } from '@/api/comment'
import { parsePage } from '@/utils/pageable'
import CommentReply from './form/CommentReply'

const commentTypeMap = {
  PRAISE: {
    text: '好评'
  },
  AVERAGE: {
    text: '中评'
  },
  CRITICIZE: {
    text: '差评'
  }
}

export default {
 name: 'CommentManage',
 components: {
   STable,
   Ellipsis,
   CommentReply
 },
 filters: {
   typeFilter (type) {
     return commentTypeMap[type].text
   }
 },
 data () {
  return {
      zh_CN,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      columns: [
        {
          title: '主键',
          dataIndex: 'cid',
          align: 'center'
        },
        {
          title: '用户姓名',
          dataIndex: 'user.uname',
          align: 'center'
        },
        {
          title: '酒店名字',
          dataIndex: 'hotel.hname',
          align: 'center'
        },
        {
          title: '评论内容',
          dataIndex: 'content',
          align: 'center',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '店长回复',
          dataIndex: 'reply',
          align: 'center',
          scopedSlots: { customRender: 'reply' }
        },
        {
          title: '评论时间',
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '评论类别',
          dataIndex: 'type',
          align: 'center',
          scopedSlots: { customRender: 'type' }
        },
        {
            title: '评分',
          dataIndex: 'rate',
          width: '80px',
          align: 'center'
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
          console.log(this.queryParam.dateKey)
          if (this.queryParam.dateKey !== undefined && this.queryParam.dateKey != null) {
            this.queryParam.dateKey = moment(values.dateKey).format('YYYY-MM-DD HH:mm:ss')
          }
          console.log(this.queryParam.dateKey)
        })
        return getCommentList({ "sortField":"date", ...parameter, ...this.queryParam }).then(res => {
            if (res.success === true) {
              return { ...parsePage(res) }
            } else {
              return parsePage()
            }
        }).catch(ex => {
          return parsePage()
        })
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
    handleReply(record) {
      //console.log(`回复评论${record}`)
      this.$refs.replyModal.reply(record)	//4.打开编辑表单
    },
    handleDelete(id) {
      //console.log(`删除评论${id}`)
      deleteComment(id).then(res => {
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
        deleteCommentAll({ 'ids':this.selectedRowKeys.join(",") }).then(res => {
          //console.log(`批量删除评论${this.selectedRowKeys}`)
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