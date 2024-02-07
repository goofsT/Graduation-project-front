import { defineStore } from 'pinia'
export const useWeatherStore = defineStore({
  id: 'weather', // 每个 store 都需要一个唯一的 id
  state: () => ({
    weather: {},
  }),
  actions: {
    setWeather(weather) {
      this.weather = weather;
    },
    getWeather(){
      return this.weather;
    }
  }
});