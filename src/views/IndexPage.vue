<template>
  <div class="container">
    <div class="header">
      <HomeHeader />
    </div>
    <div class="content">
      <div class="left">
        <el-tabs style="background-color:#001525;height:108%;border:1px solid #0c8ee8;" stretch v-model="activeName" type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="数据总览" name="first">
            <template #label><span class="custom-tabs-label"><i class="iconfont icon-chakan2"></i><span>数据总览</span></span></template>
            <LiveData />
          </el-tab-pane>
          <el-tab-pane label="设备状态" name="second">
            <template #label><span class="custom-tabs-label"><i class="iconfont icon-icon-shezhi"></i><span>设备状态</span></span></template>
            <DeviceStatus/>
          </el-tab-pane>
          <el-tab-pane label="实时事务" name="third">
            <template #label><span class="custom-tabs-label"><i class="iconfont icon-icon-yonghu"></i><span>实时事务</span></span></template>
          </el-tab-pane>
          <el-tab-pane label="实时教室" name="fourth">
            <template #label><span class="custom-tabs-label"><i class="iconfont icon-kongjiaoshichaxun-01"></i><span>实时教室</span></span></template>
            <ClassManager/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="center" :style="{}">
        <router-view />
      </div>
      <div :style="!showLiveBlock?'right:-290px':''" class="right-box-live">
        <LiveAffairs @updateShow="showLiveUpdate" name="live"/>
      </div>
    </div>
    <div class="footer">footer</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import LiveAffairs from "@/components/home/LiveAffairs.vue";
import HomeHeader from "@/components/home/HomeHeader.vue";
import LiveData from "@/components/home/LiveData.vue";
import ClassManager from "@/components/home/ClassManager.vue";
import DeviceStatus from "@/components/home/DeviceStatus.vue";
const activeName = ref("first");
const handleTabClick = () => {};


//控制场景右侧弹出框的显示与隐藏
const showLiveBlock=ref(false)
const showLiveUpdate=(obj:any)=>{
    showLiveBlock.value=obj.isShow
}



</script>

<style scoped lang="scss">
.container {
  height: 920px;
  width: 100%;
  background-color: #0b1921;
  .header {
    height: 80px;
    width: 100%;
    background-color: #0b1921;
    color: #fff;
  }
  .content {
    height: calc(100% - 100px);
    width: 100%;
    background-color: #0b1921;
    color: #fff;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .left {
      padding: 10px;
      width: 30%;
      height: calc(100% - 10px);
      //overflow: hidden;
      transform: translateY(-35px);
      :deep(.el-tabs__header){
        background-color: #001829!important;
        border:1px solid #0c8ee8;
        border-top:none;

      }
      :deep(.el-tabs__item){
        border:1px solid #0c8ee8;
        color:#fff;
        font-size: 14px;
        &:hover{
          background-color: rgba(0,42,62,1) !important;
          color:#0c8fe9;
        }
      }
      :deep(.el-tabs__item.is-active){
        background-color: rgba(0,42,62,1) !important;
        color:#0c8fe9;
        font-size: 18px;
      }
    }
    .center {
      position: relative;
      width: 80%;
      height: 100%;
      background-color: #232826;
      .canvas-container {
        width: 100%;
        height: 100%;
      }
    }
    .right-box-live,
    .right-box-other {
      position: absolute;
      right: 0;
      top: 250px;
      width: 300px;
      padding: 5px 10px;
      border: 1px solid #0c8ee8;
      box-shadow: 0 0 5px #0c8ee8;
      background-color: #001525;
      transition: all 0.3s linear;
    }
  }
}
</style>
