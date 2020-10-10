<template>
  <div>
    <el-card>
      <p id="title">
        <span>店铺管理</span>
        <el-button type="primary" @click="conserve">保存</el-button>
      </p>
      <el-form :model="form" label-width="80px">
        <el-form-item label="店铺名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="店铺公告">
          <el-input type="textarea" v-model="form.bulletin"></el-input>
        </el-form-item>
        <el-form-item label="店铺头像">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="headImgSuccess"
          >
            <img
              style="width: 150px"
              v-if="form.avatar"
              :src="'http://127.0.0.1:5000/upload/shop/' + form.avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="店铺图片">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            list-type="picture-card"
            :on-success="imgsWallSuccess"
            :on-remove="imgsWallRemove"
            :file-list="oldImgsWall"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="配送费">
          <el-input v-model="form.deliveryPrice"></el-input>
        </el-form-item>
        <el-form-item label="配送时间">
          <el-input v-model="form.deliveryTime"></el-input>
        </el-form-item>
        <el-form-item label="配送描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分">
          <el-input v-model="form.score"></el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="form.sellCount"></el-input>
        </el-form-item>

        <el-form-item label="活动">
          <!-- 活动复选框 -->
          <el-input v-model="activeName" />
          <el-button style="margin-top: 6px" @click="addActive"
            >添加活动</el-button
          >
          <el-checkbox-group v-model="activeListValue">
            <el-checkbox
              v-for="item in activeList"
              :key="item"
              :label="item"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="营业时间">
          <el-time-picker
            is-range
            v-model="form.date"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { api_shopinfo, api_shopedit } from "../../apis/apis";
import { getChinaTime } from "../../utils/utils";
export default {
  created() {
    this.changeData();
  },
  data() {
    return {
      activeName: "", //活动
      activeListValue: [], //取值数组
      activeList: [], //所有添加的活动数组 控制checkbox的添加

      imgsWall: [], //照片墙的所有照片名称
      oldImgsWall: [], //已经上传成功的店铺图片/存在的店铺图片

      form: {
        id: "", //店铺id
        name: "", //名称
        bulletin: "", //公告
        avatar: "", //店铺头像
        deliveryPrice: "", //起送价格
        deliveryTime: "", //送达时间
        description: "", //店铺描述
        score: 99, //好评率
        sellCount: 998, //销量
        supports: "[]", //活动
        pics: "[]", // 店铺图片 多张
        date: "[]", //营业时间
        minPrice: 11, //起送价
      },
    };
  },
  methods: {
    changeData() {
      // 获取店铺信息
      api_shopinfo().then((res) => {
        this.form = res.data.data;
        // 照片墙存在的图片
        this.oldImgsWall = this.form.pics.map((name) => {
          return { name, url: "http://127.0.0.1:5000/upload/shop/" + name };
        });
        //把回填的图片也添加到shopimgs中
        this.imgsWall.push(...this.form.pics);
        //合并数组  活动
        this.activeList = [...this.activeList, ...this.form.supports];
      });
    },
    // 修改数据
    conserve() {
      let { date } = this.form;
      // 拼接参数对象  进行深拷贝一次
      let params = JSON.parse(JSON.stringify(this.form));
      console.log(params);
      params.supports = JSON.stringify(this.activeListValue);
      params.date = JSON.stringify([
        getChinaTime(date[0]),
        getChinaTime(date[1]),
      ]);
      params.pics = JSON.stringify(this.imgsWall);
      api_shopedit(params).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success",
          });

          this.changeData()
        }
      });
    },
    // 添加一个活动
    addActive() {
      if (this.activeName == 0) return;
      this.activeList.push(this.activeName);
    },

    // 店铺头像上传
    headImgSuccess(res) {
      //回填数据
      this.form.avatar = res.imgUrl;
      console.log(res.imgUrl);
    },

    // 照片墙上传图片
    imgsWallSuccess(res) {
      this.imgsWall.push(res.imgUrl);
    },

    // 删除照片墙图片
    imgsWallRemove(file) {
      let imgUrl = file.response ? file.response.imgUrl : file.name;

      for (let i = 0; i < this.imgsWall.length; i++) {
        if (this.imgsWall[i] == imgUrl) this.imgsWall.splice(i, 1);
      }
      console.log(this.imgsWall);
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
  button {
    float: right;
    margin-right: 20px;
  }
}
.el-form {
  width: 500px;
}

// 用户头像
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>