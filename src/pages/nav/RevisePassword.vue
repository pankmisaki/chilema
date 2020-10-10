<template>
  <div>
    <el-card>
      <p id="title">
        <span>修改密码</span>
      </p>
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model.number="ruleForm.oldPwd"></el-input>
          <p style="color: red" v-show="show">用户名格式错误</p>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input
            type="password"
            v-model="ruleForm.pwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input
            type="password"
            v-model="ruleForm.checkPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="changePWd">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { api_checkoldpwd, api_editpwd } from "../../apis/apis";
export default {
  created() {},
  data() {
   
    return {
      ruleForm: {
        pwd: "",
        checkPwd: "",
        oldPwd: "",
      },
      show: false,
    
    };
  },

  methods: {
    changePWd() {
       
       if (
         !this.ruleForm.oldPwd ||
        !this.ruleForm.pwd ||
        !this.ruleForm.checkPwd
      ) {
        this.$message({
          message: "修改失败",
          type: "error",
        });
        return false;
      }
      // 验证就密码是否正确接口
      api_checkoldpwd({
        params: { oldPwd: this.ruleForm.oldPwd, id: localStorage.id },
      })
        .then((res) => {
          if (!(res.data.code == 0)) {
            this.show = true;
            return false;
          }
        })
        .then();

      //  修改密码接口
      api_editpwd({ newPwd: this.ruleForm.pwd, id: localStorage.id }).then(
        (res) => {
          console.log(res);
          if (!(this.ruleForm.pwd == this.ruleForm.checkPwd)) {
            this.$message({
              message: "两次密码不一致",
              type: "error",
            });
            return;
          }
        }
      );

     
    },
    // 重置输入数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.el-form {
  width: 400px;
}
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
</style>