import $api from "@/api/index.ts";

export const getUserList = () => {
  return $api.get('/user/getUserList')
}

export const deleteUser=(id)=>{
  return $api.post('/user/deleteUser',{id})
}

export const setRole=(id,permission)=>{
  return $api.post('/user/setRole',{id,permission})
}

export const getUserByText=(text)=>{
  return $api.get('/user/getUserByText?text='+text)
}