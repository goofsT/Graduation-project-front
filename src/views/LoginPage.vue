<template>
  <Particles id="tsparticles" :options="obj" :particles-init="particlesInit" />
  <div id="container" ref="container" class="container">
    <div class="login-box">
      <div class="left"><img alt="" src="../assets/image/login.png" /></div>
      <div :class="{ animate: isChanged }" class="right">
        <div class="title">教学楼信息可视化系统</div>
        <!--登录表单-->
        <el-form v-show="showLogin" ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="right" label-width="0px" style="max-width: 250px; margin-left: 10px">
          <el-form-item prop="username">
            <div class="label-name">用户名：</div>
            <el-input v-model="loginForm.username" />
          </el-form-item>
          <el-form-item prop="password">
            <div class="label-name">密码：</div>
            <el-input v-model="loginForm.password" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100px; margin: 0 auto" type="primary" @click="submitLogin">登录</el-button>
          </el-form-item>
          <div class="btns">
            <div style="width: 100px" @click="changeForm(0)">注册</div>
            <div style="width: 100px" @click="changeForm(2)">忘记密码</div>
          </div>
        </el-form>

        <!--注册表单-->
        <el-form v-show="showRegister" ref="regFormRef" :model="registerForm" :rules="regRules" label-position="left" label-width="0px" style="max-width: 250px; margin-left: 10px">
          <el-form-item prop="username" style="display: flex; justify-content: space-around">
            <div class="label-name">用户名：</div>
            <el-input v-model="registerForm.username" style="width: 150px" />
          </el-form-item>
          <el-form-item prop="username">
            <div class="label-name">密码：</div>
            <el-input v-model="registerForm.password" style="width: 150px" type="password" />
          </el-form-item>
          <el-form-item prop="realname">
            <div class="label-name">真实姓名：</div>
            <el-input v-model="registerForm.realname" style="width: 150px" />
          </el-form-item>
          <el-form-item prop="telphone">
            <div class="label-name">手机号：</div>
            <el-input v-model="registerForm.telphone" style="width: 150px" />
          </el-form-item>
          <el-form-item prop="cardnum">
            <div class="label-name">身份证号：</div>
            <el-input v-model="registerForm.cardnum" style="width: 150px" />
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100px; margin: 0 auto" type="primary" @click="submitRegister">注册</el-button>
          </el-form-item>
          <div class="btns">
            <div style="width: 100px" @click="changeForm(1)">登录</div>
            <div style="width: 100px" @click="changeForm(2)">忘记密码</div>
          </div>
        </el-form>

        <!--登录表单-->
        <el-form v-show="showForget" ref="resetFormRef" :model="forgetForm" :rules="resetRules" label-position="right" label-width="0px" style="max-width: 250px; margin-left: 10px">
          <el-form-item prop="realname">
            <div class="label-name">真实姓名:</div>
            <el-input v-model="forgetForm.realname" />
          </el-form-item>
          <el-form-item prop="cardnum">
            <div class="label-name">身份证号:</div>
            <el-input v-model="forgetForm.cardnum" />
          </el-form-item>
          <el-form-item prop="newpassword">
            <div class="label-name">新密码:</div>
            <el-input v-model="forgetForm.newpassword" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100px; margin: 0 auto" type="primary" @click="submitChangePwd">修改</el-button>
          </el-form-item>
          <div class="btns">
            <div style="width: 100px" @click="changeForm(0)">注册</div>
            <div style="width: 100px" @click="changeForm(1)">登录</div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { login, register, resetPassword } from "@/api/login.ts";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/userStore.ts";
//@ts-ignore
import obj from "@/assets/js/particles-options.js";
//@ts-ignore
import { loadSlim } from "tsparticles-slim";

const router = useRouter();
//背景粒子点
const particlesInit = async (engine: any) => {
  await loadSlim(engine);
};
const isChanged = ref(false);
//表单ref
/**
 * 表单相关
 */
const loginFormRef = ref();
const regFormRef = ref();
const resetFormRef = ref();
const loginForm = reactive({
  username: "",
  password: "",
});
const loginRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 8, message: "用户名长度为3到8个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 3, max: 12, message: "密码长度为3到12个字符", trigger: "blur" },
  ]
};

const regRules={
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 8, message: "用户名长度为3到8个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 3, max: 12, message: "密码长度为3到12个字符", trigger: "blur" },
  ],
  cardnum: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    { min: 18, max: 18, message: "身份证号长度为18个字符", trigger: "blur" },
  ],
  telphone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { min: 11, max: 11, message: "手机号长度为11个字符", trigger: "blur" },
  ],
  realname: [
    { required: true, message: "请输入真实姓名", trigger: "blur" },
    { min: 2, max: 8, message: "姓名长度为2到8个字符", trigger: "blur" },
  ]
}

const resetRules={
  cardnum: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    { min: 18, max: 18, message: "身份证号长度为18个字符", trigger: "blur" },
  ],
  realname: [
    { required: true, message: "请输入真实姓名", trigger: "blur" },
    { min: 2, max: 8, message: "姓名长度为2到8个字符", trigger: "blur" },
  ],
  newpassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 3, max: 12, message: "密码长度为3到12个字符", trigger: "blur" },
  ]
}
const forgetForm = reactive({
  realname: "",
  cardnum: "",
  newpassword: "",
});
const registerForm = reactive({
  username: "",
  password: "",
  realname: "",
  telphone: "",
  cardnum: "",
  permission: "1",
});
const showLogin = ref(true);
const showRegister = ref(false);
const showForget = ref(false);
//登录
const submitLogin = async () => {
  try {
    const result: any = await login(loginForm);
    if (result.code === 200 && result.token && result.data) {
      ElMessage.success("登录成功");
      localStorage.setItem("token", result.token);
      localStorage.setItem("userInfo", JSON.stringify(result.data));
      const userStore = useUserStore();
      userStore.setUser(result.data);
      await router.push("/home");
    } else {
      ElMessage.warning("用户名或密码错误");
    }
  } catch (error: any) {
    console.log(error);
    ElMessage.warning("服务器出错了,请稍后再试");
  }
};

//注册
const submitRegister = async () => {
  try {
    const result: any = await register(registerForm);
    console.log(result);
    if (result.code === 200) {
      ElMessage.success("注册成功");
      changeForm(1);
    } else {
      ElMessage.warning(result.message);
    }
  } catch (error: any) {
    ElMessage.warning("服务器出错了,请稍后再试");
  }
};

//找回密码
const submitChangePwd = async () => {
  try {
    const result: any = await resetPassword(forgetForm);
    if (result.code === 200) {
      ElMessage.success("修改成功");
      changeForm(1);
    } else {
      ElMessage.warning(result.message);
    }
  } catch (error: any) {
    ElMessage.warning("服务器出错了,请稍后再试");
  }
};

/**
 * 点击切换表单
 * 0：注册 1：登录 2：忘记密码
 * @param type
 */
const changeForm = (type: number) => {
  isChanged.value = true;
  setTimeout(() => {
    isChanged.value = false;
  }, 500);
  switch (type) {
    case 0:
      showLogin.value = false;
      showRegister.value = true;
      showForget.value = false;
      break;
    case 1:
      showLogin.value = true;
      showRegister.value = false;
      showForget.value = false;
      break;
    case 2:
      showLogin.value = false;
      showRegister.value = false;
      showForget.value = true;
      break;
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 900px;
    height: 500px;
    display: flex;
    border: 4px solid;
    border-radius: 20px;

    border-image: linear-gradient(45deg, #faf7f7, #1984ef, #fff, #ccc) 1;
    clip-path: inset(0px round 26px);
    animation: huerotate 6s infinite linear;
    filter: hue-rotate(360deg);
    overflow: hidden;
    position: relative;
    z-index: 0;
    justify-content: center;
    align-items: center;
    @keyframes huerotate {
      0% {
        filter: hue-rotate(0deg);
      }
      100% {
        filter: hue-rotate(360deg);
      }
    }

    .left {
      height: 100%;
      background-color: #535657;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
      overflow: hidden;
    }

    .right {
      flex: 1;
      height: 100%;
      background-color: rgba(255, 255, 255, 0);
      padding: 50px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: relative;
      transition: all 1s ease;
      opacity: 1;

      .label-name {
        font-size: 16px;
        font-weight: bold;
        color: #000;
        width: 100px;
      }

      .title {
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
      }

      .btns {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-around;
        margin-right: 10px;

        div {
          border: 1px solid #ded8d8;
          box-shadow: 0 0 0 2px #ded8d8;
          text-align: center;
          border-radius: 5px;

          &:hover {
            border: 1px solid #21b5d2;
            box-shadow: 0 0 0 2px #21b5d2;
            font-weight: bolder;
            cursor: pointer;
          }
        }
      }
    }
  }
}

#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -5;
}

.animate {
  transform-origin: right top;
  animation: animates ease 0.5s;
}

@keyframes animates {
  0% {
    opacity: 0;
    transform: translateX(300px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
</style>