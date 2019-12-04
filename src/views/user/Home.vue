<!--酒店预订主页-->
<template>
<a-locale-provider :locale="zh_CN">
  <a-layout id="components-layout-demo-fixed">
    <!-- 头部 -->
    <v-header />
    <!-- 高级查询 -->
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <a-row class="side-search">
        <a-col :span="6">
          <label>目的地</label>
          <a-input placeholder="城市" :style="{ width: '50%' }" />
        </a-col>
        <a-col :span="8">
          <label>日期</label>
          <a-range-picker />
        </a-col>
        <a-col :span="7">
          <label>关键词</label>
          <a-input placeholder="酒店名" :style="{ width: '80%' }" />
        </a-col>
        <a-col :span="3">
          <a-button type="primary" :style="{ width: '70%', float: 'right' }">
            搜索
          </a-button>
        </a-col>
      </a-row>
      <!-- 多选 -->
      <div class="select-div">
        <div class="row-div">
          <a-row>
            <a-col :span="2" :style="{ lineHeight: '32px' }"><label>位置</label></a-col>
            <a-radio-group v-model="locationDefault" buttonStyle="solid" @change="locationChange" :style="{ width: '80%' }">
                <a-col :span="2">
                  <a-radio-button value="不限" :style="{ border: 0, borderRadius: 0, zIndex: 0 }">不限</a-radio-button>
                </a-col>
                <a-col :span="20">
                  <template v-for="location in locations">
                    <a-col :span="3" :key="location">
                      <a-radio-button :value="location" :style="{ border: 0, borderRadius: 0, zIndex: 0 }">{{ location }}</a-radio-button>
                    </a-col>
                  </template>
                </a-col>
            </a-radio-group>
          </a-row>
        </div>
        <div class="row-div">
            <a-row>
              <a-col :span="2" :style="{ lineHeight: '32px' }"><label>品牌</label></a-col>
              <a-checkbox-group :style="{ width: '90%' }" @change="brandChange" v-model="brandNums">
                  <a-col :span="2">
                    <a-radio-group v-model="brandDefault" buttonStyle="solid" @change="changeBrandRadio">
                      <a-radio-button value="不限" :style="{ border: 0, borderRadius: 0, zIndex: 0 }">不限</a-radio-button>
                    </a-radio-group>
                  </a-col>
                  <a-col :span="20">
                    <template v-for="brand in brands">
                      <a-col :span="4" :key="brand">
                        <a-checkbox :value="brand">{{ brand }}</a-checkbox>
                      </a-col>
                    </template>
                  </a-col>
              </a-checkbox-group>
            </a-row>
        </div>
        <div class="row-div">
          <a-row>
              <a-col :span="2" :style="{ lineHeight: '32px' }"><label>星级</label></a-col>
              <a-checkbox-group v-model="rateNums" @change="rateChange" :style="{ width: '90%' }">
                  <a-col :span="2">
                    <a-radio-group v-model="rateDefault" @change="changeRateRadio" buttonStyle="solid">
                      <a-radio-button value="不限" :style="{ border: 0, borderRadius: 0, zIndex: 0 }">不限</a-radio-button>
                    </a-radio-group>
                  </a-col>
                  <a-col :span="20">
                    <template v-for="rate in rates">
                      <a-col :span="4" :key="rate">
                        <a-checkbox :value="rate">{{ rate }}</a-checkbox>
                      </a-col>
                    </template>
                  </a-col>
              </a-checkbox-group>
            </a-row>
        </div>
        <div class="row-div" :style="{ borderBottom: 0 }">
          <a-row>
              <a-col :span="2" :style="{ lineHeight: '32px' }"><label>价格(元)</label></a-col>
              <a-radio-group v-model="curValue" @change="priceChange" :style="{ width: '91%' }">
                  <a-col :span="2">
                    <a-radio-group v-model="priceDefault" @change="changePriceRadio" buttonStyle="solid">
                      <a-radio-button value="不限" :style="{ border: 0, borderRadius: 0, zIndex: 0 }">不限</a-radio-button>
                    </a-radio-group>
                  </a-col>
                  <a-col :span="20">
                    <a-col :span="4"><a-radio value="200">200以下</a-radio></a-col>
                    <a-col :span="4"><a-radio value="400">200-400</a-radio></a-col>
                    <a-col :span="4"><a-radio value="600">400-600</a-radio></a-col>
                    <a-col :span="4"><a-radio value="9999">600以上</a-radio></a-col>
                    <a-col :span="8">
                      <label>价格区间</label>&nbsp;&nbsp;
                      <a-input-number v-model="minPrice" :min="0" :max="9999" />
                      -
                      <a-input-number v-model="maxPrice" :min="100" :max="9999" />
                      &nbsp;&nbsp;
                      <a-button @click="searchPrice">确定</a-button>
                    </a-col>
                  </a-col>
              </a-radio-group>
            </a-row>
        </div>
      </div>
      <!-- 内容 -->
      <div class="content-div">
        <a-row>
          <a-col :span="24">
            <div class="tag-div">
              <div class="result">
                查询到<span>132</span>家酒店
              </div>
              <template v-for="tag in tags">
                <a-tag :key="tag" :closable="true" :afterClose="() => handleClose(tag)" :style="{ marginTop: '2px' }">
                  {{ tag }}
                </a-tag>
              </template>
              <a-tag :visible="cleanBtn" @click="deleteAllTags">清空</a-tag>
            </div>
            <div class="sort-div">
              <label>排序：</label>
              <a-radio-group defaultValue="1" buttonStyle="solid">
                <a-radio-button value="1" :style="{ border: 0, borderRadius: 0, zIndex: 0 }">默认排序</a-radio-button>
                <a-radio-button value="2" :style="{ border: 0, borderRadius: 0, zIndex: 0 }">价格升序<a-icon type="arrow-up" /></a-radio-button>
                <a-radio-button value="3" :style="{ border: 0, borderRadius: 0, zIndex: 0 }">价格降序<a-icon type="arrow-down" /></a-radio-button>
              </a-radio-group>
            </div> 
            <div v-if="hotels.length != 0">
              <template v-for="(hotel, index) in hotels">
                <div class="hotel-div" :key="index">
                  <div class="pic">
                    <a href="javascript:;" @click="goTo"><img src="@/assets/hotel-demo1.jpg" /></a>
                  </div>
                  <div class="middle">
                    <p class="h-name"><a href="javascript:;" @click="goTo">{{ hotel.hName }}</a></p>
                    <p>地址：{{ hotel.address }}</p>
                    <p>距离市中心 {{ hotel.distance }} km</p>
                    <a-tag color="blue">{{ hotel.type }}</a-tag>
                    <div :style="{ color: '#bdbdbd', marginTop: '10px' }">
                      <a-icon type="coffee" /> 餐厅 &nbsp;
                      <a-icon type="car" /> 停车场 &nbsp;
                      <a-icon type="team" /> 接待外宾
                    </div>
                  </div>
                  <div class="rate">
                    <span class="ant-rate-text"><span class="score">{{ hotel.rate }}</span>/5分</span>
                    <a-rate :defaultValue="hotel.rate" allowHalf disabled />
                  </div>
                  <div class="more">
                    ￥<span class="price">{{ hotel.minPrice }}</span>起
                    <a-button @click="goTo" class="detail-btn">查看详情</a-button>
                  </div>
                </div>  
              </template> 
            </div>
            <div v-else>
              <a-empty description="找不到符合条件的酒店" :style="{ margin: '20px 0' }" />
            </div>
            <!-- 分页 -->
            <div class="pagination" v-if="hotels.length != 0">
              <a-pagination showQuickJumper :defaultCurrent="1" :defaultPageSize="10" :total="100" />
            </div>
          </a-col>
          <!-- 待开发 -->
          <!-- <a-col :span="6">
            
          </a-col> -->
        </a-row>
      </div>
    </a-layout-content>
    <!-- 尾部 -->
    <v-footer />
    <!-- 回到顶部按钮 -->
    <a-back-top />
  </a-layout>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import Header from '@/views/user/Header'
import Footer from '@/views/user/Footer'

export default {
 name: 'Home',
 data () {
    return {
      zh_CN,
      locations: ['商圈/地标', '机场/火车站', '轨道交通', '行政区', '景点'],
      brands: ['昆仑', '锦江', '希岸', '维也纳酒店', '白玉兰', '凯里亚德（中国）', '丽笙', '希尔顿欢朋', 'IU酒店', '7天优品', '丽枫', '郁锦香', '锦江都城'],
      rates: ['经济型', '舒适型', '高档型', '豪华型'],
      locationDefault: '不限',
      brandDefault: '不限',
      brandNums: [],
      rateDefault: '不限',
      rateNums: [],
      priceDefault: '不限',
      curValue: null,
      minPrice: 0,
      maxPrice: 9999,
      tags: [],
      cleanBtn: false,
      hotels: [
        {
          img: '',
          hName: '锦江国际饭店',
          address: '上海市黄浦区南京西路170号',
          distance: 1.1,
          type: '高档型',
          rate: 4.9,
          minPrice: 1058
        },
        {
          img: '',
          hName: '锦江国际饭店',
          address: '上海市黄浦区南京西路170号',
          distance: 1.1,
          type: '高档型',
          rate: 4.9,
          minPrice: 1058
        },
        {
          img: '',
          hName: '锦江国际饭店',
          address: '上海市黄浦区南京西路170号',
          distance: 1.1,
          type: '高档型',
          rate: 4.9,
          minPrice: 1058
        }
      ]
    };
 },

 components: {
    'v-header': Header,
    'v-footer': Footer
  },

 computed: {},

 methods: {
   locationChange: function(e) {
      if (e.target.value == '不限') {
        const locTags = this.tags.filter(tag => this.locations.includes(tag))
        this.tags = this.tags.filter(tag => !locTags.includes(tag))
        this.tags.length == 0 ? this.cleanBtn = false : this.cleanBtn = true
      } else {
        const locTags = this.tags.filter(tag => this.locations.includes(tag))
        this.tags = this.tags.filter(tag => !locTags.includes(tag))
        this.tags.push(e.target.value)
        this.cleanBtn = true
      }
    },
    changeBrandRadio: function(e) {
      // 筛选出tags里所有属于brand的tag
      const braTags = this.tags.filter(tag => this.brands.includes(tag))
      // 删掉tags里上一步筛选出来的brand的tag
      this.tags = this.tags.filter(tag => !braTags.includes(tag))
      this.tags.length == 0 ? this.cleanBtn = false : this.cleanBtn = true
      this.brandNums = []
    },
    brandChange: function(checkedValue) {
      if (checkedValue.length > 0) {
        let isAdd = false
        checkedValue.forEach(value => {
          if (!this.tags.includes(value)) {
            this.tags.push(value)
            isAdd = true
          }
        })

        if (!isAdd) {
          const beforeBrand = this.tags.filter(tag => this.brands.includes(tag))
          const del = beforeBrand.filter(tag => !checkedValue.includes(tag))
          this.tags = this.tags.filter(tag => !del.includes(tag))
        }

        this.brandNums = checkedValue
        this.brandDefault = ''
        this.cleanBtn = true
      } else {
        this.changeBrandRadio()
        this.brandDefault = '不限'
      }
    },
    changeRateRadio: function(e) {
      // 筛选出tags里所有属于rate的tag
      const rateTags = this.tags.filter(tag => this.rates.includes(tag))
      // 删掉tags里上一步筛选出来的rate的tag
      this.tags = this.tags.filter(tag => !rateTags.includes(tag))
      this.tags.length == 0 ? this.cleanBtn = false : this.cleanBtn = true
      this.rateNums = []
    },
    rateChange: function(checkedValue) {
      if (checkedValue.length > 0) {
        let isAdd = false
        checkedValue.forEach(value => {
          if (!this.tags.includes(value)) {
            this.tags.push(value)
            isAdd = true
          }
        })

        if (!isAdd) {
          const beforeRate = this.tags.filter(tag => this.rates.includes(tag))
          const del = beforeRate.filter(tag => !checkedValue.includes(tag))
          this.tags = this.tags.filter(tag => !del.includes(tag))
        }

        this.rateNums = checkedValue
        this.rateDefault = ''
        this.cleanBtn = true
      } else {
        this.changeRateRadio()
        this.rateDefault = '不限'
      }
    },
    changePriceRadio: function(e) {
      if (e != null) {
        const del = this.tags.filter(tag => !this.locations.includes(tag) && !this.brands.includes(tag) && !this.rates.includes(tag))
        this.tags = this.tags.filter(tag => !del.includes(tag))
        this.tags.length == 0 ? this.cleanBtn = false : this.cleanBtn = true
      }
      this.curValue = null
      this.minPrice = 0
      this.maxPrice = 9999
    },
    priceChange: function(e) {
      let priceTag = ''
      this.priceDefault = ''

      if (e.target.value == 200) {
        this.minPrice = 0
        this.maxPrice = e.target.value - 1
        priceTag = '200以下'
      } else if (e.target.value == 400) {
        this.minPrice = 200
        this.maxPrice = e.target.value
        priceTag = '200-400'
      } else if (e.target.value == 600) {
        this.minPrice = 400
        this.maxPrice = e.target.value
        priceTag = '400-600'
      } else {
        this.minPrice = 600
        this.maxPrice = e.target.value
        priceTag = '600以上'
      }
      
      const del = this.tags.filter(tag => !this.locations.includes(tag) && !this.brands.includes(tag) && !this.rates.includes(tag))
      this.tags = this.tags.filter(tag => !del.includes(tag))
      this.tags.push(priceTag)
      this.cleanBtn = true
    },
    handleClose: function(removedTag) {
      this.tags = this.tags.filter(tag => tag !== removedTag)
      if (this.locations.includes(removedTag)) {// 删掉的是location里的tag
        this.locationDefault = '不限'
      } else if (this.brands.includes(removedTag)) {// 删掉的是brand里的tag
        this.brandNums = this.brandNums.filter(tag => tag !== removedTag)
        this.brandNums.length == 0 ? this.brandDefault = '不限' : ''
      } else if (this.rates.includes(removedTag)) {// 删掉的是rate里的tag
        this.rateNums = this.rateNums.filter(tag => tag !== removedTag)
        this.rateNums.length == 0 ? this.rateDefault = '不限' : ''
      } else {
        this.changePriceRadio()
        this.priceDefault = '不限'
      }
      this.tags.length == 0 ? this.cleanBtn = false : this.cleanBtn = true
    },
    deleteAllTags: function() {
      // 所有属性初始化
      this.tags = []
      this.brandNums = []
      this.rateNums = []
      this.curValue = null
      this.minPrice = 0
      this.maxPrice = 9999
      this.cleanBtn = false
      this.locationDefault = '不限'
      this.brandDefault = '不限'
      this.rateDefault = '不限'
      this.priceDefault = '不限'
    },
    searchPrice: function() {
      // 先删掉已有的价格标签
      const del = this.tags.filter(tag => !this.locations.includes(tag) && !this.brands.includes(tag) && !this.rates.includes(tag))
      this.tags = this.tags.filter(tag => !del.includes(tag))
      // 拼接新的价格标签
      let priceTag = this.minPrice + '-' + this.maxPrice
      this.tags.push(priceTag)
      this.priceDefault = ''
      this.curValue = null
      this.cleanBtn = true
    },
    goTo: function() {
      this.$router.push('/hotelDetail')
    }
 }
}

</script>

<style scoped>
/*--------------------------------------- 高级查询 ---------------------------------------*/
  .side-search {
    margin: 20px 0;
    font-size: 17px;
  }
  .select-div {
    margin: 20px 0;
    background: #fff;
    border: 1px solid #ddd;
    min-height: 200px;
  }

  .select-div .row-div {
    border-bottom: 1px solid #ddd;
    min-height: 30px;
    margin: 0 30px;
    padding: 20px 0;
  }

  .select-div .row-div .ant-col-4 {
    margin: 5px 0;
  }
/*--------------------------------------- 内容 ---------------------------------------*/
  .content-div {
    background: #fff;
    padding: 0 50px;
  }

  .tag-div {
    min-height: 44px;
    padding: 10px 0 10px 10px;
  }

  .tag-div .result {
    float: left;
    font-size: 12px;
    padding-right: 25px;
    color: #333;
  }

  .tag-div .result span {
    font-size: 14px;
    margin: 0 2px;
    color: #5babfc;
  }

  .sort-div {
    background-color: rgb(148, 201, 255);
    padding: 6px 20px;
    height: 45px;
    width: 100%;
    color: rgb(255, 255, 255);
  }

  .hotel-div {
    position: relative;
    width: 100%;
    height: 240px;
    box-sizing: border-box;
    padding: 30px 0;
    border-bottom: 1px solid #ddd;
  }

  .hotel-div:hover {
    background-color: #fffcf3;
  }

  .hotel-div .pic {
    float: left;
    width: 240px;
    height: 180px;
    margin-right: 25px;
  }

  .hotel-div .middle {
    float: left;
    width: 50%;
  }

  .hotel-div .middle .h-name {
    font-size: 20px;
  }

  .hotel-div .rate {
    float: right;
  }

  .hotel-div .rate .score {
    font-size: 16px;
    color: #5babfc;
  }

  .hotel-div .more {
    position: absolute;
    right: 0;
    bottom: 30px;
  }

  .hotel-div .more .price {
    margin: 0 3px 0 1px;
    font-size: 30px;
    color: #ff560a;
    font-weight: 700;
  }

  .hotel-div .more .detail-btn {
    display: block;
    width: 100px;
    height: 36px;
    color: #fd5c08;
    background: #fff;
    border: 1px solid #fd5c08;
    border-radius: 3px;
    font-size: 14px;
    -webkit-transition: 不限 .2s ease;
    transition: 不限 .2s ease;
    text-align: center;
    line-height: 34px;
  }

  .content-div .pagination {
    float: right;
    margin: 30px 0;
  }
</style>