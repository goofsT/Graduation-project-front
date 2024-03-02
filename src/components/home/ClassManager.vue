<template>
  <div class="container">
    <el-menu  default-active="1-1" class="class-menu" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#0c8fe9" @select="handleSelect">
      <el-sub-menu v-for="item in classNavList" :key="item.id" :index="item.id">
        <template #title>{{item.name}}</template>
        <el-menu-item v-for="cl in item.children" :key="cl.id" :index="cl.id">{{cl.name}}</el-menu-item>
      </el-sub-menu>
    </el-menu>

    <el-card class="class-card" v-for="item in classInfo" @click="roomClick(item)">
      <template #header>
        <div class="card-header">
          <div>{{item.roomName}}</div>
          <div :style="{
            color:getColor(item.status),
          }">{{getStatusText(item.status)}}</div>
        </div>
      </template>
        <div class="card-body" v-if="item.course">
          <div>教师：{{item.course.teacher.teacherName || '暂无'}}</div>
          <div>课程：{{item.course.courseName || '暂无'}}</div>
          <div>时间段:{{item.course.courseTimeStart.slice(11,16)+ '-'+item.course.courseTimeEnd.slice(11,16)|| '暂无'}}</div>
        </div>
      <div class="card-body" v-else>
        <div style="height:50px">无人使用</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import {getClassRoomByFloor} from '@/api/ClassRoom.ts'
import {useCurrentRoom} from "@/store/currentRoom.ts";
import { ElMessage } from "element-plus";
const currentRoom=useCurrentRoom()
//导航选项
const classNavList = reactive([
  {
    id: "1",
    name: "1号楼",
    children: [
      { id: "1-1", name: "一楼教室" },
      { id: "1-2", name: "二楼教室" },
      { id: "1-3", name: "三楼教室" },
    ],
  },
  {
    id: "2",
    name: "2号楼",
    children: [
      { id: "2-1", name: "一楼教室" },
      { id: "2-2", name: "二楼教室" },
      { id: "2-3", name: "三楼教室" },
    ],
  },
]);
const classInfo=reactive([])
const timer=ref<any>(null)
//监听楼层变化
const activeBuilding = ref("1");
const activeFloor = ref("1");


onMounted(()=>{
  //监听楼层选择变化
  watch([activeBuilding, activeFloor], (newVal, oldVal) => {
    getFloorClass(newVal[0],newVal[1])
  }, { immediate: true });
  //定时刷新
  timer.value=setInterval(()=>{
    getFloorClass(activeBuilding.value,activeFloor.value)
  },60000)
})

onBeforeUnmount(()=>{
  timer.value && clearInterval(timer.value)
})

const roomClick=(room)=>{
  currentRoom.setRoomInfo(room)
}

const handleSelect = (key: string, keyPath: string[]) => {
  activeBuilding.value = key.slice(0, 1);
  activeFloor.value = key.slice(2);
};

const getFloorClass=async (building:string,floor:string)=>{
  try{
    const res=await getClassRoomByFloor(building,floor)
    if(res.code===200){
      Object.assign(classInfo,res.data)
    }else{
      ElMessage.warning("获取教室信息失败！")
    }
  }catch (e) {
    ElMessage.error("服务器出错了！")
  }
}


const getColor=(status:string)=>{
  if(status==='1'){
    return '#0c8fe9'
  }else if(status==='0'){
    return '#52a84f'
  }else{
    return '#ff0000'
  }
}

const getStatusText=(status:string)=>{
  if(status==='0'){
    return '空闲'
  }else if(status==='1'){
    return '使用中'
  }else{
    return '暂停使用'
  }
}

</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  background-color: transparent;
  .class-menu {
    background-color: #001829;
    border-bottom: 1px solid #09a2f3;
    .el-sub-menu {
      border-radius: 5px 5px 0 0 ;
      border:1px solid #1d4952;
      overflow: hidden;
      transition: all .3s ;
    }
    .is-active {
      border-radius: 5px 5px 0 0 ;
      border:1px solid #09a2f3;
      background-color: #193d50;
    }
  }
  .class-card {
    margin: 10px 0;
    background-color: #092337;
    box-shadow: 0 0 2px 1px #fff;
    .card-header{
      color: #188ddc;
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
    .card-body{
      color:#fff;
    }
    &:hover{
      border:1px solid #105df1;
      background-color: #3a4d64;
      box-shadow: 0 0 5px 5px #fff;
    }
  }
}
</style>
