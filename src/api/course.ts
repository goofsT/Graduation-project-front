import $api from "@/api/index.ts";
// 获取所有设备
export const getCourseByNow = () => {
  return $api.get("/getCurrentCourse");
};

export const getCourseBySoon = () => {
  return $api.get("/getCourseBySoon");
}

export const deleteCourse = (courseId: number) => {
  return $api.post(`/deleteCourse`, { courseId });
}

export const addCourse = (course: any) => {
  return $api.post(`/addCourse`, { ...course});
}

export const updateCourse = (course: any) => {
  return $api.post(`/updateCourse`, { ...course});
}

export const getCourseByTime= (time: string) => {
  return $api.get(`/getCourseByTime?time=${time}`);
}

