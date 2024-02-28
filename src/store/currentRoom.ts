import { defineStore } from 'pinia'
export const useCurrentRoom = defineStore({
  id: 'currentRoom', // 每个 store 都需要一个唯一的 id
  state: () => ({
    room: {},
  }),
  actions: {
    setRoomInfo(info) {
      this.room = info;
    },
    getRoom(){
      return this.room;
    }
  }
});