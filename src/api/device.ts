import $api from "@/api/index.ts";
import { loginType } from "@/api/login.ts";
// 获取所有设备
export const getAllDevice = (data: loginType) => {
  return $api.get("/getAllDevice", data);
};
// 获取所有维修设备
export const getRepairDevice = (data: loginType) => {
  return $api.get("/getRepairDevice", data);
};
