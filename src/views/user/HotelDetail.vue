<template>
  <a-locale-provider :locale="zh_CN">
    <a-layout>
      <v-header />
      <a-layout-content :style="{ padding: '0 50px', marginTop: '90px' }">
        <div class="hotel-info">
          <div class="img-div">
            <a-carousel arrows>
              <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
                <a-icon type="left-circle" />
              </div>
              <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
                <a-icon type="right-circle" />
              </div>
              <div>
                <img :src="'/api/' + hotel.img" />
              </div>
              <div v-for="(room, index) in rooms" :key="index">
                <img :src="'/api' + room.img" />
              </div>
            </a-carousel>
          </div>
          <div class="info-detail">
            <div class="main-section">
              <h1>{{ hotel.hname }} · {{ hotel.brand }}</h1>
              <a-tag color="blue">{{ hotel.type | hotelTypeFilter }}</a-tag>
              <div class="address">
                <p :style="{ margin: 0, padding: 0 }">地址：{{ hotel.address }}</p>
                <p :style="{ margin: 0, padding: 0 }">电话：{{ hotel.phone }}</p>
              </div>
              <div class="rate">
                <span class="ant-rate-text"><span class="score">{{ hotel.rate }}</span>/5分</span>
                <a-rate :defaultValue="hotel.rate" allowHalf disabled />
              </div>
            </div>
            <div class="description">
              <p>酒店简介：</p>
              <p class="content">{{ hotel.description }}</p>
            </div>
          </div>
        </div>
        <div class="hotel-room">
          <div class="room-date">
            <label>入住日期</label>&nbsp;&nbsp;
            <a-date-picker v-model="startTime"/>&nbsp;&nbsp;
            <label>离店日期</label>&nbsp;&nbsp;
            <a-date-picker v-model="endTime"/>&nbsp;&nbsp;
            <a-button type="primary">
              确认修改
            </a-button>
          </div>
          <div class="room-title">
            <a-row>
              <a-col :span="9">
                <span style="margin-left: 210px">房型</span>
              </a-col>
              <a-col :span="3">
                早餐
              </a-col>
              <a-col :span="3">
                取消政策
              </a-col>
              <a-col :span="3">
                人数上限
              </a-col>
              <a-col :span="3">
                房价
              </a-col>
            </a-row>
          </div>
          <div class="room-div" v-for="(room, index) in rooms" :key="index">
            <a-row>
              <a-col :span="6">
                <img :src="'/api/' + room.img" style="width: 250px">
                <div class="room-img-section">
                  {{ room.rname }}
                  <a-tooltip placement="right">
                    <template slot="title" v-for="(assition, index) in room.assitions.split(',')">
                      <span :key="index">{{ assition }}<br></span>
                    </template>
                    <span>详情</span>
                  </a-tooltip>
                  </div>
              </a-col>
              <a-col :span="18" class="room-detail">
                <a-col :span="4">
                  {{ room.type | roomTypeFilter }}
                </a-col>
                <a-col :span="4">
                  {{ room.breakfast }}
                </a-col>
                <a-col :span="4">
                  {{ room.cancel }}
                </a-col>
                <a-col :span="4">
                  <a-icon type="user" /> x{{ room.people }}
                </a-col>
                <a-col :span="4">
                  ￥<span class="price">{{ room.price }}</span>
                </a-col>
                <a-col :span="4">
                  <a-button class="book-btn" @click="bookNow(room)">立即预订</a-button>
                </a-col>
              </a-col>
            </a-row>
          </div>
          <div class="room-div" v-if="rooms.length == 0">
            <a-empty />
          </div>
        </div>
        <div class="detail-tab">
          <a-row>
            <a-col :span="21">
              <div id="hotel-info" class="tab-pane">
                <h4>酒店信息</h4>
                <p><b>入住时间：</b>12:00后</p>
                <p><b>退房时间：</b>12:00前</p>
                <p><b>酒店介绍：</b></p>
                <p>国际饭店开业于1934年，是一家闻名遐迩的著名老饭店，民国23年，根据《申报》记载，国际饭店是当时东半球最高之楼。2006年起被评为“全国重点文物保护单位”；先后获得“中华老字号企业”、“上海市著名商标”等称号、“国际饭店京帮点心制作技艺”被列入上海市非物质文化遗产名录。酒店位于“上海坐标原点”，地处繁华的南京路，对面是风景如画的人民公园，地理位置优越，交通便利。如今饭店在保留优秀传统的基础上，进行了一系列的创新举措与整修，豪华舒适的客房，先进的会议娱乐设施、独具特色的美食、具有历史意义的名人墙、美术家之家、怀旧角和历史陈列馆，这些都向您充分展示了饭店悠久的历史和文化。国际饭店一直以来依靠传承发展的企业文化、与时俱进的服务理念，现代化的管理模式，打造出驰誉中外、独具特色的经典知名品牌。</p>
              </div>
              <div id="hotel-policy" class="tab-pane">
                <h4>酒店政策</h4>
                <p><b>外宾：</b>可接待外宾</p>
                <p><b>儿童：</b>不接受18岁以下客人单独入住</p>
                <p><b>宠物：</b>不可携带宠物 (遵守视障人士携带导盲犬入住酒店相关政策) </p>
                <p><b>发票：</b>可开具增值税普通发票</p>
                <p>
                  周末以及节假日的房价会有不同幅度的调整。<br>
                  宠物禁止入店（导盲犬除外）<br>
                  视障人士携带导盲犬入住酒店相关政策<br>
                  根据《中华人民共和国残疾人保障法》的相关规定，接受视障宾客携带导盲犬进入酒店对客开放区域，并根据现行法律法规合理享用酒店设施与服务。<br><br>
                  宾客携带导盲犬办理登记入住时，除常规手续外，还需提供残疾人证（红色证件代表视力残疾），盖有公安部门或残疾人联合会公章的导盲犬工作证（或带有国际导盲犬联盟IGDF标识）以及动物健康免疫证明，酒店将安排视障人士与导盲犬同住无障碍客房。酒店根据《城市养犬管理条例》规定，不允许除工作导盲犬外的其他宠物进入。<br><br>
                  如果导盲犬在没有工作许可或证书的情况下为视障客人工作，酒店将提供其他方法例如：为导盲犬提供其他的安置地点，并由酒店员工提供视障客人所需的指导和协助。<br><br>
                  餐饮服务区域：宾客携带导盲犬可以进入酒店公共区域以及餐厅就餐。<br><br>
                  宾客携带导盲犬进入酒店，须负责在任何情况下照料及控制好导盲犬，以确保不会影响其他宾客权益。
                </p>
              </div>
              <div id="hotel-facilities" class="tab-pane">
                <h4>酒店设施</h4>
                <ul class="list">
                  <li v-for="(facility, index) in hotel.facilities.split(',')" :key="index">
                    <a-icon type="check" />{{ facility }}
                  </li>
                </ul>
              </div>
              <div id="hotel-service" class="tab-pane">
                <h4>酒店服务</h4>
                <ul class="list">
                  <li v-for="(service, index) in hotel.service.split(',')" :key="index">
                    <a-icon type="check" /> {{ service }}
                  </li>
                </ul>
              </div>
              <div id="user-comment" class="tab-pane">
                <h4>用户评论</h4>
                <div class="review-show">
                  <div class="review-star">
                    <p class="score">
                      <b>{{ hotel.rate }}</b>/5分
                    </p>
                    <p>{{ (badComment+middleComment+goodComment) }} 条真实评论</p>
                  </div>
                  <div class="comment-box">
                    <div class="comment-main">
                      <span>服务态度</span><br>
                      <a-rate :defaultValue="hotel.rate" allowHalf disabled />
                    </div>
                    <div class="comment-main">
                      <span>设施设备</span><br>
                      <a-rate :defaultValue="hotel.rate" allowHalf disabled />
                    </div>
                    <div class="comment-main">
                      <span>环境卫生</span><br>
                      <a-rate :defaultValue="hotel.rate" allowHalf disabled />
                    </div>
                    <div class="comment-main">
                      <span>地理位置</span><br>
                      <a-rate :defaultValue="hotel.rate" allowHalf disabled />
                    </div>
                  </div>
                </div>
                <a-tabs defaultActiveKey="1" style="margin-top: 10px;" @change="callback">
                  <a-tab-pane :tab="'全部点评 ' + (badComment+middleComment+goodComment)" key="1">
                    <template v-if="(badComment+middleComment+goodComment) > 0">
                      <div class="user-review-box" v-for="(comment, index) in comments" :key="index">
                        <div class="user-img">
                          <a-avatar :size="80" :src="'/api' + comment.user.icon" />
                          <span>{{ comment.user.uname }}</span>
                        </div>
                        <div class="review-comment">
                          <div class="review-main">
                            <p>{{ comment.content }}</p>
                          </div>
                          <div class="review-user-star">
                            <a-rate :defaultValue="comment.rate" allowHalf disabled />
                            <span>{{ comment.date }}</span>
                          </div>
                          <div class="manage-main" v-if="comment.reply != '' && comment.reply != null">
                            <div class="manage-name">店长回复：</div>
                            <div class="manage-contain">{{ comment.reply }}</div>
                          </div>
                        </div>
                      </div>
                      <!-- 分页 -->
                      <div class="pagination">
                        <a-pagination showQuickJumper :defaultCurrent="defaultCurrent" :defaultPageSize="defaultPageSize" :total="total" @change="onChangePage" />
                      </div>
                    </template>
                    <template v-else>
                      <a-empty/>
                      <!-- <div>暂时没有好评哦！</div> -->
                    </template>
                  </a-tab-pane>
                  <a-tab-pane :tab="'好评 ' + goodComment" key="2">
                    <template v-if="goodComment > 0">
                      <div v-for="(comment, index) in comments" :key="index">
                        <div class="user-review-box" v-if="comment.type == 'PRAISE'">
                          <div class="user-img">
                            <a-avatar :size="80" :src="'/api' + comment.user.icon" />
                            <span>{{ comment.user.uname }}</span>
                          </div>
                          <div class="review-comment">
                            <div class="review-main">
                              <p>{{ comment.content }}</p>
                            </div>
                            <div class="review-user-star">
                              <a-rate :defaultValue="comment.rate" allowHalf disabled />
                              <span>{{ comment.date }}</span>
                            </div>
                            <div class="manage-main" v-if="comment.reply != '' && comment.reply != null">
                              <div class="manage-name">店长回复：</div>
                              <div class="manage-contain">{{ comment.reply }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 分页 -->
                      <div class="pagination">
                        <a-pagination showQuickJumper :defaultCurrent="defaultCurrent" :defaultPageSize="defaultPageSize" :total="total" @change="onChangePage" />
                      </div>
                    </template>
                    <template v-else>
                      <a-empty/>
                     <!--  <div>暂时没有好评哦！</div> -->
                    </template>
                  </a-tab-pane>
                  <a-tab-pane :tab="'中评 ' + middleComment" key="3">
                    <template v-if="middleComment>0">
                      <div v-for="(comment, index) in comments" :key="index">
                        <div class="user-review-box" v-if="comment.type == 'AVERAGE'">
                          <div class="user-img">
                            <a-avatar :size="80" :src="'/api' + comment.user.icon" />
                            <span>{{ comment.user.uname }}</span>
                          </div>
                          <div class="review-comment">
                            <div class="review-main">
                              <p>{{ comment.content }}</p>
                            </div>
                            <div class="review-user-star">
                              <a-rate :defaultValue="comment.rate" allowHalf disabled />
                              <span>{{ comment.date }}</span>
                            </div>
                            <div class="manage-main" v-if="comment.reply != '' && comment.reply != null">
                              <div class="manage-name">店长回复：</div>
                              <div class="manage-contain">{{ comment.reply }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 分页 -->
                      <div class="pagination">
                        <a-pagination showQuickJumper :defaultCurrent="defaultCurrent" :defaultPageSize="defaultPageSize" :total="total" @change="onChangePage" />
                      </div>
                    </template>
                    <template v-else>
                      <a-empty/>
                      <!-- <div>暂时没有中评哦！</div> -->
                    </template>
                  </a-tab-pane>
                  <a-tab-pane :tab="'差评 ' + badComment" key="4">
                    <template v-if="badComment>0">
                      <div v-for="(comment, index) in comments" :key="index">
                        <div class="user-review-box" v-if="comment.type == 'CRITICIZE'">
                          <div class="user-img">
                            <a-avatar :size="80" :src="'/api' + comment.user.icon" />
                            <span>{{ comment.user.uname }}</span>
                          </div>
                          <div class="review-comment">
                            <div class="review-main">
                              <p>{{ comment.content }}</p>
                            </div>
                            <div class="review-user-star">
                              <a-rate :defaultValue="comment.rate" allowHalf disabled />
                              <span>{{ comment.date }}</span>
                            </div>
                            <div class="manage-main" v-if="comment.reply != '' && comment.reply != null">
                              <div class="manage-name">店长回复：</div>
                              <div class="manage-contain">{{ comment.reply }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 分页 -->
                      <div class="pagination">
                        <a-pagination showQuickJumper :defaultCurrent="defaultCurrent" :defaultPageSize="defaultPageSize" :total="total" @change="onChangePage" />
                      </div>
                    </template>
                    <template v-else>
                      <a-empty/>
                      <!-- <div>暂时没有差评哦！</div> -->
                    </template>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </a-col>
            <a-col :span="3">
              <a-anchor :offsetTop="64">
                <a-anchor-link href="#hotel-info" title="酒店信息" />
                <a-anchor-link href="#hotel-policy" title="酒店政策" />
                <a-anchor-link href="#hotel-facilities" title="酒店设施" />
                <a-anchor-link href="#hotel-service" title="酒店服务" />
                <a-anchor-link href="#user-comment" title="用户评论" />
              </a-anchor>
            </a-col>
          </a-row>
        </div>
      </a-layout-content>
      <v-footer />
      <a-back-top />
    </a-layout>
  </a-locale-provider>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import Header from "./Header";
import Footer from "./Footer";
import moment from 'moment';
import { user_info } from '@/utils/encrypt'
import { getHotelDetail } from '@/api/hotel'
import { getCommentList } from '@/api/comment'

const hotelTypesMap = {
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

const roomTypesMap = {
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
  },
}

const commentTypesMap = {
  1: {
    text: ''
  },
  2: {
    text: 'PRAISE'
  },
  3: {
    text: 'AVERAGE'
  },
  4: {
    text: 'CRITICIZE'
  },
}

export default {
  name: "HotelDetail",
  components: {
    "v-header": Header,
    "v-footer": Footer
  },
  filters: {
    hotelTypeFilter (type) {
      return hotelTypesMap[type].text
    },
    roomTypeFilter (type) {
      return roomTypesMap[type].text
    }
    // ,
    // serviceFilter (service) {
    //   return serviceMap[service].icon
    // }
  },
  created: function() {
    this.user = user_info
    this.hotel = this.$route.params.hotelDetail.hotel
    this.rooms = this.$route.params.hotelDetail.rooms
    this.badComment = this.$route.params.hotelDetail.criticize
    this.middleComment = this.$route.params.hotelDetail.average
    this.goodComment = this.$route.params.hotelDetail.praise

    let queryData = {
      "sortField":"date",
      "pageSize": 20,
      "pageNo": 1,
      "hidKey": this.hotel.hid,
      "typeKey": this.type
    }
    getCommentList(queryData).then(res => {
        if (res.success === true) {
          this.comments = res.data.content
          this.defaultCurrent = res.data.number + 1
          this.defaultPageSize = res.data.size
          this.total = res.data.totalElements
        } else {
          this.comments = []
          this.defaultCurrent = 1
          this.defaultPageSize = 2
          this.total = 0
        }
    }).catch(ex => {
      this.comments = []
      this.defaultCurrent = 1
      this.defaultPageSize = 2
      this.total = 0
    })
    
  },
  data() {
    return {
      zh_CN,
      startTime: moment(),
      endTime: undefined,
      user: undefined,
      hotel: {},
      hotelImgs: [],
      rooms: [],
      comments: [],
      goodComment: 0,
      middleComment: 0,
      badComment: 0,
      defaultCurrent: 1,
      defaultPageSize: 20,
      total: 0,
      type: ''
    };
  },
  methods: {
    moment,
    bookNow: function(room) {
      if (user_info == null) {
        this.$message.error("请先登录")
        return
      }
      if (this.startTime == undefined || this.startTime == null) {
        this.$message.error("请选择入住日期")
        return
      }
      if (this.endTime == undefined || this.endTime == null) {
        this.$message.error("请选择离店日期")
        return
      }
      this.$router.push({
        name: 'ConfirmOrder',
        params: {
          startTime: this.startTime,
          endTime: this.endTime,
          hotel: this.hotel,
          room: room,
          user: this.user
        }
      })
    },
    onChangePage(pageNumber) {
      console.log('Page: ', pageNumber)
      this.defaultCurrent = pageNumber
      let queryData = {
        "sortField":"date",
        "pageSize": this.defaultPageSize,
        "pageNo": this.defaultCurrent,
        "hidKey": this.hotel.hid,
        "typeKey": this.type
      }
      getCommentList(queryData).then(res => {
          if (res.success === true) {
            this.comments = res.data.content
            this.defaultCurrent = res.data.number + 1
            this.defaultPageSize = res.data.size
            this.total = res.data.totalElements
          } else {
            this.comments = []
            this.defaultCurrent = 1
            this.defaultPageSize = 20
            this.total = 0
          }
      }).catch(ex => {
        this.comments = []
        this.defaultCurrent = 1
        this.defaultPageSize = 20
        this.total = 0
      })
    },
    callback(key) {
      //console.log(commentTypesMap[key].text)
      this.type = commentTypesMap[key].text
      let queryData = {
        "sortField":"date",
        "pageSize": this.defaultPageSize,
        "pageNo": 1,
        "hidKey": this.hotel.hid,
        "typeKey": this.type
      }
      getCommentList(queryData).then(res => {
          if (res.success === true) {
            this.comments = res.data.content
            this.defaultCurrent = res.data.number + 1
            this.defaultPageSize = res.data.size
            this.total = res.data.totalElements
          } else {
            this.comments = []
            this.defaultCurrent = 1
            this.defaultPageSize = 2
            this.total = 0
          }
      }).catch(ex => {
        this.comments = []
        this.defaultCurrent = 1
        this.defaultPageSize = 2
        this.total = 0
      })
    }
  }
};
</script>
<style scoped>
/* --------------------top-------------------- */
.hotel-info {
  padding: 15px 250px;
  margin-bottom: 20px;
  background-color: #fff;
  height: 300px;
}

.hotel-info>div {
  float: left;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.hotel-info .img-div {
  width: 360px;
}

.hotel-info .img-div img {
  width: 360px;
  height: 270px;
}

/* --------------------img style-------------------- */
.ant-carousel .slick-slide {
  height: 270px;
}

.ant-carousel .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}

.ant-carousel .custom-slick-arrow:before {
  display: none;
}

.ant-carousel .custom-slick-arrow:hover {
  opacity: 0.5;
}
/* --------------------info------------------------- */
.info-detail {
  width: 540px;
  padding: 0 20px;
  font-size: 14px;
  color: #333;
}

.main-section {
  position: relative;
}

.main-section h1 {
  font-size: 20px;
  font-weight: 700;
  line-height: 40px;
}

.main-section .address {
  padding: 20px 0;
}

.main-section .rate {
  position: absolute;
  right: 0;
  top: 45px;
}

.main-section .rate .score {
  font-size: 16px;
  color: #5babfc;
}

.description {
  border-top: 1px solid #cfcfcf;
  padding: 20px 0;
}

.description .content {
  position: relative;
    max-height: 60px;
    overflow-y: auto;
}

/* --------------------middle --------------------*/
.hotel-room {
  position: relative;
  padding: 30px 30px 0;
  background-color: #fff;
}

.hotel-room .room-date {
  padding-bottom: 20px;
  font-size: 16px;
  color: #333;
}

.hotel-room .room-title {
  background-color: #94c9ff;
  color: #fff;
  height: 30px;
  line-height: 30px;
}

.hotel-room .room-div {
  padding: 10px 0;
  border-bottom: 1px solid #f7f7f7;
}

.hotel-room .room-div .room-img-section {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
}

.hotel-room .room-div .room-img-section span {
  font-size: 12px;
  float: right;
  margin-right: 90px;
  cursor: pointer;
  color: #5BABFC;
}

.hotel-room .room-div .room-detail {
  font-size: 16px;
  line-height: 40px;
  border-bottom: 1px solid #cfcfcf;
  padding: 7px 0;
}

.hotel-room .room-div .room-detail:hover {
  background-color: #fffcf3;
}

.hotel-room .room-div .room-detail .price {
  font-size: 20px;
  color: #ff560a;
}

.hotel-room .room-div .room-detail .book-btn {
  background-color: #fa5d22;
  color: #fff;
  width: 100px;
  height: 35px;
  float: right;
}

.hotel-room .room-div .room-detail .book-btn:hover {
  background-color: #d44b0e;
}

/*--------------------foot--------------------  */
.detail-tab {
  background-color: #fff;
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #c9c9c9;
}

.detail-tab .tab-pane {
  padding: 10px 30px 30px 20px;
  border-bottom: 1px solid #c9c9c9;
}

.detail-tab .tab-pane h4 {
  color: #5babfc;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.detail-tab p {
  line-height: 24px;
  margin-bottom: 5px;
}

.detail-tab .tab-pane b {
  font-weight: 700;
}

.detail-tab .list {
  list-style: none;
  margin-left: -38px;
}

.detail-tab .list li {
  display: inline-block;
  vertical-align: top;
  width: 11%;
  margin-bottom: 10px;
  margin-right: 8px;
}

.detail-tab .review-show {
  padding: 30px;
  border: 1px solid #e3e3e3;
  height: 125px;
}

.detail-tab .review-star {
  border-right: 1px solid #ddd;
  padding-right: 30px;
  float: left;
  text-align: center;
}

.detail-tab .review-star .score {
  font-size: 18px;
  color: #666;
}

.detail-tab .review-star .score b {
  font-size: 30px;
  color: #5babfc;
}

.detail-tab .comment-box {
  margin-left: 40px;
  padding-top: 12px;
  float: left;
}

.detail-tab .comment-main {
  float: left;
  text-align: center;
  margin-right: 40px;
}

.detail-tab .user-review-box {
  padding-top: 30px;
}

.detail-tab .user-img {
  float: left;
  width: 125px;
  text-align: center;
  position: relative;
}

.detail-tab .review-comment {
  float: left;
  width: 1023px;
  padding-top: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.detail-tab .review-main {
  min-height: 55px;
}

.detail-tab .review-user-star {
  margin-bottom: 26px;
}

.detail-tab .manage-main {
  position: relative;
  width: 100%;
  padding: 20px;
  background: #f2f2f2;
  margin-bottom: 40px;
  font-size: 12px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.detail-tab .manage-name {
  color: #666;
  margin-bottom: 4px;
}

.detail-tab .manage-contain {
  color: #999;
}

.detail-tab .pagination {
  float: right;
  margin: 30px 0 0 0;
}

</style>