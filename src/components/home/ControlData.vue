<template>
  <div class="container">
    <div class="data-item" v-for="item in data" :key="item.title">
      <div>{{ item.title }}</div>
      <div>
        <span>{{ item.num }}</span>
        <span>{{ item.sate }}</span>
      </div>
      <div>
        <span>{{ item.rate }}</span>
        <span>{{ item.rateNum }}</span>
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
import { ref, reactive } from 'vue'
import { useDeviceStore } from "@/store/deviceStore.ts";
const data = reactive([
  {
    title: '设备接入数量',
    num: '265/800',
    sate: '目标',
    rate: '设备完好率',
    rateNum: '90%',
    icon: 'iconfont icon-icon-chakan',
  },
  {
    title: '教室使用',
    num: '265/800',
    sate: '当前',
    rate: '使用率',
    rateNum: '0.88',
    icon: 'iconfont icon-icon-dengjilikai',
  },
  {
    title: '事务处理',
    num: '265/800',
    sate: '当前',
    rate: '处理进度',
    rateNum: '50%',
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
