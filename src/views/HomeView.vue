<template>
  <div id="app">
    <el-container>
      <!-- 头部 -->
      <el-header class="this-header" style="height: 80px">
        <span style="flex-grow: 1">Document Order Management System</span>
        <span class="userinfo">Welcome ：{{ userInfo.username }}</span>
        <el-button
          style="align-self: center; margin-right: 30px"
          type="danger"
          size="small"
          @click="logout"
          >Exit</el-button
        >
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <!--菜单的折叠和显示-->
          <!-- isCollapse 菜单是否折叠  -->
        
          <!--侧边菜单-->
         <el-menu :default-active="active" class="el-menu-vertical-demo" router>

            <router-link to="/user" style="text-decoration: none">
              <el-menu-item index="/user" v-if="isflag" @click="selectMenuItem('/user')"> 
                <el-icon><User /></el-icon>
                <span>User Information</span>
              </el-menu-item>
            </router-link>

            <el-menu-item index="order" v-if="isflag" @click="selectMenuItem('order')">
              <el-icon><Tickets /></el-icon>
              <span>Order Management</span>
            </el-menu-item>

            <el-menu-item index="manage" v-if="userInfo.rolename=='op' ? false : true" @click="selectMenuItem('manage')">
              <el-icon><Reading /></el-icon>
              <span>Task Management</span>
            </el-menu-item>

            <el-menu-item index="task" v-if="isflag" @click="selectMenuItem('task')">
              <el-icon><Calendar /></el-icon>
              <span>Schedule</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-container>
          <!-- 主题区域 -->
          <el-main> <router-view></router-view></el-main>
          <el-footer style="height: 30px"
            >© Console Classbro Limited 2022. All rights reserved.</el-footer
          >
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HomeView",
  data() {
    return {
      userInfo: null,
      baseUrl: "http://172.16.10.7:8000/api",
      //   isCollapse: true,
      active: "/user",
      // 左侧菜单列表
      menuList: [],
      // 图标样式对象
      // 是否折叠左侧菜单
      isflag: true,
      iconObj: {
        1001: "iconfont icon-shouye",
        1002: "iconfont icon-users",
        1003: "iconfont icon-shangpin",
        1004: "iconfont icon-danju",
      },
    };
  },
  created() {
    // 获取用户信息  用以展示到首页
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if(this.userInfo.rolename=='writer'){
        this.isflag=false
    }
    // this.getMenuList();
  },
  mounted(){
    this.active =  window.sessionStorage.getItem("activerouter");
  },

  methods: {
    selectMenuItem(path) {
      this.active = path
      window.sessionStorage.setItem("activerouter", path);
    },
    logout() {
      this.$confirm("Tip: Are you sure you want to logout", {
        confirmButtonText: "Log out",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        // 点击确认后,清除session用户信息
        sessionStorage.clear();
        // 跳转到登录页面
        this.$router.push("/login");
      });
    },

    // async getMenuList() {
    //   // 发送请求判断是否登录成功（用户信息在res.data中）
    //   const { data: res } = await axios.get(this.baseUrl + "/user/menu/");
    //   this.menuList = res.data;
    // },
  },
};
</script>
<style>
.el-menu {
  border-width: 0;
}

/* .this-aside {
  height: 100vh;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
} */

.this-header {
  display: -ms-flexbox;
  display: flex;
  /* 
  -ms-flex-pack: justify;
  justify-content: space-between; */
}
.userinfo {
  font-size: 20px;
  margin-right: 10px;
}

#app {
  margin: 0px;
  padding: 0px;
  height: 100%;
}

.el-menu {
  border-right: 0;
}
.toggle-button {
  background: #60779d;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: white;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
.iconfont {
  margin-right: 10px;
}
</style>