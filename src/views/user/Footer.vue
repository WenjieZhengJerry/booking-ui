<!---->
<template>
 <!-- 尾部 -->
    <a-layout-footer :style="{ textAlign: 'center' }">
      Rooms Booking ©2019 Created by Group Four <router-link to="/admin" v-if="null!==userInfo&&1===userInfo.type">进入后台</router-link>
    </a-layout-footer>
</template>

<script>
import { user_info, setUserInfo } from '@/utils/encrypt'
import { isLogin } from '@/api/login'
import { errorTipsMap } from '@/utils/errorTips'
export default {
  name: 'Footer',
  data () {
    return {
      userInfo:null
    }
  },
  created (){
    if(null===user_info){
      isLogin().then(res => {
        if (res.success === true) {
          setUserInfo(res.data)
          this.userInfo=res.data
          return
        }
        console.log('isLogin error',errorTipsMap[res.data])
        this.userInfo=null
      }).catch(ex => {
        console.log('isLogin error',ex.message)
      })
    }
    else{
      this.userInfo=user_info
    }
  }
}

</script>
<style scoped>
</style>