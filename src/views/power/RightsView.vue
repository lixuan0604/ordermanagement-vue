
<template>
  <!-- 面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图-->
  <el-card>
    <!-- 添加按钮-->
    <el-row>
      <el-col :span="1">
        <el-button type="primary" @click="addDialogVisible = true"
          >添加角色</el-button
        >
      </el-col>
    </el-row>
    <!--角色列表-->
    <el-table :data="rolesList" border stripe>
      <!--展开列-->
      <el-table-column type="expand" label="明细">
        <template #default="scope">
          <!-- 渲染一级菜单-->
          <el-row v-for="(item1, level1) in scope.row" :key="level1">
            <el-col :span="5">{{ item1.name }}</el-col>
            <el-col :span="19"></el-col>
          </el-row>
          {{ scope.row }}
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column label="角色名称" prop="name"> </el-table-column>
      <el-table-column label="角色描述" prop="desc"> </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="showEditDialog(scope.row.id)"
          >
            <template #icon>
              <el-icon><EditPen /></el-icon>
            </template>
            编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="removeRoleById(scope.row.id)"
            >删除</el-button
          >
          <el-button
            size="small"
            type="warning"
            icon="el-icon-setting"
            @click="showRightDialog(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 添加角色对话框-->
  <el-dialog
    title="添加角色"
    v-model="addDialogVisible"
    width="40%"
    @close="addRoleClosed"
  >
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="80px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRole">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 编辑角色对话框-->
  <el-dialog
    title="编辑角色"
    v-model="editDialogVisible"
    width="50%"
    @close="editRoleClosed"
  >
    <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="80px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRole">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 分配权限对话框-->
  <el-dialog
    title="分配权限"
    v-model="rightDialogVisible"
    width="50%"
    @close="rightDialogClosed"
  >
    <el-tree
      ref="treeRef"
      :data="rightList"
      :props="treeProps"
      node-key="id"
      show-checkbox
      default-expand-all
      :default-checked-keys="defaultkeys"
    ></el-tree>
    <span class="dialog-footer">
      <el-button @click="rightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      baseUrl: "http://172.16.10.7:8000/api",
      // 后端获取角色列表
      rolesList: [],
      permissionList: [],

      // 控制角色对话框显示和隐藏
      addDialogVisible: false,
      rightList: [],
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      // 分配权限
      rightDialogVisible: false,
      // 默认选中节点的id值数组
      defaultkeys: [],
      // 树形组件属性绑定对象
      treeProps: {
        // 显示的标签
        label: "authName",
        // 子一级
        children: "children",
      },
      // 当前分配权限的角色ID
      roleId: "",

      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 编辑角色对话框
      editDialogVisible: false,
      editForm: {
        roleName: "",
        roleDesc: "",
      },
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
    // this.getPermissionList()
  },
  methods: {
    // 对话框的表单重置
    addRoleClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听编辑角色对话框的关闭时间
    editRoleClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //显示编辑角色的对话框
    async showEditDialog(id) {
      // const {data:res} = await this.$http.get(`roles/${id}`)
      // if(res.meta.status !== 200){
      //     return this.$message.error('查询角色信息失败')
      // }
      // this.editForm = res.data
      this.editDialogVisible = true;
    },

    //获取角色列表
    async getRolesList() {
      const { data: res } = await axios.get(this.baseUrl + "/user/roles/");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
    },
    //  //获取一级权限列表
    // async getPermissionList() {
    //   const { data: res } = await axios.get(this.baseUrl + "/user/permission/");
    //   if (res.status !== 200) {
    //     return this.$message.error("获取权限列表失败！");
    //   }
    //   console.log(res)
    //   this.rightList = res.data;
    // },

    // 监听分配权限对话框的关闭事件
    rightDialogClosed() {
      this.defaultkeys = [];
    },
    // 分配权限
    async allotRights() {
      //  获取全选的                                      半选的
      const keys = this.$refs.treeRef
        .getCheckedKeys()
        .concat(this.$refs.treeRef.getHalfCheckedKeys());
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.rightDialogVisible = false;
      this.getRolesList();
      this.$message.success("分配权限成功!");
    },
    // 显示分配权限对话框
    async showRightDialog(role) {
      // 获取所有权限列表
      const { data: res } = await axios.get(this.baseUrl + "/user/permission/");
      if (res.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightList = res.data;
      this.rightDialogVisible = true;

      // 获取角色下所有三级权限
      this.getLeafKeys(role);
    },

    // 获取角色下所有三级权限的id
    getLeafKeys(node) {
      // 判断是三级权限
      if (!node.children) {
        return this.defaultkeys.push(node.id);
      }
      // 如果不是三级权限则递归操作
      node.children.forEach((item) => {
        this.getLeafKeys(item);
      });
    },
  },
};
</script>