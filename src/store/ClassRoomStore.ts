import { defineStore } from 'pinia'
import{getAllClassRoom} from "@/api/ClassRoom.ts";
import { ElMessage } from "element-plus";
export const useClassRoomStore = defineStore({
  id: 'classRoom', // 每个 store 都需要一个唯一的 id
  state: () => ({
    classRoom: [],
  }),
  actions: {
    async setClassRoom() {
      try{
        const res = await getAllClassRoom();
        if(res.code !== 200 || !res.data || !res.data.length) {
          ElMessage.warning('获取教室失败！');
          return;
        }
        this.classRoom = res.data;
        localStorage.setItem('classRoom', JSON.stringify(res.data));
      }catch (e) {
        ElMessage.warning('获取教室失败,请检查网络');
      }
    },
    async getClassRoom(){
      const roomInfo=localStorage.getItem('classRoom');
      if(roomInfo){
        this.classRoom = JSON.parse(roomInfo);
      }else{
        await this.setClassRoom()
      }
      return this.classRoom;
    }
  }
});