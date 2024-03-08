import $api from "@/api/index.ts";
import { loginType } from "@/api/login.ts";
// 获取所有设备
export const getAllDevice = () => {
  return $api.get("/getAllDevice");
};
// 获取所有维修设备
export const getRepairDevice = () => {
  return $api.get("/getRepairDevice");
};

//设置维修设备
export const updateDeviceStatus = (deviceId: number,deviceStatus:String) => {
  return $api.post("/updateDeviceStatus", { deviceId ,deviceStatus});
};

//删除设备
export const deleteDevice = (deviceId: number) => {
  return $api.post("/deleteDevice", { deviceId });
};
//根据id获取设备信息
export const getDeviceById = (deviceId) => {
  return $api.get(`/getDeviceById?deviceId=${deviceId}`);
}

export const getDeviceNumInfo=()=>{
  return $api.get("/getDeviceNumInfo");
}
