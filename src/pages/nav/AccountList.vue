<template>
  <div>
    <el-card>
      <p id="title">
        <span>账号列表</span>
      </p>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="用户组" prop="userGroup"></el-table-column>
        <el-table-column label="创建时间" prop="ctime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="
                dialogFormVisible = true;
                add(scope.row);
              "
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="userDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[6, 7, 8, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 批量删除 -->
      <p>
        <el-button @click="removeAll" type="danger">批量删除</el-button>
        <el-button @click="toggleSelection()" type="primary"
          >取消选择</el-button
        >
      </p>

      <!-- 修改账号 -->
      <el-dialog title="修改账号" :visible.sync="dialogFormVisible" width="17%">
        <el-form>
          <el-form-item label="账号">
            <el-input
              class="userInput"
              v-model="user"
              autocomplete="off"
            ></el-input>
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              dialogFormVisible = false;
              userEdit(user, select);
            "
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  api_userlist,
  api_edituser,
  api_deleteuser,
  api_batchdel,
} from "../../apis/apis";
import { getChinaTime } from '../../utils/utils';
export default {
  created() {
    this.changeData();
  },
  data() {
    return {
      tableData: [],
      total: 0, //总数据条数
      currentPage: 1, //显示当前页数
      pageSize: 6, //每页显示条数
      id: 1,

      dialogFormVisible: false,

      user: "",
      userGroup: "",
      select: "超级管理员",
      options: ["超级管理员", "普通管理员"],

      selectArr: [], //当前选中的数组

      formLabelWidth: "120px",

      // 取消全选
      multipleTable: [],
    };
  },

  methods: {
    add(add) {
      localStorage.id = add.id;
      localStorage.account = add.account;
      localStorage.userGroup = add.userGroup;

      this.id = localStorage.id;
      this.user = localStorage.account;
      this.select = localStorage.userGroup;
    },
    // 发送请求刷新表格数据
    changeData() {
      let { currentPage, pageSize } = this;
      api_userlist({ params: { currentPage, pageSize } }).then((res) => {
        let oldArr = res.data.data;
        // 时间转换
        for (let obj of res.data.data) {
         obj.ctime = getChinaTime(obj.ctime)
        }
        this.tableData = oldArr;
        this.total = res.data.total;
      });
    },
    //发送请求删除单条数据
    delData() {
      let { id } = this;
      api_deleteuser({ params: { id } });
    },
    // 发送请求修改账户数据
    changeUser() {
      api_edituser({
        id: this.id,
        account: this.user,
        userGroup: this.select,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }
      });
    },
    selectionChange(val) {
      this.selectArr = val;
    },
    // 每页显示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      // 先改变条数
      this.pageSize = val;
      // 在请求新页数的数据条数
      this.changeData();
    },
    // 显示当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);

      // 先改变页数
      this.currentPage = val;
      // 再请求新页数的数据
      this.changeData();
    },
    // 删除单条数据
    userDelete(data) {
      if (confirm("您确定要删除该账户？")) {
        this.id = data.id;
        this.delData();
        this.changeData();

        this.$message({
          message: "删除成功",
          type: "success",
        });
      }
    },
    // 批量删除
    removeAll() {
      //获取所有点击数据的id
      let arr = this.selectArr.map((obj) => obj.id);
      let newArr = JSON.stringify(arr);
      // console.log(arr);
      if (this.selectArr == "") {
        return false;
      } else {
        api_batchdel({ params: { ids: newArr } }).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
          }
          this.changeData();
        });
      }
    },
    // 取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    // 修改账号
    userEdit() {
      this.changeUser();
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
  span {
    font-weight: bold;
    display: inline-block;
    line-height: 41px;
  }
}

.el-pagination {
  padding: 0 20px;
  margin-top: 20px;
}

.userInput {
  width: 217px;
  margin-left: 13px;
}
</style>