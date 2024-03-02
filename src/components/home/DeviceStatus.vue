<template>
  <div class="device_status">
    <div class="status_light">
      <div class="status_title">
        <div class="status_title_text">灯光</div>
        <div class="status_title_legend">
          <div style="background: #259b25"></div>正常使用
          <div style="background: #18598d"></div>关闭
          <div style="background: #e14545"></div>维修
        </div>
      </div>
      <el-scrollbar height="250" style="margin-top:40px;">
        <div class="block" v-for="item in lightList" :style="{background:getLightBackground(item.deviceStatus)}">
          <span  @click="deviceStatusClick(item)">{{item.deviceName.slice(0,-2)}}</span>
        </div>
      </el-scrollbar>
    </div>
    <div class="status_door">
      <div class="status_title">
        <div class="status_title_text">大门</div>
        <div class="status_title_legend">
          <div style="background: #259b25"></div>正常使用
          <div style="background: #18598d"></div>关闭
          <div style="background: #e14545"></div>维修
        </div>
      </div>
      <el-scrollbar height="250px" style="margin-top:40px;">
        <div class="block" v-for="item in doorList" :style="{background:getLightBackground(item.deviceStatus)}" >
          <span @click="deviceStatusClick(item)">{{item.deviceName.slice(0,-2)}}</span>
        </div>
      </el-scrollbar>
    </div>
    <div class="status_fire">
      <div class="status_title">
        <div class="status_title_text">消防栓</div>
        <div class="status_title_legend">

          <div style="background: #409840"></div>正常使用
          <div style="background: #ff0000"></div>维修
        </div>
      </div>
      <el-scrollbar height="250px" style="margin-top:40px;">
        <div class="block" v-for="item in fireList" :style="{background:getLightBackground(item.deviceStatus)}">
          <span @click="deviceStatusClick(item)">{{item.deviceName.slice(0,-3)}}</span>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import{getAllDevice} from "@/api/device.ts";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useCurrentDevice } from "@/store/currentDevice.ts";
import { ElMessage } from "element-plus";
const lightList=ref([])
const doorList=ref([])
const fireList=ref([])
const timer=ref<any>(null)
const currentDevice=useCurrentDevice()

onMounted(()=>{
  getData()
  timer.value=setInterval(()=>{
    getData()
  },10000)
})
onBeforeUnmount(()=>{
  timer.value && clearInterval(timer.value)
})

const deviceStatusClick=(item:any)=>{
  currentDevice.setDeviceInfo(item)
}

//获取设备列表
const getData=async()=>{
  try{
    const res=await getAllDevice()
    if(res.code===200){
      const data=res.data
      lightList.value=[]
      doorList.value=[]
      fireList.value=[]
      data.forEach((item:any)=>{
        if(item.deviceType==="0"){
          lightList.value.push(item)
        }else if(item.deviceType==="1"){
          doorList.value.push(item)
        }else if(item.deviceType==="2"){
          fireList.value.push(item)
        }
      })
    }else{
      ElMessage.warning("获取设备列表失败")
    }
  }catch (e) {
    ElMessage.warning("服务器出错了")
  }
}

//获取背景颜色
const getLightBackground=(status:string)=>{
  if(status==="0"){
    return "#259b25"
  }else if(status==="1"){
    return "#18598d"
  }else{
    return "#e14545"

  }
}
</script>

<style scoped lang="scss">
.device_status{
  height: 100%;
  width: 100%;
  background-color: #0b1921;
  color: #fff;
  :deep(.el-scrollbar__thumb) {
    background: #e4ebef !important;
    opacity: 1;
  }
  div{
    margin-bottom: 10px;
    .block{
      height: 40px;
      width: 110px;
      text-align: center;
      line-height: 40px;
      background-color: #2997ef;
      color:#fff;
      margin: 3px;
      font-size: 14px;
      border-radius: 5px;
      display: inline-block;
      &:hover{
        cursor: pointer;
        //内阴影
        box-shadow: 0 0 20px #fff inset;
      }
    }
  }
  .status_light, .status_door{
    height: 300px;
    width: 100%;
    border-radius: 10px;
    border-top:5px solid #0766a1;
    border-bottom:5px solid #0766a1;
    position:relative;
    overflow: hidden;
    .status_title{
      width:100%;
      padding:0 20px;
      position:absolute;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #151414;
      color:#1eb9f5;
      .status_title_text{
        font-size: 20px;
        font-weight: bold;
      }
      .status_title_legend{
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 10px;
        font-size: 14px;
        height: 20px;
        //文字对齐
        vertical-align: middle;
        div{
          width: 20px;
          height: 20px;
          background-color: red;
          border-radius: 50%;
        }
      }
    }

  }

  .status_fire{
    height: 160px;
    width: 100%;
    border-top:5px solid #0766a1;
    border-bottom:5px solid #0766a1;
    border-radius: 10px;
    position:relative;
    .status_title{
      width:100%;
      padding:0 20px;
      position:absolute;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #151414;
      color:#1eb9f5;
      .status_title_text{
        font-size: 20px;
        font-weight: bold;
      }
      .status_title_legend{
        display: flex;
        margin-top: 10px;
        font-size: 14px;
        height: 20px;
        justify-content: space-between;
        align-items: center;
        line-height: 20px;
        div{
          width: 20px;
          height: 20px;
          background-color: red;
          border-radius: 50%;
        }
      }
    }

  }
}
</style>