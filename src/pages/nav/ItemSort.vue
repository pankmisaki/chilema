<template>
  <div>
    <el-card>
      <p id="title">
        <span>添加分类</span>
        <el-button @click="addCate" type="primary">添加分类</el-button>
      </p>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="分类名称" width="320">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.cateName"
              v-show="scope.row.edit"
            ></el-input>
            <p v-show="!scope.row.edit">{{ scope.row.cateName }}</p>
          </template>
        </el-table-column>
        <!-- 按钮 -->
        <el-table-column label="是否启用" width="180">
          <template slot-scope="scope">
            <el-switch
              :disabled="!scope.row.edit"
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.edit ? 'success' : ''"
              @click="clickEdit(scope.row)"
              >{{ scope.row.edit ? "确定" : "编辑" }}</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChangge"
          :current-page="currentPage"
          :page-sizes="[5, 6, 8, 10]"
          :page-size="pageSize"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加分类框 -->
    <el-dialog title="添加分类" :visible.sync="dialogAdd" width="30%">
      <div>
        <el-input v-model="cateNameval" />
        <el-switch 
              active-color="#13ce66"
              inactive-color="#ff4949" v-model="stateVal"></el-switch>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="clickAddConfi">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  api_catelist,
  api_delcate,
  api_editcate,
  api_addcate,
} from "../../apis/apis";
export default {
  created() {
    this.changeData();
  },
  data() {
    return {
      // 表格
      tableData: [], //数据
      currentPage: 1, //当前页面
      pageSize: 5, //当前页数据条数
      total: 0, //总数据条数
      dialogAdd: false,
      cateNameval: "", //添加分类名字
      stateVal: false, //添加数据状态
    };
  },
  methods: {
    changeData() {
      let { currentPage, pageSize } = this;
      api_catelist({ params: { currentPage, pageSize } }).then((res) => {
        // 先转数据，再赋值
        for (let obj of res.data.data) {
          obj.state = obj.state == 1;
          obj.edit = false;
        }
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    // 点击编辑
    clickEdit(data) {
      console.log(data);
      if (data.edit) {
        // 编辑状态发送请求
        api_editcate(data).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "数据编辑成功!",
              type: "success",
            });
            data.edit = false;
          }
        });
      } else {
        // 打开编辑状态
        data.edit = true;
      }
    },
    //添加分类
    // 点击弹出添加分类模态框
    addCate() {
      this.dialogAdd = true;
    },
    //确定编辑，发送请求修改数据
    clickAddConfi() {
      // 发送添加分类请求
      api_addcate({ cateName: this.cateNameval, state: this.stateVal }).then(
        (res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.dialogAdd = false;
            this.changeData(); //重新请求以下本页数据
          }else{
            return false;
           
          }
        }
      );
    },
    // 删除数据
    handleDelete(data, res) {
      console.log(data, res);
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "吃了吗提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api_delcate({ params: { id: data.id } }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.changeData(); //重新请求以下本页数据
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 分页器
    // 点击切换每页的条数
    sizeChange(val) {
      this.pageSize = val;
      this.changeData();
    },
    // 点击跳转页面
    currentChangge(val) {
      this.currentPage = val;
      this.changeData();
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

  button {
    float: right;
    margin-right: 20px;
  }
}
</style>