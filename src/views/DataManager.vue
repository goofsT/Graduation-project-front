<template>
    <div class="manager-container">
      <el-tabs type="border-card" style="background-color:#2c2f31;">
        <el-tab-pane label="设备">
          <template #label><span class="custom-tabs-label"> <i class="iconfont icon-chakan2"></i>  <span>设备</span></span></template>
          <DeviceManager />
        </el-tab-pane>
        <el-tab-pane label="教室">
          <template #label><span class="custom-tabs-label"><i class="iconfont icon-icon"></i> <span>教室</span></span></template>
          <RoomManager/>
        </el-tab-pane>
        <el-tab-pane label="课程"  v-if="permission==='0'">
          <template #label><span class="custom-tabs-label"> <i class="iconfont icon-jurassic_hat"></i><span>课程</span></span></template>
          <CourseManager/>
        </el-tab-pane>
        <el-tab-pane label="班级" v-if="permission==='0'" >
          <template #label><span class="custom-tabs-label"> <i class="iconfont icon-jurassic_hat"></i><span>班级</span></span></template>
          <ClassManager/>
        </el-tab-pane>
        <el-tab-pane label="教师" v-if="permission==='0'">
          <template #label><span class="custom-tabs-label"> <i class="iconfont icon-jurassic_hat"></i><span>教师</span></span></template>
          <TeacherManager/>
        </el-tab-pane>
        <el-tab-pane label="用户"  v-if="permission==='0'">
          <template #label><span class="custom-tabs-label"> <i class="iconfont icon-jurassic_hat"></i><span>用户</span></span></template>
          <UserManager/>
        </el-tab-pane>
        <el-tab-pane label="事务">
          <template #label><span class="custom-tabs-label"><i class="iconfont icon-chakan1"></i><span>事务</span></span></template>
          <AffairManager/>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>
<script setup lang="ts">
import DeviceManager from "@/components/manager/DeviceManager.vue";
import RoomManager from "@/components/manager/RoomManager.vue";
import CourseManager from "@/components/manager/CourseManager.vue";
import ClassManager from "@/components/manager/ClassManager.vue";
import TeacherManager from "@/components/manager/TeacherManager.vue";
import UserManager from "@/components/manager/UserManager.vue";
import AffairManager from "@/components/manager/AffairManager.vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/userStore.ts";
const permission=ref("")
onMounted(()=>{
  const userInfo=useUserStore().getUser()
  permission.value=userInfo.permission

})
</script>
<style scoped lang="scss">
.manager-container{
    width: 100%;
    height: 100%;
    border: 2px solid #2eb9f5;
    background-color: #000;
    color: #000;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
    box-sizing: border-box;
    overflow: hidden;
    :deep(.el-tabs__header){
       background-color: #2c2f31;
      .is-active{
        color:#fff;
        background-color: #1a93b9;
      }
   }
}
</style>