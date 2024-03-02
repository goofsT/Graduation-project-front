<template>
  <div class="head">
    <div class="weather">
      <div class="weather_box1">
        <div class="weather_city">{{weatherInfo.city+'今日：'+weatherInfo.type}}</div>
        <div class="weather_type">{{'气温：'+weatherInfo.low+'~'+weatherInfo.high}}</div>
      </div>
      <div class="weather_notice">{{weatherInfo.notice}}</div>
    </div>
    <div class="box">
      <i class="iconfont icon-zhihuixiaoyuan"></i>
      <div>
        <div class="title">教学楼信息可视化系统</div>
        <div class="subtitle">
          Information Visualization System For Teaching Buildings
        </div>
      </div>
    </div>
    <div class="data-manager" v-if="userInfo.premission=='0'" @click="toManager">{{btnText}}</div>
    <div class="info">
      <span>{{handleUserText()}}</span>
      <i class="iconfont icon-icon-dengjilikai" @click="loginOut"></i>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted,ref } from "vue";
import {useUserStore} from "@/store/userStore.ts";
import {useWeatherStore} from "@/store/weatherStore.ts";
import {getWeather} from "@/api/weather.ts";
import { ElMessage } from "element-plus";
import router from "@/router";

const userInfo=useUserStore().getUser()
const showManager=ref(false)
const btnText=ref('数据管理')

onMounted(()=>{
  getWeatherInfo()
})


const toManager=()=>{
  showManager.value=!showManager.value
  if(showManager.value) {
    btnText.value = "楼栋场景"
    router.replace('/manage')
  } else {
    btnText.value = "数据管理"
    router.replace('/home')
  }
}

const handleUserText=()=>{
  if(userInfo.premission=='0'){
    return userInfo.realname+' [管理员]'
  }else if(userInfo.premission=='1'){
    return userInfo.realname+' [普通用户]'
  }else if(userInfo.premission=='2'){
    return userInfo.realname+' [维修人员]'
  }else{
    return userInfo.premission+' [值班人员]'
  }
}

//退出登录
const loginOut=()=>{
  useUserStore().setUser({})
  localStorage.clear()
  router.push('/login')
}

//获取天气信息
const weatherInfo=ref({})
const getWeatherInfo=async ()=>{
   const weatherRes=await getWeather()
   if(weatherRes.code==200){
     weatherInfo.value=weatherRes.data[0]
     useWeatherStore().setWeather(weatherInfo.value)
     localStorage.setItem('weather',JSON.stringify(weatherInfo.value))
   }else{
     ElMessage.warning('获取天气信息失败');
   }
}
</script>

<style scoped lang="scss">
.head {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  background-size: 100% 180%;
  background: url('../../assets/image/header-bg.png') no-repeat top;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
  .weather{
    height:80px;
    width:400px;
    z-index: 0;
    position: absolute;
    left:0;
    top:50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #2eb9f5;
    font-size: 14px;
    font-weight: bold;
    .weather_box1{
      width:100%;
      height:100%;
      display: flex;
      margin: 15px 0 0 15px;
      flex-direction: column;
      .weather_city{
        font-size: 16px;
        font-weight: bold;
      }
      .weather_type{
        font-size: 12px;
      }
    }
    .weather_notice{
      height:50px;
      width:400px;
      margin-top: 20px;
      font-size: 12px;
    }
  }
  .data-manager{
    position:absolute;
    right:180px;
    border:2px solid #2eb9f5;
    border-radius: 5px;
    padding:5px;
    font-weight: bold;
    color: #ebedf1;
    &:hover{
      background-color: #1a475d;
      cursor: pointer;
    }
  }
  .info{
    position: absolute;
    right: 0;
    top:50%;
    width: 160px;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #2eb9f5;
    font-size: 15px;
    font-weight: bold;
    .iconfont{
      color: #3cb2bd;
      font-size: 40px;
      margin-left: 5px;
      font-weight: bolder;
      &:hover{
        font-size: 42px;
        cursor: pointer;
        color: #05ddf1;
      }
    }
  }

  .box {
    width: 22%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #2dcdff;
    .iconfont {
      font-size: 50px;
      margin-right: 10px;
    }
    .title {
      font-size: 25px;
      font-weight: bold;
      color: #fff;
      letter-spacing: 7px;
      text-shadow: 0 0 10px #2dcdff;
    }
    .subtitle {
      font-size: 12px;
      color: #bdb7b7;
    }
  }
}
</style>
