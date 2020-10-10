<template>
  <div>
    <el-card>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="s_orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="s_consignee" placeholder="收货人"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="s_phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="s_orderState" placeholder="订单状态">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="block">
          <span class="demonstration">选择时间</span>
          <el-date-picker
            v-model="s_searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 82%">
        <el-table-column
          fixed
          prop="orderNo"
          label="订单号"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="orderTime"
          label="下单时间"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="consignee"
          label="收货人"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="deliverAddress"
          label="配送地址"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="deliveryTime"
          label="送达时间"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="remarks"
          label="用户备注"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="orderAmount"
          label="订单金额"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="orderState"
          label="订单状态"
          width="80"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="see(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small" @click="editOrder(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 当前行的详细数据 -->
      <el-dialog
        class="detailed"
        title="订单详情"
        :visible.sync="detailed"
        width="30%"
      >
        <div>
          <span>订单id:</span><span>{{ list.id }}</span>
        </div>
        <div>
          <span>订单号:</span><span>{{ list.orderNo }}</span>
        </div>
        <div>
          <span>下单时间:</span><span>{{ list.orderTime }}</span>
        </div>
        <div>
          <span>联系电话:</span><span>{{ list.phone }}</span>
        </div>
        <div>
          <span>收货人:</span><span>{{ list.consignee }}</span>
        </div>
        <div>
          <span>送货地址:</span><span>{{ list.deliverAddress }}</span>
        </div>
        <div>
          <span>送达时间:</span><span>{{ list.deliveryTime }}</span>
        </div>
        <div>
          <span>备注:</span><span>{{ list.remarks }}</span>
        </div>
        <div>
          <span>订单金额:</span><span>{{ list.orderAmount }}</span>
        </div>
        <div>
          <span>订单状态:</span><span>{{ list.orderState }}</span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="detailed = false">取 消</el-button>
          <el-button type="primary" @click="detailed = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改当前行的详细数据 -->
      <el-dialog
        class="detailed"
        title="订单详情"
        :visible.sync="dialogedit"
        width="30%"
      >
        <div>
          <span>订单id:</span><span>{{ editList.id }}</span>
        </div>
        <div><span>订单号:</span><el-input v-model="editList.orderNo" /></div>
        <div>
          <span>下单时间:</span><el-input v-model="editList.orderTime" />
        </div>
        <div><span>联系电话:</span><el-input v-model="editList.phone" /></div>
        <div><span>收货人:</span><el-input v-model="editList.consignee" /></div>
        <div>
          <span>送货地址:</span><el-input v-model="editList.deliverAddress" />
        </div>
        <div>
          <span>送达时间:</span><el-input v-model="editList.deliveryTime" />
        </div>
        <div><span>备注:</span><el-input v-model="editList.remarks" /></div>
        <div>
          <span>订单金额:</span><el-input v-model="editList.orderAmount" />
        </div>
        <div>
          <span>订单状态:</span><el-input v-model="editList.orderState" />
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogedit = false">取 消</el-button>
          <el-button type="primary" @click="editdialog">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 8, 10]"
          :page-size="5"
          layout="total, sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { api_orderList, api_orderDetail, api_orderEdit } from "../../apis/apis";
import { getChinaTime } from "../../utils/utils";
export default {
  created() {
    // 订单列表数据
    this.changeData();
  },
  data() {
    return {
      // 订单表格
      tableData: [],
      currentPage: 1, //当前页面
      pageSize: 5, //当前条数
      total: 0, //总数据条数

      list: {}, //当前行数据
      detailed: false, //当前行详细

      editList: {}, //修改数据的当前行
      dialogedit: false,

      // 查询数据
      s_orderNo: "", //订单号
      s_consignee: "", //收货人
      s_phone: "", //手机号
      s_orderState: "", //订单状态
      s_searchTime: [new Date("2020-06-01 09:00:00"), new Date()], //查询时间
      options: ["已受理", "已完成", "派送中"],
    };
  },
  methods: {
    // 刷新表格数据
    changeData(obj={}) {
      let { currentPage, pageSize } = this;
      api_orderList({ params: { currentPage, pageSize,...obj } }).then((res) => {
        for (let obj of res.data.data) {
          // 下单时间转换
          obj.orderTime = getChinaTime(obj.orderTime);
          // 送达时间转换
          obj.deliveryTime = getChinaTime(obj.deliveryTime);
        }

        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },

    //表格
    // 点击查看订单详情
    see(data) {
      this.list.id = data.id;
      // 订单当前行详细数据
      api_orderDetail({ params: { id: this.list.id } }).then((res) => {
        let obj = res.data.data;
        // 下单时间转换
        obj.orderTime = getChinaTime(obj.orderTime);

        // 送达时间转换
        obj.deliveryTime = getChinaTime(obj.deliveryTime);

        // console.log(res);
        this.list = obj;
        // console.log(this.list.id);
        // console.log(this.list);
      });
      this.detailed = true;
    },
    // 点击查询进行模糊查询
    search() {
      let {s_orderNo,s_consignee,s_phone,s_orderState,s_searchTime} = this

      let timeArr = [getChinaTime(s_searchTime[0]),getChinaTime(s_searchTime[1])]
      console.log(timeArr);
      this.changeData({
        orderNo:s_orderNo,
        consignee:s_consignee,
        phone:s_phone,
        orderState:s_orderState,
        date:JSON.stringify(timeArr)
      })
    },
    // 修改当前行的数据
    // 弹出修改数据的模态框
    editOrder(res) {
      // 保存数据
      this.editList = JSON.parse(JSON.stringify(res));
      this.dialogedit = true;
      console.log(this.editList);
    },
    // 确认修改订单数据
    editdialog() {
      api_orderEdit(this.editList).then((res) => {
        console.log(res.data.code);
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });

          this.changeData();
        }
      });
      this.dialogedit = false;
    },

    // 分页器
    // 每页数据条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.changeData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.changeData();
    },
  },
};
</script>

<style scoped lang="less">
// 表单
.el-form {
  text-align: left;
  line-height: 40px;
  padding: 15px;
  .el-form-item {
    display: inline-flex;
  }
  .block {
    span {
      margin-right: 15px;
    }
    button {
      margin-left: 15px;
    }
  }
}

// 表格
.el-table {
  margin-top: 20px;
  .el-table__header {
    line-height: 30px !important;
  }
}

.detailed {
  div {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: blod;
  }
}
</style>