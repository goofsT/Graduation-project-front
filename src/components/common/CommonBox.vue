<template>
  <div class="container" :style="{height:currentBoxHeight+'px'}">
    <div class="title">{{ title }}</div>
    <div class="box">
      <div :class="{'close-btn':true,iconfont:true,'icon-xiazhankai':!show,'icon-shangshouqi':show}" @click="changeBoxStatus"></div>
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
const props = defineProps({
  title: { type: String, default:'数据管理' },
  height:{ type:Number,default:0 },
  display:{type:Boolean}
})
const emit = defineEmits(['displayChange']);
const show = ref(false)
const currentBoxHeight=ref()
//监听display变化
watch(()=>props.display,async(newVal)=>{
  show.value=newVal
  currentBoxHeight.value=newVal?props.height:60
},{immediate:true})
//监听展示状态
watch(()=>show.value,val=>{
  emit('displayChange',title.value,val)
})


const title = ref('')
title.value = props.title
const changeBoxStatus = () => {
  show.value = !show.value
  currentBoxHeight.value=show.value?props.height:60
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  position: relative;
  transition: all .5s;
  overflow: hidden;
  border-radius: 5px;
  .title {
    //宽度自适应
    width: fit-content;
    height: 25px;
    line-height: 25px;
    padding: 3px 30px;
    text-align: center;
    border: 1px solid #0c8ee8;
    box-shadow: 0 0 5px #0c8ee8;
    border-radius: 5px;
    margin-left: 20px;
  }
  .box {
    padding-top: 20px;
    position: absolute;
    width: 100%;
    height: 92%;
    background: url('../../assets/image/box-bg.png') no-repeat;
    background-size: 100% 100%;
    .close-btn {
      width: 30px;
      height: 30px;
      line-height: 30px;
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
      transition: all 0.3s;
      &:hover {
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
}
</style>
