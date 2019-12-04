<template>
 <div class='main'>
  <div class="title" style="border-bottom: 1px solid #c9c9c9">
    <h5>我的积分</h5>
    <p>
      <b>当前积分：<span>0</span></b>
    </p>
  </div>
  <div class="point-table">
    <a-table :columns="columns" :dataSource="data">
      <!-- <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template> -->
      <template slot="title">
        共 <span style="color: #5babfc;">0</span> 条记录
      </template>
    </a-table>
  </div>
 </div>
</template>

<script>
const columns = [
  {
    title: '消费时间',
    dataIndex: 'createTime',
    align: 'center'
  },
  {
    title: '消费类型',
    dataIndex: 'type',
    align: 'center'
  },
  {
    title: '积分',
    dataIndex: 'point',
    align: 'center'
  },
];

const data = [
  // {
  //   key: '1',
  //   createTime: '2019-01-23',
  //   type: '线上付款',
  //   point: '598',
  // },
  // {
  //   key: '2',
  //   createTime: '2019-11-01',
  //   type: '门店支付',
  //   point: '239',
  // },
  // {
  //   key: '3',
  //   createTime: '2019-10-28',
  //   type: '线上付款',
  //   point: '1035',
  // },
  // {
  //   key: '4',
  //   createTime: '2019-06-30',
  //   type: '线上付款',
  //   point: '365',
  // },
  // {
  //   key: '5',
  //   createTime: '2019-05-14',
  //   type: '线上付款',
  //   point: '598',
  // }
];

export default {
 name: 'PointManage',
 data () {
  return {
    data,
    columns
  };
 }
}

</script>
<style scoped>
.main {
  float: left;
  margin-left: 20px;
  width: 100%;
  padding: 20px 40px 40px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.title h5 {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.title p {
  display: inline-block;
  width: 200px;
}

.title b {
  font-size: 14px;
  color: #333;
  margin-right: 10px;
}

.title p b span {
  color: #5babfc;
  font-size: 16px;
}

.point-table {
  margin-top: 10px;
  padding-bottom: 15px;
}

.ant-table-thead > tr >th{
  background-color: #5babfc;
  color: #fff;
}
</style>