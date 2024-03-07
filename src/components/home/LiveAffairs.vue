<template>
 <div class="live-container">
   <div class="card">
     <div class="card-title">{{title}}</div>
     <div class="card-list">
       <el-scrollbar height="300px" always>
           <div class="card-item" v-for="affair in data" @click="handleTodayAffairClick(affair)">
             <div class="info">
               <i class="iconfont icon-shiwu"></i>
               <span class="title">{{ affair.description }}</span>
             </div>
             <div class="date">提交时间：{{ affair.affairTime }}</div>
           </div>
         <el-empty v-if="data.length==0" description="暂无今日事务" />
       </el-scrollbar>
     </div>
     <div @click="isShow=!isShow" :class="{'control-btn':true,'iconfont':true,'icon-youzhankai':isShow,'icon-zuoshouqi':!isShow}"></div>
   </div>
 </div>
</template>
<script setup lang="ts">
import { ref,watch,onMounted } from 'vue'
import {getTodyAffairList} from "@/api/affair.ts";
import{getDeviceById} from "@/api/device.ts";
import {getClassRoomById} from "@/api/ClassRoom.ts";
import{useCurrentRoom} from "@/store/currentRoom.ts";
import {useCurrentDevice} from "@/store/currentDevice.ts";
import { ElMessage } from "element-plus";
//父组件数据
const props = defineProps(['name'])
const emit= defineEmits(['updateShow'])
const title=ref('今日事务')
//子组件数据
const data = ref([])

//控制显示隐藏
const isShow = ref(true)
watch(isShow,(newVal)=>{emit('updateShow',{name:props.name,isShow:newVal})})


onMounted(()=>{
  getData()
})


//点击事务场景变化
const handleTodayAffairClick=async (affair)=>{
  console.log(affair);
  if(affair.affairType==='0'){
    const res=await getDeviceById(affair.affairTypeId)
    res.code===200 && useCurrentDevice().setDeviceInfo(res.data)
  }else if(affair.affairType==='1'){
    const res=await getClassRoomById(affair.affairTypeId)
    res.code===200 && useCurrentRoom().setRoomInfo(res.data)
  }
}

const getData=()=>{
  getTodyAffairList().then((res)=>{
    if(res.code===200){
      if(res.data.length>0){
        data.value=res.data.filter(item=>{
          return item.description.includes('维修')
        })
      }else{
        data.value=[]
      }
    }else{
      ElMessage.warning('获取今日事务失败')
    }
  })
}

</script>
<style scoped lang="scss">
.live-container {
  height: 100%;
  width: 100%;
  .card {
    width: 100%;
    height: 400px;
    position:relative;
    .card-title {
      width: 110px;
      height: 30px;
      line-height: 25px;
      font-size: 16px;
      padding:5px 0;
      vertical-align: middle;
      color: #fff;
      box-sizing: border-box;
      text-align: center;
      background: url('../../assets/image/card-head.png') no-repeat;
      background-size: 100% 100%;
    }
    .card-list {
      margin-top: 0px;
      padding: 10px;
      width: 100%;
      height: 370px;
      background: url('../../assets/image/card-body.png') no-repeat;
      background-size: 100% 100%;
      .card-item {
        border: 1px solid #38393a;
        box-shadow: 0 0 5px #636669;
        height:120px;
        border-right: 5px;
        padding: 5px;
        margin: 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .info {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        .title {
            margin-left: 10px;
            font-size: 15px;
            color: #fff;
          }

          i {
            width:100%;
            text-align: center;
            font-size: 28px;
            color: #0c8fe9;
          }
        }
        .date {
          margin-top: 5px;
          font-size: 12px;
          color: #38d5ea;
        }
        .status {
          font-size: 12px;
        }
        &:hover{
          cursor: pointer;
          background-color: rgba(46, 58, 66, 0.8);
        }
      }
    }
    .control-btn{
      position:absolute;
      left:-30px;
      top:50%;
      padding:10px;
      background-color: rgba(46, 58, 66, 0.8);
      border-radius: 8px 0 0 8px;
      &:hover{
        cursor: pointer;
        background-color: rgba(41, 61, 73, 0.9);
      }
    }
  }
  :deep(.el-scrollbar__thumb) {
    background: #0c8ee8 !important;
  }
}
</style>
