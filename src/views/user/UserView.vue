<template>
  <el-container style="min-width: 1800px">
    <!-- 主题区域 -->

    <el-main>
      <!-- <el-breadcrumb separator=">">
        <el-breadcrumb-item>Home</el-breadcrumb-item>
        <el-breadcrumb-item><a href=""></a>User Management</el-breadcrumb-item>
      </el-breadcrumb> -->

      <el-form :inline="true">
        <el-row>
          <el-col :span="6"
            ><el-form-item label="Please enter the conditions：">
              <el-input
                placeholder="Please enter your username"
                style="width: 320px"
                v-model="queryInfo.query"
                clearable
                @clear="getUserList"
              /> </el-form-item
          ></el-col>
          <el-col :span="6" style="margin-top:-10px">
            <el-button type="primary" @click="getUserList">Inquiry</el-button>
            <!-- <el-button type="primary" icon="el-icon-share">下载</el-button> -->
            <el-button type="primary" @click="addDialogVisible = true"
              >New User</el-button
            >
          </el-col>
          <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
          <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
        </el-row>
      </el-form>
      <el-card>
        <el-table :data="userlist" border stripe >
          <el-table-column type="index" label="No.">
          </el-table-column>
          <el-table-column prop="username" label="Username"> </el-table-column>
          <el-table-column prop="password" label="Password"> </el-table-column>
          <el-table-column prop="role" label="Roles"> </el-table-column>
          <el-table-column prop="status" label="Status">
            <!--自定义模板 使用作用域插槽,通过scope.row获取当前行数据-->
            <template #default="scope">
              <div>
                <el-switch
                  v-model="scope.row.status"
                  @change="userStateChange(scope.row)"
                  v-if="adminstatus"
                  :disabled="scope.row.username == 'admin'"
                >
                </el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createtime" label="Creation time">
          </el-table-column>
          <el-table-column prop="last_login" label="Last login time">
          </el-table-column>
          <el-table-column label="Operate">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="showRoleDialog(scope.row)"
                ><el-icon><EditPen /></el-icon
              ></el-button>

              <el-button
                type="danger"
                size="small"
                @click="deleteUser(scope.row)"
                :disabled="scope.row.username == 'admin'"
                ><el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页功能-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
      <!--添加用户对话框-->
      <el-dialog
        title="Add User "
        v-model="addDialogVisible"
        width="40%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-form-item label="Username" prop="username" label-width="120px">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password" label-width="120px">
            <el-input v-model="addForm.password" show-password ></el-input>
          </el-form-item>
          <el-form-item label="Roles" prop="role" label-width="120px">
            <el-select v-model="addForm.role" placeholder="Select" size="large">
              <el-option
                v-for="item in roles"
                :key="item.value"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addUser">Submit</el-button>
        </span>
      </el-dialog>

      <!--分配角色对话框-->
      <el-dialog
        title="Assigning roles"
        v-model="roleDialogVisible"
        width="40%"
        @close="roleDialogClosed"
      >
        <el-form
          :model="roleForm"
          ref="roleFormRef"
          label-width="70px"
          class="demo-ruleForm"
        >


          <el-form-item label="Current Users：" prop="username" label-width="150px">
            <el-input v-model="roleForm.username" :disabled="roleForm.username == 'admin'"></el-input>
          </el-form-item>

          <el-form-item label="Current password" prop="password" label-width="150px">
            <el-input v-model="roleForm.password"></el-input>
          </el-form-item>

<!--         
          <el-form-item label="Current Users：" prop="role" label-width="120px">{{
            roleuser.username
          }}</el-form-item> -->

          <el-form-item label="Current Role：" prop="role" label-width="150px">{{
            roleuser.role
          }}</el-form-item>

          <el-form-item label="New Roles：" prop="role" label-width="150px">
            <!-- 分配新的角色： -->
            <el-select
              v-model="roleForm.role"
              placeholder="Select"
              size="large"
              :disabled="roleForm.username == 'admin'"
            >
              <el-option
                v-for="item in roles"
                :key="item.value"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="roleUser">Submit</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";
export default {
  name: "HomeView",
  data() {
    return {
      baseUrl: "http://172.16.10.7:8000/api",
      userInfo: null,
      isCollapse: true,
      // 添加对话框的显示或隐藏(设置为false 默认不显示)
      addDialogVisible: false,
      // 编辑用户对话框
      roleDialogVisible: false,
      // 用户列表
      userlist: [],
      // 角色信息
      roles: [],
      adminstatus:true,
      queryInfo: {
        // 当前页面
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
        query: "",
        rolename: "",
      },
      total: 0,
      // 添加用户
      addForm: {
        role: "",
        username: "",
        password: "",
        rolename: "",
        loginusername: "",
      },
      // 分配角色
      roleForm: {
        role: null,
        username:'',
        password:''
      },
      roleuser: {},

      // 添加用户的校验规则
      addFormRules: {
        username: [
          { required: true, message: "Please enter your username", trigger: "blur" },
        ],
        password: [{ required: true, message: "Please enter your password", trigger: "blur" }],
        role: [{ required: true, message: "Please select the role", trigger: "blur" }],
      },
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.queryInfo.rolename = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).rolename;
    this.addForm.rolename = this.userInfo.rolename;
    this.addForm.loginusername = this.userInfo.username;

    this.getUserList();
  },

  methods: {
    async getUserList() {
      let that = this;
      const { data: res } = await axios.get(that.baseUrl + "/user/login/", {
        params: that.queryInfo,
      });
      that.total = res.total;
      that.userlist = res.result;
      that.roles = res.roles;

      that.userInfo.rolename == "op"
        ? (that.addForm.role = res.roles[0])
        : (that.addForm.role = res.roles[1]);
    },

    // 监听页面大小（pagesize）改变的事件(每页显示多少条)
    handleSizeChange(pagesize) {
      // 改变pagesize的大小
      this.queryInfo.pagesize = pagesize;
      // 重新加载用户列表数据
      this.getUserList();
    },
    // 监听pagenum的事件(点击第几页)
    handleCurrentChange(pagenum) {
      // 把页码改了
      this.queryInfo.pagenum = pagenum;
      // 重新加载用户列表数据
      this.getUserList();
    },

    // 监听 switch开关状态的改变
    async userStateChange(userinfo) {
      let that = this;
      const { data: res } = await axios.put(
        that.baseUrl +
          "/user/login/?username=" +
          userinfo.username +
          "&status=" +
          userinfo.status
      );
      if (res.code != 0) {
        //更新失败时回父为原始数据 （实际上点击按钮时就会更新状态，所以此时需要取反，回到原始）
        userinfo.status = !userinfo.status;
        return that.$message.error(res.error);
      }

      that.$message.success(res.success);
    },
    // 添加用户关闭对话框重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 分配角色关闭对话框重置表单
    roleDialogClosed() {
      this.$refs.roleFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      // 判断校验是否成功  （取到表单对象） 点击等候先校验 valid校验成功返回true 这样不用每次点击登录就发请求校验
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        // 发送请求判断是否登录成功（用户信息在res.data中）
        const { data: res } = await axios.post(
          this.baseUrl + "/user/create/",
          this.addForm
        );
        if (res.code == 1) {
          return this.$message.error(res.error);
        }
        this.$message.success("Add new user successfully");
        this.addDialogVisible = false;
        // 将用户信息保存到sessionStorage中
        this.getUserList();
      });
    },
    //显示分配角色对话框
    async showRoleDialog(userInfo) {
      this.roleuser = userInfo;
      this.roleForm.username = userInfo.username;
      this.roleForm.password = userInfo.password;

      this.roleDialogVisible = true;
    },

    // 分配角色
    async roleUser() {
      // 判断是否选中了角色
      if (!this.roleForm.role) {
        return this.$message.error("Please select a role!");
      }
      const { data: res } = await axios.put(this.baseUrl + "/user/create/", {
        role: this.roleuser.role,
        newrole: this.roleForm.role,
        username: this.roleuser.username,
      });
      if (res.code == 1) {
        return this.$message.error(res.error);
      }
      this.$message.success(res.result);
      this.roleDialogVisible = false;
      // 将用户信息保存到sessionStorage中
      this.getUserList();
    },
    // 删除用户
    deleteUser(userinfo) {
      this.$confirm("Are you sure you want to delete this user?", "Tips", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await axios.delete(
            this.baseUrl + "/user/create/",
            {
              data: {
                username: userinfo.username,
              },
            }
          );

          if (res.code !== 0) {
            return this.$message.error("Failed to delete user");
          }
          this.getUserList();
          this.$message.success("Delete user successfully!");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Deleted",
          });
        });
    },
  },
};
</script>
<style>
.el-menu {
  border-width: 0;
}

.this-aside {
  height: 100vh;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.this-header {
  display: -ms-flexbox;
  display: flex;

  -ms-flex-pack: justify;
  justify-content: space-between;
}

.el-table {
  margin-top: 10px;
  font-size: 12px;
}
</style>