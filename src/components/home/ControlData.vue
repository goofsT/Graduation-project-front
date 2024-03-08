<template>
  <div class="container">
    <div class="data-item" v-for="item in data" :key="item.title">
      <div style="font-size: 18px">{{ item.title }}</div>
      <div>
        <span>{{ item.num }}</span>
      </div>
      <div>
        <span style="color:#07f3c8">{{ item.rateNum }}</span>
        <span :class="item.icon"></span>
      </div>
    </div>
    <div class="scene_control">
      <div :style="{background:showWeather?'#27a0f3':'#567988'}" @click="changeStatus('weather')">场景天气</div>
      <div :style="{background:showDevice?'#27a0f3':'#567988'}" @click="changeStatus('device')">维修设备</div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import{getAffairNumInfo} from "@/api/affair.ts";
import{getRoomNumInfo} from "@/api/classRoom.ts";
import{getDeviceNumInfo} from "@/api/device.ts";
import { ElMessage } from "element-plus";
const data = reactive([
  {
    title: '设备数量',
    num: '265/800',
    rateNum: '90%',
    icon: 'iconfont icon-icon-chakan',
  },
  {
    title: '教室使用',
    num: '265/800',
    rateNum: '0.88',
    icon: 'iconfont icon-icon-dengjilikai',
  },
  {
    title: '事务处理',
    num: '265/800',
    rateNum: '',
    icon: 'iconfont icon-icon-shenhe',
  },
])

const showWeather=ref(false)
const showDevice=ref(false)
const showAffairs=ref(false)


const emit=defineEmits(['controlChange'])
const changeStatus=(type)=>{
  type==='weather' && (showWeather.value=!showWeather.value)
  type==='device' && (showDevice.value=!showDevice.value)
  emit('controlChange',{showWeather:showWeather.value,showDevice:showDevice.value,showAffairs:showAffairs.value})
}

onMounted(()=>{
  getDeviceInfo()
  getRoomInfo()
  getAffairInfo()
})

const getDeviceInfo=()=>{
  getDeviceNumInfo().then((res)=>{
    if(res.code===200){
      data[0].num=res.data.repairNum+'维修'+'/'+res.data.deviceNum+'总数'
      data[0].rateNum='维修率'+((res.data.repairNum/res.data.deviceNum)*100).toFixed(2)+'%'
    }else{
      ElMessage.warning("获取设备数量失败")
    }
  })
}

const getRoomInfo=()=>{
  getRoomNumInfo().then((res)=>{
    if(res.code===200){
      data[1].num=res.data.freeRoomNum+'空闲'+'/'+res.data.roomNum+'总数'
      data[1].rateNum='空闲率'+((res.data.freeRoomNum/res.data.roomNum)*100).toFixed(2)+'%'
    }else{
     ElMessage.warning("获取教室数量失败")
    }
  })
}

const getAffairInfo=()=>{
  getAffairNumInfo().then((res)=>{
    if(res.code===200){
      data[2].num=res.data.todayNum+'今日'+'/'+res.data.weekNum+'本周'
      data[2].rateNum='今日占比'+((res.data.todayNum/res.data.weekNum)*100).toFixed(2)+'%'
    }else{
      ElMessage.warning("获取事务数量失败")
    }
  })
}

</script>
<style scoped lang="scss">
.container {
  width: 1000px;
  height: 80px !important;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  position:absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: transparent!important;
  opacity: 0.8;
  z-index: 999;
  .scene_control{
    position: absolute;
    left:-190px;
    top:-10px;
    border: 4px solid #0c8fe9;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.7);
    div{
      margin: 10px 0;
      padding: 5px 10px;
      background-color: #567988;
      border: 1px solid #0c8fe9;
      &:hover{
        cursor: pointer;
        font-weight: bold;
        background-color: #27a0f3;
      }
    }
  }
  .data-item {
    margin-top: 0px;
    width: 20%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 10px;
    color: #c9c1c1;
    border: 1px solid #0c8fe9;
    box-shadow: 0 0 3px #0c8ee8;
    border-radius: 5px;
    background-color: #0b1921;
    div:nth-child(1) {
    }
    div:nth-child(2) {
      width: 100%;
      span:nth-child(1) {
        font-size: 16px;
        color: #0c8fe9;
      }
      span:nth-child(2) {
        font-size: 10px;
        color: #0c8fe9;
      }
    }
    div:nth-child(3) {
      span:nth-child(2) {
        margin: 0 5px;
        color: #3df613;
      }
      span:nth-child(3) {
        font-size: 24px;
        color: #08efc4;
      }
    }
  }
}
</style>
