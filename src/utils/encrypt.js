import JsEncrypt from 'jsencrypt'
import { getPublicKey, register, login } from '@/api/login'
import { errorTipsMap } from '@/utils/errorTips'

export let user_info=null

export function setUserInfo(info){
  user_info=info
}

// 使用rsa公钥加密,text:要加密的文本,publicKey：rsa公钥
export function rsaEncrypt (text, publicKey) {
  let jse=new JsEncrypt()
  jse.setPublicKey(publicKey)
  return jse.encrypt(text)
}

//注册用户
//info: 至少包含email和upassword属性
//token:验证码以及验证码token ,属性名为code和token
//cb:注册结束(成功/失败)后调用的函数，参数为(int status,String message)
//status:注册结果0:注册成功,1:注册失败,2:发生异常
export function registerUser (info, tokenInfo, cb) {
  getPublicKey(info.email).then(res => {
    if (res.success === true) {
      info.upassword=rsaEncrypt(info.upassword, res.data)
      submitRegisterInfo(info,tokenInfo,cb)
      return
    }
    cb(1,`注册失败: ${errorTipsMap[res.data]}`)
  }).catch(ex => {
    cb(2,'请求出现错误，请稍后再试')
    console.log('请求出现错误，请稍后再试',ex.message)
  })
}
//在registerUser将密码加密后调用执行提交信息的函数
function submitRegisterInfo (info,tokenInfo,cb) {
  register(info,tokenInfo).then(res => {
    if (res.success === true) {
      cb(0,'注册成功')
      return
    }
    cb(1,`注册失败: ${errorTipsMap[res.data]}`)
  }).catch(ex => {
    cb(2,'请求出现错误，请稍后再试')
    console.log('请求出现错误，请稍后再试',ex.message)
  })
}


export function loginUser (info, cb) {
  return getPublicKey(info.email).then(res => {
    if (res.success === true) {
      info.upassword=rsaEncrypt(info.upassword, res.data)
      submitLoginInfo(info,cb)
      return
    }
    cb(1,`登录失败: ${errorTipsMap[res.data]}`)
  }).catch(ex => {
    cb(2,'请求出现错误，请稍后再试')
    console.log('请求出现错误，请稍后再试',ex.message)
  })
}
function submitLoginInfo (info,cb) {
  return login(info).then(res => {
    if (res.success === true) {
      // setCookie(LOGIN_USER_COOKIE, JSON.stringify(res.data), 1)
      setUserInfo(res.data)
      cb(0,'登录成功')
      return
    }
    cb(1,`登录失败: ${errorTipsMap[res.data]}`)
  }).catch(ex => {
    cb(2,'请求出现错误，请稍后再试')
    console.log('请求出现错误，请稍后再试',ex.message)
  })
}

