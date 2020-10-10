<template>
  <div class="login">
    <el-card class="box-card">
      <p v-show="show" style="color: red">用户名或密码错误</p>
      <el-input class="acc" v-model="acc" placeholder="请输入用户名"></el-input>
      <el-input v-model="pwd" placeholder="请输入密码"></el-input>

      <el-button @click="clickLogin">登录</el-button>

      <!-- 滑动图片验证 -->
      <slide-verify
        :l="42"
        :r="10"
        :w="310"
        :h="155"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
        slider-text="向右滑动"
        v-show="showCode"
      >
      </slide-verify>
    </el-card>
    <p class="bottomInfo">copyright © 2017-2020 四川吃了吗餐饮连锁企业</p>
  </div>
</template>

<script>
import { api_login } from "../apis/apis";
export default {
  data() {
    return {
      acc: "",
      pwd: "",
      show: false,
      isSend: true, //true可以发送请求 false不能发送请求
      showCode: false,
    };
  },
  methods: {
    clickLogin() {
      // 防抖节流
      // 方法1 定时器
      // if (!this.isSend) return;
      // setTimeout(() => {
      //   this.isSend = true;
      // }, 3000);
      // this.isSend = false;

      // 方法二 验证码
      // 显示滑动验证码
      this.showCode = true;
    },
    requsetLogin() {
      api_login({ account: this.acc, password: this.pwd }).then((res) => {
        if (res.data.code == 0) {
          this.$router.push("/nav/index");
          // 登录成功保存数据
          localStorage.token = res.data.token;
          localStorage.id = res.data.id;
          localStorage.acc = this.acc;

          // 权限
          localStorage.role = res.data.role;

          this.$message({
            message: "登录成功",
            type: "success",
          });
          this.$router.push("./nav/Index");
        } else {
          this.$message({
            message: "登录失败",
            type: "warning",
          });
          this.show = true;
        }
      });
    },
    // 验证成功
    onSuccess() {
      this.onRefresh();
      this.requsetLogin();
      this.showCode = false;
    },
    // 验证失败
    onFail() {},
    // 刷新
    onRefresh() {},
  },
};
</script>

<style lang="less" scoped>
@base: #304156;
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: @base;
  .box-card {
    width: 340px;
    height: 450px;
    border: 0;
    box-shadow: none;
    .el-input__inner {
      background-color: @base !important;
    }
    .acc {
      margin-bottom: 15px;
    }
    button {
      margin-top: 20px;
      width: 100%;
      background-color: #409eff;
      color: #fff;
      border: 0;
    }
  }
  // 滑动验证
  #slideVerify {
    position: relative;
    top: 10px;
    right: 5px;
  }
  .bottomInfo {
    position: fixed;
    bottom: 0;
    font-size: 12px;
    color: #fff;
  }
}
</style>