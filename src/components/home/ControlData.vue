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
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const data = reactive([
  {
    title: '接入视频单位数',
    num: '265/800',
    sate: '目标',
    rate: '设备完好率',
    rateNum: '90%',
    icon: 'iconfont icon-icon-chakan',
  },
  {
    title: '人员出入比例',
    num: '265/800',
    sate: '当前',
    rate: '出/入',
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
