import $api from "@/api/index.ts";
// 获取所有教师
export const getAllTeacher = () => {
  return $api.get("/getAllTeacher");
}

export const getTeacherByText=(text)=>{
  return $api.get('/getTeacherByText?text='+text)
}

export const deleteTeacher = (teacherId: number) => {
  return $api.post(`/deleteTeacher`, { teacherId });
}

export const addTeacher = (teacher: any) => {
  return $api.post(`/addTeacher`, { ...teacher});
}

export const updateTeacher = (teacher: any) => {
  return $api.post(`/updateTeacher`, { ...teacher});
}
