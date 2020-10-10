<template>
  <el-container>
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <el-row class="tac">
        <el-col :span="24">
          <el-menu
            router
            unique-opened
            :default-active="defaultHash"
            class="el-menu-vertical-demo"
            background-color="#304156"
            text-color="#fff"
            active-text-color="#2B75E4"
            @select="handleSelect"
          >
            <div v-for="item in list" :key="item.index">
              <el-submenu v-if="item.children" :index="item.index">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="child in item.children"
                    :key="child.name"
                    :index="child.index"
                    >{{ child.name }}</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item v-else :index="item.index">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <!-- 右侧容器 -->
    <el-container>
      <el-header>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadlist" :key="item">{{
            item
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
          <p @click="clickTitle">{{ title }}</p>
          <img @click="changeHead" :src="headimg" />
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { api_token, api_accountinfo } from "../apis/apis";
export default {
  created() {
    //  权限过滤
    let newArr = this.list.filter((obj) => {
      return obj.role.includes(localStorage.role);
    });
    this.list = newArr;

    //  验证token是否过期
    api_token({ params: { token: localStorage.token } }).then((res) => {
      if (res.data.code == 0) {
        // 还在登录期间
        this.title = localStorage.acc;
      } else {
        this.title = "请登录";
      }
    });

    // 获取用户信息
    api_accountinfo({ params: { id: localStorage.id } }).then((res) => {
      // console.log(res);
      this.headimg = res.data.accountInfo.imgUrl;
    });

    //参数1： 要监听的通知名字  参数2： 回调函数
    this.$bus.on("changeImg", (newImg) => {
      let oldStr = this.headimg;
      let severURL = oldStr.substring(0, oldStr.lastIndexOf("/") + 1);

      //  新地址拼接
      this.headimg = severURL + newImg;
    });

    //初始化时，设置默认选中的hash
    this.defaultHash = this.$route.path;

    // 初始化时，设置默认选中的菜单栏名字
    this.handleSelect(this.defaultHash)
  },
  data() {
    return {
      list: [
        {
          index: "/nav/index",
          name: "后台首页",
          icon: "el-icon-s-home",
          role: ["super", "normal"],
          breadlist: ["首页"],
        },
        {
          index: "/nav/order",
          name: "订单管理",
          icon: "el-icon-s-order",
          role: ["super", "normal"],
          breadlist: ["订单管理"],
        },
        {
          index: "3",
          name: "商品管理",
          icon: "el-icon-s-cooperation",
          children: [
            {
              index: "/nav/itemlist",
              name: "商品列表",
              breadlist: ["商品管理", "商品列表"],
            },
            {
              index: "/nav/itemadd",
              name: "商品添加",
              breadlist: ["商品管理", "商品添加"],
            },
            {
              index: "/nav/itemsort",
              name: "商品分类",
              breadlist: ["商品管理", "商品分类"],
            },
          ],
          role: ["super"],
        },
        {
          index: "/nav/store",
          name: "店铺管理",
          icon: "el-icon-s-shop",
          role: ["super", "normal"],
          breadlist: ["商品管理", "商品分类"],
        },
        {
          index: "5",
          name: "账号管理",
          icon: "el-icon-user",
          children: [
            {
              index: "/nav/accountlist",
              name: "账号列表",
              breadlist: ["账号管理", "账号列表"],
            },
            {
              index: "/nav/accountadd",
              name: "添加账号",
              breadlist: ["账号管理", "添加账号"],
            },
            {
              index: "/nav/revisepassword",
              name: "修改密码",
              breadlist: ["账号管理", "修改密码"],
            },
          ],
          role: ["super"],
        },
        {
          index: "6",
          name: "销售统计",
          icon: "el-icon-pie-chart",
          children: [
            {
              index: "/nav/statistics",
              name: "商品统计",
              breadlist: ["销售统计", "商品统计"],
            },
            {
              index: "/nav/orderSta",
              name: "订单统计",
              breadlist: ["销售统计", "订单统计"],
            },
          ],
          role: ["super"],
        },
      ],
      title: "请登录",
      headimg: "",
      defaultHash: "/nav/index", //默认hash地址
      breadlist: [], //面包屑数组
    };
  },
  methods: {
    clickTitle() {
      if (this.title == "请登录") this.$router.push("/");
    },
    changeHead() {
      this.$router.push("/nav/personinfo");
    },
    // 左侧菜单栏改变
    handleSelect(index) {
      for (let item of this.list) {
        // 如果有2级节点，就循环2级节点
        if (item.children) {
          //  循环二级节点
          for (let child of item.children) {
            if(child.index == index) this.breadlist = child.breadlist
          }
        } else {
          // 一级直接判断
          if (item.index == index) this.breadlist = item.breadlist;
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
@base: #304156;
.el-container {
  height: 100%;
  background-color: #f0f2f5;
  .el-main {
    margin-top: 15px;
    margin-left: 15px;
    background: #f0f2f5;
    padding: 0;
  }
}
.el-header {
  display: flex;
  justify-content: space-between;
  height: 80px !important;
  background-color: #fff;
  .el-breadcrumb {
    line-height: 41px;
  }
  div {
    display: flex;
    align-items: center;
    margin-right: 300px;
    p {
      margin-right: 5px;
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}

.el-aside {
  background-color: @base;
  color: #333;
  .el-menu {
    border: 0;
  }
  i {
    color: #fff;
  }
}

.el-main {
  background-color: #f0f2f5;
  color: #333;
}
</style>