<template>
  <div class="container">
    <el-button type="primary" @click="clickAddTeacher">添加教师</el-button>
    <el-input
      v-model="searchValue"
      placeholder="请输入查询内容"
      style="width: 200px;margin-left:20px"
      clearable
      type="text"
    />
    <el-table
      :data="teacherList"
      :header-cell-style="{background:'#105050',color:'#e5eeed',textAlign:'center',fontSize:'16px'}"
      :cell-style="{background:'#2c2f31',color:'#93d8e5',textAlign:'center',height:'70px'}"
      max-height="745"
      style="width: 100%"
    >
      <el-table-column prop="teacherId" label="Id" width="100" />
      <el-table-column prop="teacherName" label="姓名"  />
      <el-table-column prop="teacherAge" label="年龄" width="100" />
      <el-table-column prop="teacherTitle" label="职称" />
      <el-table-column prop="teacherTel" label="电话"/>
      <el-table-column prop="teacherAcademy" label="学院"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="default" type="primary" @click="updateTeacherInfo(scope.row)">修改</el-button>
          <el-button size="default" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog destroy-on-close :show-close="false" @close="dialogClose" v-model="dialogFormVisible" :title="dialogTitle" width="500" center>
      <el-form :model="form">
        <el-form-item label="姓名" label-width="100">
          <el-input placeholder="输入姓名" style="width: 300px" v-model="form.teacherName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年龄" label-width="100">
          <el-input placeholder="输入年龄" style="width: 300px" v-model="form.teacherAge" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" label-width="100">
          <el-input placeholder="输入电话" style="width: 300px" v-model="form.teacherTel" autocomplete="off" />
        </el-form-item>
        <el-form-item label="职称" label-width="100">
          <el-input placeholder="输入职称" style="width: 300px" v-model="form.teacherTitle" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学院" label-width="100">
          <el-input placeholder="输入学院名" style="width: 300px" v-model="form.teacherAcademy" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import{ref,onMounted,watch} from 'vue'
import { getAllTeacher, updateTeacher, deleteTeacher, addTeacher, getTeacherByText } from "@/api/teacher.ts";
import { ElMessage, ElMessageBox } from "element-plus";
const teacherList=ref([])
const dialogFormVisible=ref(false)
const searchValue=ref('')
const dialogTitle=ref('')
const form=ref({
  teacherId:'',
  teacherName:'',
  teacherAge:'',
  teacherTitle:'',
  teacherTel:'',
  teacherAcademy:''
})
onMounted(()=>{
  getData()
  watchText()
})


const dialogClose=()=>{
  dialogFormVisible.value = false;
  form.value = {
    teacherId:'',
    teacherName:'',
    teacherAge:'',
    teacherTitle:'',
    teacherTel:'',
    teacherAcademy:''
  };
}

const submit=async ()=>{
  if(form.value.teacherId){
    try{
      const res=await updateTeacher(form.value)
      if(res.code==200){
        ElMessage.success('修改成功')
        dialogFormVisible.value=false
        await getData()
      }else{
        ElMessage.error('修改失败')
      }
    }catch (e) {
      ElMessage.error('修改失败')
    }
  }else{
    try{
      const res=await addTeacher(form.value)
      if(res.code==200){
        ElMessage.success('添加成功')
        dialogFormVisible.value=false
        await getData()
      }else{
        ElMessage.error('添加失败')
      }
    }catch (e) {
      ElMessage.error('添加失败')
    }
  }
}

const watchText=()=>{
  watch(searchValue,()=>{
      getTeacherBySearchText()
  })
}

const getTeacherBySearchText=async ()=>{
  try{
    const res=await getTeacherByText(searchValue.value)
    if(res.code==200){
      teacherList.value=res.data
    }else{
      ElMessage.error('获取数据失败')
    }
  }catch (e) {
    console.log(e);
    ElMessage.error('获取数据失败')
  }
}

const clickAddTeacher=async()=>{
  dialogFormVisible.value=true
  dialogTitle.value='添加教师'
  delete form.value.teacherId;
}

const getData=async ()=>{
  try{
    const res=await getAllTeacher()
    if(res.code==200){
      teacherList.value=res.data
    }else{
      ElMessage.error('获取数据失败')
    }
  }catch (e) {
    ElMessage.error('获取数据失败')
  }
}

const updateTeacherInfo=async (row)=>{
  dialogFormVisible.value=true
  dialogTitle.value='修改教师信息'
  form.value=Object.assign({},row)
}

const handleDelete=async (row)=>{
  ElMessageBox.confirm(`是否删除${row.teacherName}?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const res = await deleteTeacher(row.teacherId)
      if (res.code == 200) {
        ElMessage.success('删除成功')
        await getData()
      } else {
        ElMessage.error('删除失败')
      }
    } catch (e) {
      ElMessage.error('删除失败')
    }
  });
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:750px;
}
:deep(.el-dialog__title){
  color: #22a5d3;
  font-weight: bold;
  font-size: 18px;
}
:deep(.el-dialog--center){
  border-radius: 10px;
  background-color: #2a2828;
}
:deep(.el-form-item__label){
  color: #fff;
  font-size: 16px;
}
</style>