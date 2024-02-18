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
