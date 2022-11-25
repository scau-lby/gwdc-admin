<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { loginRules } from "./utils/rule";
import { message } from "@pureadmin/components";
import type { FormInstance } from "element-plus";
import { ref, reactive, watch } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
import { bg, currentWeek } from "./utils/static";
import { ReImageVerify } from "/@/components/ReImageVerify";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

import { usePermissionStoreHook } from "/@/store/modules/permission";

import CryptoJS from "crypto-js";

const imgCode = ref("");
const router = useRouter();
const loading = ref(false);
const checked = ref(false);
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  LoginName: "",
  password: "",
  verifyCode: ""
});

//加密
function encrypt(word, keyStr = "gwdcsxyzhkj12345") {
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
//解密
function decrypt(word, keyStr = "gwdcsxyzhkj12345") {
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

function hasUserCodeAddPassword() {
  if (localStorage.getItem("LoginName") && localStorage.getItem("password")) {
    ruleForm.LoginName = localStorage.getItem("LoginName");
    ruleForm.password = decrypt(localStorage.getItem("password")); //解密
    checked.value = true;
  }
}

hasUserCodeAddPassword();

function rsa_pwd(content) {
  //十六进制公钥
  var rsa_n =
    "8c4d0b4e37f9082c43d7b9cf65b7ed3dd4876744a09bb5d12b4dda4f23e5ee8a69436cc9b120c2e6c7008b9bea6fd326f3d82a8e4172c920a96012378e834272d712af8fc90d3e26cb27d80af9ac2b455f3524cf5d3e0c13fc4a3350f119d8f0630ceaff305be85d0534f219104bb3b5a7932f51495c047576b3b5740ccdb23886870783f5bab441ec8c9b13c8135b8fbc0ff6d8163f70c3ed6cb3b764c72250d5dc34ff54b1e1261e9e4995218b5a43542b78fdc4bef6d352fe713d242677eb122f174b0e8706db9f4f294b0d876276be33265805631a8f77a1fcf4ed9ae32a9769e7ba7498e94576b472af834b9dd8ff7a0de1a5881db47afc40e1f8059e79";
  var rsa = new RSAKey();
  rsa.setPublic(rsa_n, "10001");
  var content_rsa = rsa.encrypt(content);
  if (content_rsa == null) {
    return content;
  }
  return content_rsa;
}

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (checked.value) {
        localStorage.setItem("LoginName", ruleForm.LoginName);
        localStorage.setItem(
          "password",
          encrypt(ruleForm.password) //base加密
        );
      } else {
        localStorage.removeItem("LoginName");
        localStorage.removeItem("password");
      }

      const time = Math.floor(new Date().getTime() / 1000);
      const passwordEncryp = rsa_pwd(ruleForm.password + "$" + time);

      useUserStoreHook()
        .loginByLoginName({
          LoginName: ruleForm.LoginName,
          password: passwordEncryp
        })
        .then(() => {
          usePermissionStoreHook().changeSetting([]);
          message.success("登陆成功");
          router.push("/");
        })
        .catch(() => {
          loading.value = false;
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};

watch(imgCode, value => {
  useUserStoreHook().SET_VERIFYCODE(value);
});
</script>

<template>
  <img :src="bg" class="wave" />
  <div class="login-container">
    <div class="img">
      <component :is="currentWeek" />
    </div>
    <div class="login-box">
      <div class="login-form">
        <Motion>
          <h2>施工数据云平台</h2>
        </Motion>

        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="loginRules"
          size="large"
          @keyup.enter="onLogin(ruleFormRef)"
        >
          <Motion :delay="100">
            <el-form-item prop="LoginName">
              <el-input
                clearable
                v-model="ruleForm.LoginName"
                placeholder="账号"
                :prefix-icon="useRenderIcon('user')"
              />
            </el-form-item>
          </Motion>

          <Motion :delay="150">
            <el-form-item prop="password">
              <el-input
                clearable
                show-password
                v-model="ruleForm.password"
                placeholder="密码"
                :prefix-icon="useRenderIcon('lock')"
              />
            </el-form-item>
          </Motion>

          <Motion :delay="200">
            <el-form-item prop="verifyCode">
              <el-input
                clearable
                v-model="ruleForm.verifyCode"
                placeholder="验证码"
              >
                <template v-slot:append>
                  <ReImageVerify v-model:code="imgCode" />
                </template>
              </el-input>
            </el-form-item>
          </Motion>

          <Motion :delay="250">
            <el-form-item>
              <div class="w-full h-20px flex justify-between items-center">
                <el-checkbox v-model="checked"> 记住密码 </el-checkbox>
              </div>
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </el-form-item>
          </Motion>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("/@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
