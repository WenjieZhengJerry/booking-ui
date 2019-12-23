import JsEncrypt from 'jsencrypt'
import { getPublicKey, register } from '@/api/login'
import { errorTipsMap } from '@/utils/errorTips'

export let login_uid=""

// 使用rsa公钥加密
export function rsaEncrypt (text, publicKey) {
  let jse=new JsEncrypt()
  jse.setPublicKey(publicKey)
  return jse.encrypt(text)
}

export function setLoginUid(uid){
  login_uid=uid
}

export function registerUser (info, tokenInfo, cb) {
  getPublicKey(info.email).then(res => {
    if (res.success === true) {
      info.upassword=rsaEncrypt(info.upassword, res.data)
      submitInfo(info,tokenInfo,cb)
      return
    }
    cb(1,`注册失败: ${errorTipsMap[res.data]}`)
  }).catch(ex => {
    cb(2,'请求出现错误，请稍后再试',ex.message)
  })
}

function submitInfo (info,tokenInfo,cb) {
  register(info,tokenInfo).then(res => {
    if (res.success === true) {
      cb(0,'注册成功')
      return
    }
    cb(1,`注册失败: ${errorTipsMap[res.data]}`)
  }).catch(ex => {
    cb(2,'请求出现错误，请稍后再试',ex.message)
  })
}
