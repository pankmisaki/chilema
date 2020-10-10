<template>
  <div>
    <el-card>
      <p>
        <span>商品名称</span>
        <el-input v-model="name" placeholder="商品名称"></el-input>
      </p>
      <p>
        <span>商品分类</span>
        <el-select v-model="category" placeholder="商品分类">
          <el-option
            v-for="item in options"
            :key="item.index"
            :value="item.cateName"
            :label="item.cateName"
          >
          </el-option>
        </el-select>
      </p>
      <p class="num">
        <span>商品价格</span>
        <el-input-number v-model="price" :min="1"></el-input-number>
      </p>
      <!-- 上传图片 -->
      <p class="picture">
        <span>商品图片</span>
        <el-upload
          action="http://127.0.0.1:5000/goods/goods_img_upload"
          :show-file-list="true"
          list-type="picture-card"
          :on-success="upSuccess"
        >
          <img
            class="avatar"
            width="100%"
            v-if="upload_img_url"
            :src="upload_img_url"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </p>

      <p>
        <span>商品描述</span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="goodsDesc"
        >
        </el-input>
      </p>

      <el-button class="addWares" type="primary" @click="addGoods"
        >添加商品</el-button
      >
    </el-card>
  </div>
</template>

<script>
import { api_categories, api_goodsadd } from "../../apis/apis";
export default {
  created() {
    // 查询所有分类名称
    api_categories().then((res) => {
      //保存下拉项列表
      this.options = res.data.categories;
      this.category = this.options[0].cateName;
      console.log(res);
    });
  },
  data() {
    return {
      name: "", //商品名称
      category: "", //商品分类
      options: [], //当前下拉项数组
      price: 1, //商品价格
      goodsDesc: "", //商品描述
      imgUrl: "", //商品图片名称
      upload_img_url: "", //上传图片区域显示的图片
    };
  },
  methods: {
    //图片上传成功的回调
    upSuccess(res) {
      if (res.code == 0)
        //  保存新图片的名字
        this.imgUrl = res.imgUrl;

      // 图片回填
      this.upload_img_url =
        "http://127.0.0.1:5000/upload/imgs/goods_img/" + res.imgUrl;
    },

    // 添加商品
    addGoods() {
      //发送请求添加商品接口
      if (
        this.name &&
        this.category &&
        this.price &&
        this.imgUrl &&
        this.goodsDesc
      ) {
        api_goodsadd({
          name: this.name,
          category: this.category,
          price: this.price,
          imgUrl: this.imgUrl,
          goodsDesc: this.goodsDesc,
        }).then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.name = "";
            this.category = "";
            this.price = "";
            this.imgUrl = "";
            this.goodsDesc = "";
          }
        });
      } else {
        this.$message({
          message: "添加失败",
          type: "error",
        });
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
p {
  margin-bottom: 20px;
  .el-input {
    width: 300px;
    margin-left: 10px;
  }
  .el-select {
    margin-left: 10px;
  }
  &:nth-last-child(2) {
    span {
      position: relative;
      top: -33px;
    }
    .el-textarea {
      width: 300px;
      margin-left: 10px;
    }
  }
}
.addWares {
  margin-left: 75px;
}
.num {
  display: flex;

  span {
    margin-right: 10px;
    line-height: 40px;
  }
  .el-input {
    width: 100px;
    margin: 0 -3px;
  }
}

.picture {
  display: flex;
  span {
    margin-right: 10px;
  }
}
</style>