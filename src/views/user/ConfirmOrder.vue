<template>
<a-locale-provider :locale="zh_CN">
  <a-layout id="components-layout-demo-fixed">
    <!-- 头部 -->
    <v-header />
    <a-layout-content :style="{ padding: '0 50px', marginTop: '90px' }">
      <div class="left">
        <div class="section">
          <div class="title">预订信息</div>
          <div class="input-box">
            <label>入住日期：</label>
            <a-date-picker class="input-box-2" :defaultValue="startTime" disabled />
            <label>离店日期：</label>
            <a-date-picker class="input-box-2" :defaultValue="endTime" disabled />
            <label>房间数量：</label>
            <a-select v-model="count" style="width: 120px">
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
              <a-select-option value="3">3</a-select-option>
            </a-select>
          </div>
          <!-- <div class="hotel-box">
            <div class="hotel">
              <span>11月28日</span>
              <span>2间</span>
              <span>含单早</span>
              <span style="color: #fd5c08;">￥1800.00</span>
            </div>
            <div class="hotel">
              <span>11月29日</span>
              <span>2间</span>
              <span>含单早</span>
              <span style="color: #fd5c08;">￥1800.00</span>
            </div>
          </div> -->
          <div class="gift-box">
            <div class="gift-notice">
              <a-icon type="gift" theme="twoTone" />
              <span>此价格含礼包，会员本人入住酒店可赠送礼包</span>
            </div>
            <p> 享礼包3选1（限入住期间送1次） 项目一：免费体验酒店用餐服务一次 项目二：免费体验酒店洗衣服务一次 项目三：免费体验酒店美发服务一次</p>
          </div>
        </div>
        <div class="section">
          <div class="title">入住信息</div>
          <div class="input-box">
            <label>联系人：</label>
            <a-input class="input-box-2" v-model="checkInPerson" style="width: 150px" placeholder="真实姓名" allowClear/>
            <label>手机号码：</label>
            <a-input class="input-box-2" v-model="telephone" style="width: 180px" maxlength="11" placeholder="仅支持大陆手机号码" allowClear/>
          </div>
          <div class="input-box">
            <div>
              <a-checkbox :defaultChecked="isChecked" @change="changeUser" style="width: 0"/>
              <span>
                入住人和联系人<span v-if="isChecked">相</span><span v-else>不</span>同（* 友情提示：会员本人入住时，享会员权益）
              </span>
            </div>
            <div class="contact" v-if="!isChecked">
              <div class="extra">
                <label>入住人1</label>
                <a-input class="input-box-2" style="width: 150px" v-model="userName1" placeholder="真实姓名" allowClear/>
                <p class="error" v-if="userName1 == null || userName1 == ''">*必填</p>
              </div>
              <div class="extra">
                <label>入住人2</label>
                <a-input class="input-box-2" style="width: 150px" v-model="userName2" placeholder="真实姓名" allowClear/>
                <p class="error" v-if="userName2 == null || userName2 == ''">*必填</p>
              </div>
            </div>
          </div>
          <div class="input-box">
            <label>特殊需求</label>
            <br>
            <a-checkbox-group class="special-need" @change="handleChangeRemark">
              <a-checkbox value="无烟房" style="width: 0" /> <span>无烟房</span>
              <a-checkbox value="高层客房" style="width: 0" /> <span>高层客房</span>
              <a-checkbox value="相邻房" style="width: 0" /> <span>相邻房</span>
            </a-checkbox-group>
            <!-- <a-checkbox value="extraRemark" style="width: 0" :defaultChecked="isRemarked" @change="remarkFunc" /> <span>备注</span> -->
            <!-- <a-textarea placeholder="还有什么能帮你" v-model="extraRemark" class="remark" v-if="isRemarked" :rows="3" maxlength="256" /> -->
          </div>
        </div>
        <div class="section" style="border-bottom: 0">
          <div class="title">支付与优惠信息</div>
          <div class="radio-box">
            <label class="radio-left">支付方式</label>
            <a-radio-group v-model="payType">
              <a-radio :style="radioStyle" value="CASH" disabled>门店现付</a-radio>
              <a-radio :style="radioStyle" value="ONLINE">支付全部房费</a-radio>
            </a-radio-group>
          </div>
          <div class="input-box" v-if="payType == 'ONLINE'">
            <label>优惠券</label>
            <a-select disabled defaultValue="none" style="margin-left: 23px;">
              <a-select-option value="none">无可用优惠券</a-select-option>
            </a-select>
          </div>
          <div class="tip-box">
            <b>取消政策：</b>
            <span>预付房费后，在2019年11月28日 18:00前可免费取消订单/申请退款，逾期取消或变更，将收取首晚房费。</span>
            <br>
            <b>温馨提示：</b>
            <span>酒店于住店当天12:00后办理入住，离店当天12:00前办理退房，入离日期以当地时间为准。如您在12:00前到达，可能需要等待方能入住。若超过房间最多入住人数，则可能需要补差价或酒店拒绝入住，具体以酒店安排为准。</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="section">
          <div class="pic">
            <img :src="room.img">
            <!-- <img :src="'/api/' + room.img"> -->
          </div>
          <p class="title">{{ hotel.hname }}</p>
          <p class="address">地址：{{ hotel.address }} </p>
        </div>
        <div class="section">
          <div class="label">房间名称</div>
          <p>
            {{ room.rname }}
            <span>{{ count }}间</span>
          </p>
          <div class="label">入住房型</div>
          <p>{{ room.type | roomTypeFilter }}</p>
          <div class="label">入住日期</div>
          <p>
            {{ startTime.format('YYYY-MM-DD') }} 至 {{ endTime.format('YYYY-MM-DD') }}
            <span>{{ endTime.date() - startTime.date() }}晚</span>
          </p>
          <div class="price-detail">
            <p>
              房型单价：
              <span>￥{{ room.price }}</span>
            </p>
          </div>
          <div class="price-detail">
            <p>
              房费小计：
              <span>￥{{ count * room.price * (endTime.date() - startTime.date()) }}</span>
            </p>
          </div>
        </div>
        <div class="section" style="border-bottom: 0">
          <div class="price-total">
            总金额：
            <span>
              ￥<b>{{ count * room.price * (endTime.date() - startTime.date()) }}</b>
            </span>
          </div>
          <a-button class="order-btn" :loading="isLoading" type="primary" :disabled="!isRead" @click="pay">提交订单</a-button>
          <div class="protocol">
            <a-checkbox :defaultChecked="isRead" @change="readProtocl" value="1" style="width: 10px" /> 
            <span>已阅读并同意<a @click="showModal">《RoomsBooking酒店预订须知》</a></span>
            <a-modal title="RoomsBooking酒店预订须知" v-model="visible" @ok="handleOk" :width="600" >
              <template slot="footer">
                <a-button key="close" type="primary" @click="handleOk">
                  关闭
                </a-button>
              </template>
              <div class="modal-section">
                <h3>RoomsBooking网站酒店预订条款</h3>
                本预订条款在您和“锦江旅行家”网站运营公司上海锦江国际电子商务有限公司（以下简称我方）之间订立，您通过“锦江旅行家”网站申请，由我方协助预订酒店服务时受此条款约束。
                <br>
                我方仅提供酒店预订相关的在线信息服务平台，在法律性质上，我方是为酒店提供电子商务平台服务的IT服务供应商，提供帮助您预订酒店的信息服务，
                <b>相关酒店住宿服务由实际入住酒店(以下简称酒店)提供，相应的权利义务和法律责任由酒店或第三方依法自行承担，住宿过程中您与酒店或第三方发生纠纷，我方不承担任何责任。</b>
                <br>
                一、 基本预订条款
                <br>
                1.订单确认：请将您需预订的酒店、房型、房价及入住时间、人员信息等在本页面提交。您成功提交的订单通常在15分钟内可以得到酒店预订系统终端的自动确认。
                <br>
                2.最晚保留时间：通常酒店将根据您的订单类型保留您的预订房间至以下最晚保留时间，过时将不能确保有房可供。万一您的预订经确认后在最晚保留时间内出现到店无房的情况，请第一时间联系我方，以便我方与酒店核实后给您回复，我方将协助您解决此问题。
                <br>
                普通订单的最晚保留时间：较多酒店的最晚保留时间为入住当日的18：00，但具体酒店可能因不同地理位置、淡季旺季等原因而有所不同；
                <br>
                担保订单的最晚保留时间：酒店将为您保留客房至约定入住第一天的次日中午12：00；
                <br>
                预付订单的最晚保留时间：酒店将为您保留客房至约定离店日期的中午12：00。
                <br>
                3.入住担保：部分酒店在特定的时间段有规定的最晚保留时间(以预订页面提示为准)，如您预计入住时间将迟于最晚保留时间，须预付首晚房费作为入住担保，具体以页面提示或我方的客服确认为准。
                <br>
                4.预付订单：部分酒店在特定的时间段有规定的特价预付订单，鉴于预付订单的特殊情况，此类订单一旦确认与支付后，将不能取消、不能退款或者退还积分。
                <br>
                5.若因IT系统原因导致的数据传输延时等错误引发的订单异常情况，我方会及时联系您协调相应的解决方案。
                <br>
                <b>二、 预订类型及特殊条款</b>
                <br>
                （一）酒店预订分为普通订单、担保订单和预付订单三种类型，请根据您的预订仔细阅读相应的特殊预订条款。
                <br>
                （二）普通订单：指无需预先支付费用的订单。此类型订单，酒店为您保留至最晚保留时间（大部分酒店通常保留至入住当日的18：00，但不同酒店在不同时段视情况、政策不同而不同），您若未及时到店，酒店有权取消保留并将所预订的房间对外开放销售。
                <br>
                1.订单确认：您选择提交订单按钮后，订单才正式传送至酒店预订系统。若您收到我方发送的相关确认邮件或短信通知，表明您的预订已成功，并得到酒店确认。本订单成立，即预约合同成立。您可以在会员中心查询到订单信息，订单状态为“已确认”。
                <br>
                2.入住与结算：请您直接到酒店前台登记入住，普通订单的结账方式为酒店前台支付，请您按酒店规定结算费用，并向酒店索取发票。
                <br>
                3.订单修改：在线修改订单仅支持修改联系人信息，如需修改其他内容请在线取消原订单并提交新的订单或致电我方的客服热线1010-1666。
                <br>
                4.订单取消：普通订单的取消无须支付任何费用。
                <br>
                （三）担保订单：指需预先支付首晚房费作为入住担保的订单。此类型订单，酒店将为您保留客房至约定入住第一天的次日中午12：00，即使您未到店，酒店也不能出售给第三方。无论您是否实际入住，酒店将从您约定入住当日开始计收房费，如您未在前述保留时间之前到店，所订客房将不再为您保留。
                <br>
                1.订单确认与支付：您选择提交订单按钮后，订单才正式传送至酒店预订系统，请您在页面提示的规定时间内将担保费用支付完毕。若您收到我方发送的相关确认邮件或短信通知，表明您的预订已成功，并得到酒店确认。本订单生效，即预约合同生效。您可以在会员中心查询到订单信息，订单状态为“支付成功”。因酒店预订系统有房方可对外开放销售，因此已提交的订单仅保留30分钟以免影响后续销售。如您未在规定时间内完成支付，该订单在提交后的30分钟将自动取消。届时如不能顺利入住酒店，我方将不承担任何责任。若系统出现非正常订单情况，我方保留对预订规则进行修订或者采取其他临时应对措施之权利。
                <br>
                2.我方可提供以下支付方式：我方可提供以下支付方式：（1）在线支付：有资质的非金融支付机构或网上银行。在线支付时请注意使用官方途径，防止钓鱼网站诈骗。（2）电话支付：您可致电我方的客服热线1010-1666，选择您持有的支持电话支付的银行卡进行电话支付，请注意：电话支付请按系统语音提示操作，我方的客服人员不会要求您提供银行卡号与密码，请注意防范电话支付的相关风险。
                <br>
                3.最晚修改及取消时间：担保订单有规定的最晚修改及取消时间（下称“最晚取消时间”）。在最晚取消时间前修改或取消订单，您预付的房费将全额退还；在最晚取消时间之后修改或取消订单，除非经我方认可的不可抗力等情况，您预付的房费将被全额扣除。。我方在预订页面上已向您提示了订单的最晚取消时间，发送给您的预订确认邮件中会再次告知您最晚取消时间，请务必注意。
                <br>
                4.应到未到订单：若您未按照预订日期入住酒店且未按上述第3条在最晚取消时间前取消酒店的担保订单，我方将扣除您已预付的首晚全额房费作为违约金，
                <b>并且自约定入住第一天之次日12：00起不再为您保留。</b>
                <br>
                5.入住与结算：请您直接到酒店前台登记入住，并按酒店的规定结算超出预付部分的房费及其它费用（若有）。所有支付费用（包括预付部分）的发票请向酒店前台索取。
                <br>
                6.关于退款：若您符合我方的退款政策，您的退款将通过原途径退回；采用锦江E卡通支付的，将退还原卡原帐户（因此即使您的E卡通余额为零，仍请妥善保存至当次消费结束后至少30天）。由于非金融支付机构或银行的原因，退款过程可能约需7-15个工作日。如需退款请致电我方的客服热线1010-1666。
                <br>
                （四）预付订单：指需预先支付全额房费的订单。此类型订单，酒店将为您保留客房至约定离店日期的中午12：00，即使您未到店，酒店也不能出售给第三方。无论您是否实际入住，酒店将从您约定入住当日开始计收房费。
                <br>
                1.订单确认与支付：您选择提交订单按钮后，订单才正式传送至酒店预订系统，请您在页面提示的规定时间内将订单费用全额支付完毕。若您收到我方发送的相关确认邮件或短信通知，表明您的预订已成功，并得到酒店确认。本订单生效，即预约合同生效。您可以在会员中心查询到订单信息，订单状态为“支付成功”。因酒店预订系统有房方可对外开放销售，因此已提交的订单仅保留30分钟以免影响后续销售。如您未在规定时间内完成支付，该订单在提交30分钟后将自动取消。届时如不能顺利入住酒店，我方将不承担任何责任。若系统出现非正常订单情况，我方保留对预订规则进行修订或者采取其他临时应对措施之权利。
                <br>
                2.我方可提供以下支付方式：（1）在线支付：有资质的非金融支付机构或网上银行。在线支付时请注意使用官方途径，防止钓鱼网站诈骗。（2）电话支付：您可致电我方的客服热线0000-0000，选择您持有的支持电话支付的银行卡进行电话支付，请注意：电话支付请按系统语音提示操作，我方的客服人员不会要求您提供银行卡号与密码，请注意防范电话支付的相关风险。
                <br>
                3.预付订单一旦确认支付，不论发生任何情况，订单不能修改、不能取消。
                <br>
                4.应到未到订单：
                <b>若您未按照预订日期入住酒店，我方将扣除您已预付的全额房费，并且自约定离店日期的中午12：00起不再为您保留。</b>
                <br>
                5.入住与结算：请您直接到酒店前台登记入住，并按酒店的规定结算超出预付部分的房费及其它费用（若有）。所有支付费用（包括预付部分）的发票请向酒店前台索取。
                <br>
                6.关于退款：
                <b>预付订单确认支付后不能退款。</b>
                <b>若您的订单中使用了积分兑换，则适用以下条款：</b>
                <br>
                本订单是您同意全部或者部分使用积分兑换的形式而获取相关酒店住宿产品，请您在提交订单前确认：
                <br>
                积分兑换奖励住宿条款
                <br>
                1. 订单确认与积分抵扣：请将您需预订的酒店、房型、房价及入住时间、人员信息等在本页面完成积分兑换及提交。您成功提交的订单通常在15分钟内可以得到酒店预订系统终端的自动确认。若您收到我方发送的相关确认邮件或短信通知，表明您的预订已成功，并得到酒店确认。本订单生效，即预约合同生效。您可以在会员中心查询到订单信息，订单状态为“支付成功”。
                <br>
                2. 因酒店预订系统有房方可对外开放销售，因此已提交积分兑换订单在未支付时系统自动保留30分钟以免影响后续销售。如您未在规定时间内完成积分确认扣除，该订单在提交后的30分钟将自动取消。届时如不能顺利入住酒店，我方将不承担任何责任。若系统出现非正常订单情况，我方保留对预订规则进行修订或者采取其他临时应对措施之权利。
                <br>
                3. 最晚保留时间：使用积分兑换的奖励住宿酒店将根据您的订单类型保留您的房间至以下最晚保留时间，过时将不保留。您的预订经确认后在保留时间内出现到店无房的情况，请第一时间联系我方，以便我方与酒店核实后给您回复，我方将协助您解决此问题。
                <br>
                <b>担保订单的最晚保留时间：酒店将为您保留客房至约定入住第一天的次日中午12：00；</b>
                <br>
                <b>预付订单的最晚保留时间：酒店将为您保留客房至约定离店日期的中午12：00。</b>
                <br>
                4. 若因IT系统原因导致的数据传输延时等错误引发的订单异常情况，我方会及时联系您协调相应的解决方案。
                <br>
                5. 我方可提供以下方式进行积分兑换奖励住宿：（1）在线兑换。（2）电话兑换：您可致电“RoomsBooking”客服热线0000-0000，选择您所需预订酒店及房型，客服人员将会核对您的相关信息后为您提供积分所兑换的相应服务，便于您及时订房。
                <br>
                最晚修改及取消时间：对于担保订单，积分兑换奖励住宿有规定的最晚修改及取消时间（下称“最晚取消时间”）。
                <b>在最晚取消时间前修改或取消订单，您所使用的相应积分将全部退还；无任何手续费用。在最晚取消时间之后修改或取消订单，除非经我方认可的不可抗力等情况，您用于兑换的积分将不予退还。</b>
                我方在预订页面上已向您提示了订单的最晚取消时间，发送给您的预订确认邮件中会再次告知您最晚取消时间，请务必注意。
                <b>对于预付订单，积分兑换奖励住宿后不能修改及不能取消。</b>
                <br>
                6. 应到未到订单：对于担保订单，若您未按照预订日期入住酒店且未按上述第5条在最晚取消时间前取消订单，您用于兑换的积分不予返还；
                <b>对于预付订单，积分一旦兑换，您用于兑换的积分将不予返还。</b>
                <br>
                7. 
                <b>入住与结算：</b>
                请您直接到酒店前台登记入住，并按酒店的规定结算超出积分兑换部分的房费及其它费用（若有）。使用积分兑换的消费部分酒店将不再开具发票。
                <br>
                8. 关于积分退还：若您符合我方的积分退还政策，您的积分约需7-15个工作日退还到您的会员账户中。详情可致电“RoomsBooking”客服热线000-000-0000。
                <br>
                9. 使用积分兑换的奖励住宿消费将不再累积礼享积分。
                <br>
                10. 如您或酒店遇不可力抗因素如：战争，疫病，政府行为，自然灾害，国家规定禁止入境，或酒店遭遇其他不可力抗因素无法正常营业等情况的，应通知对方，依法免予承担违约责任。
                <br>
                本条款自公布生效之日起施行。若有修改，将不再进行单独通知，自修改发布生效之日起施行。执行中遇到的问题，由上海锦江国际电子商务有限公司进行解释。
                <br>
                如您需要相关的帮助，欢迎致电“RoomsBooking”客服热线000-000-0000。
              </div>
            </a-modal>
          </div>
        </div>
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
import Header from './Header'
import Footer from './Footer'
import moment from 'moment'
import { confirmOrder } from '@/api/order'
import { user_info } from '@/utils/encrypt'

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

export default {
  name: 'ConfirmOrder',
  components: {
    'v-header': Header,
    'v-footer': Footer
  },
  filters: {
    roomTypeFilter (type) {
      return roomTypesMap[type].text
    }
  },
  data () {
    return {
      zh_CN,
      isChecked: true,
      userName1: null,
      userName2: null,
      isRemarked: false,
      isLoading: false,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      isRead: false,
      visible: false,
      user: undefined,
      hotel: undefined,
      room: undefined,
      startTime: undefined,
      endTime: undefined,
      checkInPerson: undefined,
      telephone: undefined,
      remark: '',
      count: 1,
      payType: 'ONLINE'
    };
  },
  created: function() {
    this.getParams()
  },
  methods: {
    moment,
    getParams: function() {
      this.user = this.$route.params.user
      this.hotel = this.$route.params.hotel
      this.room = this.$route.params.room
      this.startTime = this.$route.params.startTime
      this.endTime = this.$route.params.endTime
      // this.checkInPerson = this.user.uname
      // this.telephone = this.user.telephone
      this.checkInPerson = user_info.uname
      this.telephone = user_info.telephone
    },
    changeUser: function() {
      this.isChecked = !this.isChecked
    },
    handleChangeRemark: function(checkedValues) {
      this.remark = checkedValues.join(",")
    },
    remarkFunc: function() {
      this.isRemarked = !this.isRemarked
    },
    readProtocl: function() {
      this.isRead = !this.isRead
    },
    showModal: function() {
      this.visible = true;
    },
    handleOk: function() {
      this.visible = false;
    },
    pay: function() {
      let param = {
        'startTime': this.startTime/*.format("YYYY-MM-DD HH:mm:ss")*/,
        'endTime': this.endTime/*.format("YYYY-MM-DD HH:mm:ss")*/,
        'count': this.count,
        'checkInPerson': !this.isChecked && this.userName1 != null && this.userName2 != null ? this.userName1 + "," + this.userName2 : this.checkInPerson,
        'telephone': this.telephone,
        'remark': this.remark,
        'payType': this.payType,
        'rid': this.room.rid,
        'totalPrice': this.count * this.room.price * (this.endTime.date() - this.startTime.date())
      }
      // console.log(param)
      this.isLoading = true
      confirmOrder({ ...param })
        .then(res => {
          if (res.success === true) {
            // console.log("预订成功，请付款")
            this.isLoading = false
            this.$router.push({
              name: 'Pay',
              params: {
                hotel: this.hotel,
                roomType: this.$options.filters['roomTypeFilter'](this.room.type),
                startTime: this.startTime.format("YYYY-MM-DD"),
                endTime: this.endTime.format("YYYY-MM-DD"),
                totalPrice: this.count * this.room.price * (this.endTime.date() - this.startTime.date()),
                oid: res.data.oid
              }
            })
          } else {
            this.$message.error(`预订失败: ${res.data}`)
          }
        })
        .catch(err => {
          this.$message.error(`预订异常: ${err.message}`)
        })
    }
  }
}

</script>

<style scoped>
/* --------------------------left-------------------------- */
.left {
  float: left;
  width: 1060px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #ddd;
  margin-bottom: 50px;
  min-height: 300px;
}

.left .section {
  padding: 30px 50px 40px 50px;
  border-bottom: 1px solid #ddd;
}

.left .section .title {
  font-size: 18px;
  color: #333;
  border-left: 2px solid #5babfc;
  height: 20px;
  line-height: 20px;
  padding-left: 10px;
  margin-bottom: 30px;
}

.left .section .input-box {
  position: relative;
  padding-bottom: 30px;
  width: 100%;
}

.left .section .input-box label {
  height: 30px;
  line-height: 30px;
  width: 64px;
  color: #333;
  margin-right: 8px;
  font-weight: 700;
}

.left .section .input-box .input-box-2 {
  margin-right: 46px;
}

.left .section .hotel-box {
  background: #e9f4ff;
  padding: 15px 0 0 0;
  height: 105px;
}

.left .section .hotel-box .hotel {
  width: 70px;
  height: 78px;
  background: #fff;
  margin: 0 0 15px 15px;
  box-sizing: border-box;
  padding: 4px 0;
  float: left;
}

.left .section .hotel-box .hotel span {
  text-align: center;
  display: block;
  font-size: 12px;
}

.left .gift-box {
  position: relative;
  width: 100%;
  background: #e9f4ff;
  font-size: 12px;
  margin: 60px 0 0 0;
  padding: 15px 0 5px 15px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.left .gift-box .gift-notice {
  position: absolute;
  top: -25px;
  left: 0;
}

.left .gift-box .gift-notice span {
  display: inline-block;
  height: 19px;
  line-height: 19px;
}

.left .gift-notice p {
  line-height: 2;
}

.left .contact {
  width: 100%;
  height: 80px;
  background: #f7f7f7;
  margin-top: 10px;
  padding: 10px 20px;
  box-sizing: border-box;
}

.left .contact .extra {
  position: relative;
  float: left;
  margin: 15px 0;
}

.left .contact .extra .error {
  position: absolute;;
  bottom: -36px;
  left: 63px;
  line-height: 28px;
  color: red;
  font-size: 12px;
}

.left .special-need span {
  margin-right: 30px;
}

.left .remark {
  background-color: #f7f7f7;
  margin-top: 10px;
}

.left .radio-box {
  margin-bottom: 30px;
}

.left .radio-box .radio-left {
  float: left;
  margin-right: 20px;
  margin-top: 5px;
  color: #333;
  font-weight: 700;
}

.left .tip-box {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ddd;
  background: #f7f7f7;
}

/* --------------------------right-------------------------- */
.right {
  float: right;
  width: 320px;
  box-sizing: border-box;
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.right .section {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.right .section .pic {
  width: 280px;
  height: 210px;
  margin: 0 auto;
}

.right .section img {
  width: 100%;
  min-height: 100%;
  max-height: 100%;
}

.right .section p {
  font-size: 14px;
  margin: 5px 0;
}

.right .section .title {
  font-size: 18px;
  margin-top: 20px;
}

.right .section .address {
  font-size: 12px;
  margin-top: 10px;
}

.right .section .label {
  color: #999;
}

.right .section p span {
  float: right;
  font-size: 12px;
  color: #999;
}

.right .section .price-detail {
  margin-top: 25px;
}

.right .section .price-detail p {
  font-size: 12px!important;
  color: #999;
}

.right .section .price-detail p span {
  font-size: 14px;
  color: #333;
}

.right .section .price-total {
  font-size: 14px;
  color: #333;
  height: 25px;
  line-height: 25px;
}

.right .section .price-total span {
  float: right;
  font-size: 16px;
  color: #fd5c08;
}

.right .section .price-total span b {
  font-size: 30px;
  font-weight: 400;
}

.right .section .order-btn {
  display: block;
  width: 200px;
  height: 35px;
  font-size: 16px;
  margin: 20px auto 15px auto;
  border-radius: 3px;
  border: none;
}

.right .section .protocol {
  text-align: center;
  color: #999;
  font-size: 12px;
}

/* --------------------------modal-------------------------- */

.modal-section {
  max-height: 400px;
  overflow-y: auto;
  font-size: 12px;
}

.modal-section h3 {
  font-size: 16px;
  color: #5babfc;
  margin-bottom: 5px;
  text-align: center;
}

</style>