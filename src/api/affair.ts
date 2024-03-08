import $api from "@/api/index.ts";

export const  getAllAffairs=()=> {
  return $api.get('/getAffairs');
}

export const getTodyAffairList=()=> {
  return $api.get('/getTodayAffairs');
}

export const  deleteAffair=(affairId)=> {
  return $api.post(`/deleteAffair`,{affairId});
}

export const getAffairNumInfo=()=> {
  return $api.get('/getAffairNumInfo');
}

export const getAffairByDate=(date)=> {
  return $api.get(`/getAffairByDate?date=${date}`);
}