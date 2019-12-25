<!---->
<template>
 <!-- 尾部 -->
    <a-layout-footer :style="{ textAlign: 'center' }">
      Rooms Booking ©2019 Created by Group Four <router-link to="/admin" v-if="null!==userInfo&&1===userInfo.type">进入后台</router-link>
    </a-layout-footer>
</template>

<script>
import { user_info } from '@/utils/encrypt'
export default {
  name: 'Footer',
  data () {
    return {
      userInfo:null
    }
  },
  created (){
    this.userInfo=user_info
  }
}

</script>
<style scoped>
</style>