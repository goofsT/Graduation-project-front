import $api from "@/api/index.ts";
// 获取所有教室信息
export const getAllClassRoom = () => {
  return $api.get("/getClassRoom");
};

//根据时间获取空闲教室
export const getFreeClassRoom = (time: string) => {
  return $api.get(`/getClassRoomFreeByTime?time=${time}`);
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

//更新教室状态
export const updateClassRoomStatus = (roomId: number, status: String) => {
  return $api.post("/updateClassRoomStatus", { roomId, status });
};

//根据教室id获取教室信息
export const getClassRoomById = (roomId) => {
  return $api.get(`/getClassRoomById?roomId=${roomId}`);
}
//获取教室使用情况
export const getRoomNumInfo=()=>{
  return $api.get("/getRoomNumInfo");
}

//获取教室即将上课的课程
export const getRoomSoonCourse=(roomId)=>{
  return $api.get(`/getRoomSoonCourse?roomId=${roomId}`);
}

export const getStudentNumToday=()=>{
  return $api.get("/getTodayStudentNum");
}