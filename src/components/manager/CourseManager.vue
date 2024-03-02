<template>
<div class="course-container">
  <div class="course-control">
    <el-button type="primary" icon="el-icon-plus" @click="addCourse">添加课程</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="setCurrentCourse">当前课程</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="setSoonCourse">即将上课</el-button>
  </div>
  <div class="course-list">
    <el-table
      :data="courseList"
      v-loading="isLoading"
      :header-cell-style="{background:'#105050',color:'#e5eeed',textAlign:'center',fontSize:'16px'}"
      :cell-style="{background:'#2c2f31',color:'#93d8e5',textAlign:'center',height:'70px'}"
      max-height="700"
      height="700px"
      style="width: 100%;background-color:transparent;"
    >
      <el-table-column prop="courseId" label="Id" width="100" />
      <el-table-column prop="courseName" label="课程名"  />
      <el-table-column prop="sclass.className" label="班级" width="100" />
      <el-table-column prop="teacher.teacherName" label="教师" width="100" />
      <el-table-column prop="roomId" label="教室" width="100"/>
      <el-table-column prop="courseTimeStart" label="开始时间" />
      <el-table-column prop="courseTimeEnd" label="结束时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="default" type="primary" @click="handleUpdateCourse(scope.row)">修改</el-button>
          <el-button size="default" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="form">
      <el-form-item label="Promotion name" label-width="100">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" label-width="100">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCourseByNow,getCourseBySoon ,deleteCourse,addCourse,updateCourse} from "@/api/course.ts";
import { ElMessage } from "element-plus";
const courseList = ref([]);
const isLoading = ref(false);
const dialogFormVisible=ref(false)
const form=ref({
  name:'123',
  region:'shanghai'
})
onMounted(() => {
  getCurrentCourse();
});


const addCourse = () => {

};

const setCurrentCourse = () => {
  getCurrentCourse()
};

const setSoonCourse = () => {
  getSoonCourse()
};

const handleUpdateCourse=(row)=>{
   dialogFormVisible.value=true
   form.value.name=row.courseName
  
}

const handleDelete = async(row: any) => {
  try{
    const res=await deleteCourse(row.courseId)
    if(res.code==200){
      ElMessage.success('删除成功')
    }else{
      ElMessage.error('删除失败')
    }
  }catch (e) {
    ElMessage.error('删除失败')
  }
};

const getCurrentCourse = () => {
  isLoading.value = true;
  getCourseByNow().then((res: any) => {
    if(res.code===200){
      courseList.value = res.data;
      isLoading.value = false;
    }else{
      ElMessage.error('获取当前课程失败')
    }
  });
};

const getSoonCourse = () => {
  isLoading.value = true;
  getCourseBySoon().then((res: any) => {
    if(res.code===200){
      courseList.value = res.data;
      isLoading.value = false;
    }else{
      ElMessage.error('获取即将上课课程失败')
    }
  });
};
</script>

<style scoped lang="scss">
.course-container{
    width: 100%;
    height: 740px;
    background-color: #000;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
    box-sizing: border-box;
    overflow: hidden;
}
</style>