import { defineStore } from 'pinia'
import {getAllDevice} from "@/api/device.ts";

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
        const res=await getAllDevice()
        this.device=res.data;
        localStorage.setItem('deviceInfo', JSON.stringify(res.data));
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