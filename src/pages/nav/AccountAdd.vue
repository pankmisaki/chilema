<template>
  <div>
    <el-card>
      <p id="title">
        <span>添加账号</span>
      </p>
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户" prop="user">
          <el-input type="text" v-model="user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="pwd"></el-input>
        </el-form-item>
        <el-form-item label="用户组" prop="select">
          <el-select v-model="select">
            <el-option
              v-for="item in options"
              :key="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn">
          <!-- 添加按钮 -->
          <el-button type="primary" @click="adduser">添加</el-button>
          <!-- 重置按钮 -->
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

    
    </el-card>
  </div>
</template>

<script>
import { api_adduser } from "../../apis/apis";
export default {
  data() {
    return {
      user: "",
      pwd: "",
      select: "超级管理员",
      options: ["超级管理员", "普通管理员"],
    };
  },
  methods: {
    adduser() {
      api_adduser({
        account: this.user,
        password: this.pwd,
        userGroup: this.select,
      }).then((res) => {
        if (res.data.code == 0) {
          this.user = "";
          this.pwd = "";
          this.select = "超级管理员";
          // 添加成功提示
          this.$message({
            message: "添加账户成功",
            type: "success",
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
#title {
  border-bottom: 1px solid #eff1f7;
  margin-bottom: 30px;
  overflow: hidden;
  text-indent: 10px;
  span {
    font-weight: bold;
    display: inline-block;
    line-height: 41px;
  }
}

// 表单
.el-form {
  width: 350px;
  text-align: right;
  .el-input {
    width: 200px;
    margin-right: 40px;
  }
  .el-select {
    width: 200px;
    margin-right: 40px;
  }
  .btn {
    text-align: left;
  }
}
</style>