import JsEncrypt from 'jsencrypt'

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
