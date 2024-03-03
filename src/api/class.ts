import $api from "@/api/index.ts";
// 获取所有班级
export const getAllClass = () => {
  return $api.get("/getAllClass");
}

export const deleteClass = (classId: number) => {
  return $api.post(`/deleteClass`, { classId });
}

export const addClass = (classInfo: any) => {
  return $api.post(`/addClass`, { ...classInfo});
}

export const updateClass = (classInfo: any) => {
  return $api.post(`/updateClass`, { ...classInfo});
}
