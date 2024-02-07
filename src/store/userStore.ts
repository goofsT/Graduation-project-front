import { defineStore } from 'pinia'
export const useUserStore = defineStore({
  id: 'user', // 每个 store 都需要一个唯一的 id
  state: () => ({
    user: {},
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    getUser(){
        const userInfo=localStorage.getItem('userInfo');
        userInfo && (this.user=JSON.parse(userInfo));
        return this.user;
    }
  }
});