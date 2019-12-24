import JsEncrypt from 'jsencrypt'
import { getPublicKey, register } from '@/api/login'
import { errorTipsMap } from '@/utils/errorTips'

export let login_uid=""

// 使用rsa公钥加密,text:要加密的文本,publicKey：rsa公钥
export function rsaEncrypt (text, publicKey) {
  let jse=new JsEncrypt()
  jse.setPublicKey(publicKey)
  return jse.encrypt(text)
}

export function setLoginUid(uid){
  login_uid=uid
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
      submitInfo(info,tokenInfo,cb)
      return
    }
    cb(1,`注册失败: ${errorTipsMap[res.data]}`)
  }).catch(ex => {
    cb(2,'请求出现错误，请稍后再试',ex.message)
  })
}
//在registerUser将密码加密后调用执行提交信息的函数
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


