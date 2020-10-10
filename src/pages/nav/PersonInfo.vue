<template>
  <div>
    <el-card>
      <p id="title">
        <span>管理员信息</span>
      </p>

      <ul>
        <li>
          管理员ID:<span>{{ id }}</span>
        </li>
        <li>
          账号：<span>{{ acc }}</span>
        </li>
        <li>
          用户组：<span>{{ userGroup }}</span>
        </li>
        <li>
          创建时间：<span>{{ ctime }}</span>
        </li>
        <p style="display: flex">
          管理员头像：
          <el-upload
            action="http://127.0.0.1:5000/users/avatar_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :data="params"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </p>
      </ul>
    </el-card>
  </div>
</template>

<script>
import { api_accountinfo } from "../../apis/apis";
export default {
  created() {
    api_accountinfo({ params: { id: localStorage.id } }).then((res) => {
      this.id = res.data.accountInfo.id;
      this.acc = res.data.accountInfo.account;
      this.userGroup = res.data.accountInfo.userGroup;
      this.ctime = res.data.accountInfo.ctime;

      let oldArr = res.data.accountInfo;
      console.log(oldArr);
      // 时间转换

      let data = new Date(oldArr.ctime);

      oldArr.ctime =
        data.getFullYear() +
        "-" +
        (data.getMonth() + 1) +
        "-" +
        data.getDate() +
        " " +
        data.getHours() +
        ":" +
        data.getMinutes() +
        ":" +
        data.getSeconds();

      this.ctime = oldArr.ctime;
    });
  },
  data() {
    return {
      id: "",
      acc: "",
      userGroup: "",
      ctime: "",
      imageUrl: "",
      params: { id: localStorage.id },
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      if (res.code == 0) console.log("上传成功");
      console.log(res.imgUrl);

      this.$bus.emit("changeImg", res.imgUrl);
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
ul {
  padding: 0 10px;
  li {
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    font-size: 20px;
    span {
      margin-left: 5px;
    }
  }
  p {
    display:flex;
    align-items: center;
    margin-top: 20px;
    font-size: 20px;
    div{
      text-align: center;
      line-height: 100px;
      width: 100px;
      height: 100px;
      border: 1px solid #ccc;
    
    }
  }
}
ul,
li {
  list-style: none;
}
</style>