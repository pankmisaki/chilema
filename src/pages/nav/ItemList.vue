<template>
  <div>
    <el-card>
      <el-table
        :data="tableData"
        v-loading="showloading"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品 ID">
                <span>{{ scope.row.id }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ scope.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ scope.row.category }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ scope.row.price }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <span
                  ><img
                    :src="
                      'http://127.0.0.1:5000/upload/imgs/goods_img/' +
                      scope.row.imgUrl
                    "
                /></span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ scope.row.ctime }}</span>
              </el-form-item>
              <el-form-item label="商品评价">
                <span>{{ scope.row.rating }}</span>
              </el-form-item>
              <el-form-item label="商品销量">
                <span>{{ scope.row.sellCount }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ scope.row.goodsDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" prop="name"> </el-table-column>
        <el-table-column label="所属分类" prop="category"> </el-table-column>
        <el-table-column label="商品价格" prop="price"> </el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img
              :src="
                'http://127.0.0.1:5000/upload/imgs/goods_img/' +
                scope.row.imgUrl
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="商品描述" prop="goodsDesc"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="delgoods(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑模态框 -->
      <el-dialog title="修改商品" :visible.sync="dialogFormVisible">
        <div class="edit">
          <p>
            <span>商品名字</span>
            <el-input v-model="editData.name" />
          </p>
          <p>
            <span>商品分类</span>
            <el-input v-model="editData.category" />
          </p>
          <p>
            <span>商品价格</span>
            <el-input v-model="editData.price" />
          </p>

          <p>
            <span>商品图片</span>
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:5000/goods/goods_img_upload"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              v-model="editData.imgUrl"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </p>

          <p>
            <span>商品描述</span>
            <el-input v-model="editData.goodsDesc" />
          </p>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogEdit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 8, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { api_goodsList, api_delgoods, api_goodsedit } from "../../apis/apis";
import { getChinaTime } from "../../utils/utils";
export default {
  data() {
    return {
      tableData: [], //商品总数据
      currentPage: 1, //当前页数
      pageSize: 5, //当前页数据条数
      total: 0, //总条数
      dialogFormVisible: false, //是否显示编辑框
      editData: {}, //当前点击的数据
      formLabelWidth: "100px", //编辑框宽度

      showloading: true,
    };
  },
  created() {
    setTimeout(() => {
      this.changeData();
    }, 2000);
  },
  methods: {
    // 获取商品列表数据
    changeData() {
      api_goodsList({
        params: { currentPage: this.currentPage, pageSize: this.pageSize },
      }).then((res) => {
        for (let obj of res.data.data) {
          obj.ctime = getChinaTime(obj.ctime);
        }
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.showloading = false;
      });
    },
    // 删除商品数据
    delgoods(data) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "吃了吗提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api_delgoods({ params: { id: data.id } }).then(() => {
            this.changeData(); //重新加载数据
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // 发送请求删除商品接口
    },

    // 修改商品数据
    // 弹出编辑框
    handleEdit(data) {
      // 保存当前数据
      this.editData = JSON.parse(JSON.stringify(data));
      this.dialogFormVisible = true;
    },
    // 确认修改商品
    dialogEdit() {
      api_goodsedit({
        name: this.editData.name,
        category: this.editData.category,
        price: this.editData.price,
        imgUrl: this.editData.imgUrl,
        goodsDesc: this.editData.goodsDesc,
        id: this.editData.id,
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.changeData();
        }
      });
      this.dialogFormVisible = false;
    },
    handleAvatarSuccess(res) {
      this.editData.imgUrl = res.imgUrl;
    },
    // 删除修改的图片
    handleRemove() {},
    //每页数据条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.changeData();
    },
    // 跳转到当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.changeData();
    },
  },
};
</script>

<style lang="less" scoped>

.el-table {
    height: 900px;
    border-bottom: #fff !important;
  tr {
    img {
      width: 140px;
      height: 140px;     
      }

  }
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
// 分页器
.el-pagination{
  margin-top:20px;
}
// 编辑模态框
.edit {
  p {
    margin-bottom: 10px;
  }
}
</style>