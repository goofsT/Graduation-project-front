import { defineStore } from 'pinia'
export const useCurrentDevice = defineStore({
  id: 'currentDevice', // 每个 store 都需要一个唯一的 id
  state: () => ({
    device: {},
  }),
  actions: {
    setDeviceInfo(info) {
      this.device = info;
    },
    getDevice(){
     return this.device;
    }
  }
});