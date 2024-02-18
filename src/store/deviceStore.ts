import { defineStore } from 'pinia'
import {getAllDevice} from "@/api/device.ts";
import { ElMessage } from "element-plus";

export const useDeviceStore = defineStore({
  id: 'device', // 每个 store 都需要一个唯一的 id
  state: () => ({
    device: [],
  }),
  actions: {
    async setDeviceInfo(data=[]) {
      if(data.length>0){
        this.device=data;
        localStorage.setItem('deviceInfo', JSON.stringify(data));
      }else{
       try{
         const res=await getAllDevice()
         if(res.code !== 200 || !res.data || !res.data.length) {
           ElMessage.warning('获取设备信息失败！');
           return;
         }
         this.device=res.data;
         localStorage.setItem('deviceInfo', JSON.stringify(res.data));
       }catch (e) {
         ElMessage.warning('获取设备信息失败！');
       }
      }
    },
    async updateDeviceInfo(data) {
      const res=await getAllDevice()
      this.device=res.data;
      localStorage.setItem('deviceInfo', JSON.stringify(res.data));
    },
   async getDeviceInfo(){
      if(this.device.length>0) {
        return this.device;
      }else{
        await this.setDeviceInfo()
        return this.device;
      }
    }
  }
});