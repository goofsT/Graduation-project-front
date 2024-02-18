import $api from "@/api/index.ts";
// 获取所有教室信息
export const getAllClassRoom = () => {
  return $api.get("/getClassRoom");
};

//获取维修中的教室
export const getRepairClassRoom = () => {
  return $api.get("/getRepairClassRoom");
};
// 获取单个教室信息
export const getClassRoom = () => {
  return $api.get("/getOneClassRoom");
};

//获取指定楼指定层所有教室信息
export const getClassRoomByFloor = (building: string, floor: string) => {
  return $api.get(`/getClassRoomByFloor?building=${building}&floor=${floor}`);
};
