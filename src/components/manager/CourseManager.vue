<template>
  <div class="course-container">
    <div class="course-control">
      <el-button type="primary" @click="clickAddCourse">添加课程</el-button>
      <el-button type="primary" @click="getCurrentCourse">当前课程</el-button>
      <el-button type="primary" @click="getSoonCourse">即将上课</el-button>
      <div>
        <el-date-picker
          v-model="searchTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择课程时间"
        />
        <el-button type="primary" icon="el-icon-plus" @click="setCourseByTime"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="course-title">{{courseTitle}}</div>
    <div class="course-list">
      <el-table
        :data="courseList"
        v-loading="isLoading"
        :header-cell-style="{
          background: '#105050',
          color: '#e5eeed',
          textAlign: 'center',
          fontSize: '16px',
        }"
        :cell-style="{
          background: '#2c2f31',
          color: '#93d8e5',
          textAlign: 'center',
          height: '70px',
        }"
        max-height="680"
        height="680px"
        style="width: 100%; background-color: transparent"
        empty-text="暂无课程数据"
      >
        <el-table-column prop="courseId" label="Id" width="100" />
        <el-table-column prop="courseName" label="课程名" />
        <el-table-column prop="sclass.className" label="班级" width="100" />
        <el-table-column prop="teacher.teacherName" label="教师" width="100" />
        <el-table-column prop="roomId" label="教室" width="100" />
        <el-table-column prop="courseTimeStart" label="开始时间" />
        <el-table-column prop="courseTimeEnd" label="结束时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="default"
              type="primary"
              @click="handleUpdateCourse(scope.row)"
              >修改</el-button
            >
            <el-button
              size="default"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      destroy-on-close
      :show-close="false"
      @close="dialogClose"
      v-model="dialogFormVisible"
      :title="dialogTitle"
      width="500"
      center
    >
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          <el-input
            placeholder="输入课程名"
            style="width: 300px"
            v-model="form.courseName"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="班级" label-width="100">
          <el-select
            style="width: 300px"
            v-model="form.classId"
            placeholder="选择班级"
          >
            <el-option
              v-for="item in classList"
              :label="item.className"
              :value="item.classId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教室" label-width="100">
          <el-select
            style="width: 300px"
            v-model="form.roomId"
            placeholder="选择教室"
          >
            <el-option
              v-for="item in classRoomList"
              :label="item.roomName"
              :value="item.roomId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教师" label-width="100">
          <el-select
            style="width: 300px"
            v-model="form.teacherId"
            placeholder="选择老师"
          >
            <el-option
              v-for="item in teacherList"
              :label="item.teacherName"
              :value="item.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" label-width="100">
          <el-date-picker
            style="width: 300px"
            v-model="form.courseTimeStart"
            @change="getFreeClassRooms(form.courseTimeStart)"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" label-width="100">
          <el-date-picker
            style="width: 300px"
            :disabled-date="disabledEndDate"
            v-model="form.courseTimeEnd"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择结束时间"
          />
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
import { ref, onMounted } from "vue";
import {
  getCourseByNow,
  getCourseBySoon,
  deleteCourse,
  addCourse,
  updateCourse,
  getCourseByTime,
} from "@/api/course.ts";
import { getAllClass } from "@/api/class.ts";
import { getAllClassRoom, getFreeClassRoom } from "@/api/ClassRoom.ts";
import { getAllTeacher } from "@/api/teacher.ts";
import { ElMessage, ElMessageBox } from "element-plus";
const courseList = ref([]);
const teacherList = ref([]);
const classList = ref([]);
const classRoomList = ref([]);
const isLoading = ref(false);
const dialogFormVisible = ref(false);
const searchTime = ref("");
const courseTitle = ref("当前课程");
const dialogTitle=ref('')
const form = ref({
  courseId: "",
  courseName: "",
  classId: "",
  roomId: "",
  teacherId: "",
  courseTimeStart: "",
  courseTimeEnd: "",
});
onMounted(() => {
  getCurrentCourse();
  getRoomList();
  getClassList();
  getTeacherList();
});

//提交弹框
const submit = async () => {
  if(dialogTitle.value=='添加课程') {
    try {
      const res = await addCourse(form.value);
      if (res.code == 200) {
        ElMessage.success("添加成功");
        dialogFormVisible.value = false;
        resetCourseList()
      } else {
        ElMessage.error("添加失败");
      }
    } catch (e) {
      ElMessage.error("添加失败");
    }
  }else{
    try {
      const res = await updateCourse(form.value);
      if (res.code == 200) {
        ElMessage.success("修改成功");
        dialogFormVisible.value = false;
        resetCourseList()
      } else {
        ElMessage.error("修改失败");
      }
    } catch (e) {
      ElMessage.error("修改失败");
    }
  }
};

const dialogClose = () => {
  dialogFormVisible.value = false;
  form.value = {
    courseId: "",
    courseName: "",
    classId: "",
    roomId: "",
    teacherId: "",
    courseTimeStart: "",
    courseTimeEnd: "",
  };
};

const disabledEndDate = (time) => {
  return time.getTime() < new Date(form.value.courseTimeStart).getTime();
};

const setCourseByTime = () => {
  try {
    if (searchTime.value === "" || searchTime.value === null) {
      ElMessage.warning("请选择课程时间");
      return;
    }
    isLoading.value = true;
    getCourseByTime(searchTime.value).then((res: any) => {
      if (res.code === 200) {
        courseTitle.value = searchTime.value + "课程"
        courseList.value = res.data;
        isLoading.value = false;
      } else {
        ElMessage.error("获取课程失败");
        isLoading.value = false;
      }
    });
  } catch (e) {
    ElMessage.error("服务器错误");
  }
};

const clickAddCourse = () => {
  dialogTitle.value = "添加课程";
  dialogFormVisible.value = true;
  form.value = {
    courseId: "",
    courseName: "",
    classId: "",
    roomId: "",
    teacherId: "",
    courseTimeStart: "",
    courseTimeEnd: "",
  };
  delete form.value.courseId;
};

//重置课程列表
const resetCourseList = () => {
  if(courseTitle.value=='当前课程') {
    getCurrentCourse();
  }else if(courseTitle.value=='即将上课'){
    getSoonCourse();
  }else{
    setCourseByTime();
  }
};

//点击修改课程 出现弹出框 并获取空闲教室
const handleUpdateCourse = (row) => {
  dialogTitle.value = "修改课程";
  dialogFormVisible.value = true;
  form.value = row;
  getFreeClassRooms(row.courseTimeStart);
};

//删除课程
const handleDelete = async (row: any) => {
  ElMessageBox.confirm(`是否删除${row.courseName}课程?`, "Warning", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
      const res = await deleteCourse(row.courseId);
      if (res.code == 200) {
        ElMessage.success("删除成功");
        resetCourseList()
      } else {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {
      ElMessage.info("操作已取消");
    });
};

const getClassList = () => {
  getAllClass().then((res: any) => {
    if (res.code === 200) {
      classList.value = res.data;
    } else {
      ElMessage.error("获取班级失败");
    }
  });
};

//获取指定时间的空闲教室
const getFreeClassRooms = (time) => {
  getFreeClassRoom(time).then((res: any) => {
    if (res.code === 200) {
      if(res.data.length==0){
        ElMessage.warning('当前时间无空闲教室')
        form.value.roomId = '';
      }else{
        classRoomList.value = res.data;
        form.value.roomId = res.data[0].roomId;
      }
    } else {
      ElMessage.error("获取教室失败");
    }
  });
};
//获取当前课程
const getCurrentCourse = () => {
  isLoading.value = true;
  getCourseByNow().then((res: any) => {
    if (res.code === 200) {
      courseTitle.value = "当前课程";
      courseList.value = res.data;
      isLoading.value = false;
    } else {
      ElMessage.error("获取当前课程失败");
    }
  });
};
//获取即将上课课程
const getSoonCourse = () => {
  isLoading.value = true;
  getCourseBySoon().then((res: any) => {
    if (res.code === 200) {
      courseTitle.value = "即将上课";
      courseList.value = res.data;
      isLoading.value = false;
    } else {
      ElMessage.error("获取即将上课课程失败");
    }
  });
};

//获取教室列表
const getRoomList = () => {
  getAllClassRoom().then((res: any) => {
    if (res.code === 200) {
      classRoomList.value = res.data;
    } else {
      ElMessage.error("获取教室失败");
    }
  });
};
//获取教师列表
const getTeacherList = () => {
  getAllTeacher().then((res: any) => {
    if (res.code === 200) {
      teacherList.value = res.data;
    } else {
      ElMessage.error("获取教师失败");
    }
  });
};
</script>

<style scoped lang="scss">
.course-container {
  width: 100%;
  height: 740px;
  background-color: #000;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  .course-title{
    text-align: center;
    font-size: 24px;
    color: #fff;
    margin: 10px 0;
  }
  .course-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding:5px 10px;
    .el-date-picker {
      width: 200px;
    }
  }
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