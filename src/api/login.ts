import $api from "@/api/index.ts";


export interface loginType {
  username:String,//用户名
  password:String//密码
}

export interface RegisterType {
  username:String,//用户名
  password:String,//密码
  realname:String,//真实姓名
  telphone:String,//手机号
  cardnum:String,//身份证号
}

export interface ResetPwdType{
  realname:String,//真实姓名
  cardnum:String,//身份证
  newpassword:String//新密码
}
export const login = (data: loginType) => {
  return $api.post("/user/login", data);
};

export const register= (data: RegisterType) => {
  return $api.post("/user/register", data);
}

export const resetPassword=(data:ResetPwdType)=>{
  return $api.post('/user/resetPwd',data)
}

