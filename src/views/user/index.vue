<template>
  <div
    v-permission="['system:user:get']"
    class="app-container"
  >
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item
        label="用户名:"
      >
        <el-input v-model.trim="query.username" />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="queryData"
        >查询</el-button>
        <el-button
          icon="el-icon-refresh"
          @click="reload"
        >重置</el-button>
        <el-button
          v-permission="['system:user:post']"
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click="openAdd"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column align="center" type="index" label="序号" width="60" />
      <el-table-column align="center" prop="username" label="用户名" />
      <el-table-column align="center" prop="displayName" label="昵称" />
      <el-table-column align="center" prop="phone" label="手机号" />
      <el-table-column align="center" prop="email" label="邮箱" />
      <el-table-column align="center" prop="status" label="帐号锁定">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="primary">管理员</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status === 3" type="danger">锁定</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="330">
        <template slot-scope="scope">
          <el-button
            v-permission="['system:user:put']"
            type="success"
            size="mini"
            @click="handleEdit(scope.row.id)"
          >编辑</el-button>
          <el-button
            v-permission="['system:user:delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
          <el-button
            v-permission="['system:user:role:get', 'system:role:get']"
            type="primary"
            size="mini"
            @click="handleRole(scope.row.id)"
          >设置角色</el-button>
          <el-button
            v-permission="['system:user:put']"
            type="primary"
            size="mini"
            @click="handlePwd(scope.row.id)"
          >密码修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.current"
      :page-sizes="[10, 20, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <edit
      :title="edit.title"
      :form-data="edit.formData"
      :visible="edit.visible"
      :remote-close="remoteClose"
    />
    <el-dialog title="设置角色" :visible.sync="role.visible" width="65%">
      <Role :role-ids="role.roleIds" @saveUserRole="saveUserRole" />
    </el-dialog>
    <Password
      title="修改密码"
      :form-data="pwd.formData"
      :visible="pwd.visible"
      :remote-close="remotePwdClose"
    />
  </div>
</template>

<script>
import * as api from '@/api/user'
import { hasPermission } from '@/utils/auth'
import Edit from './edit'
import Role from '../role'
import Password from './password'

export default {
  name: 'User',
  components: { Edit, Role, Password },
  data() {
    return {
      list: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      query: {},
      edit: {
        title: '',
        visible: false,
        formData: {}
      },
      role: {
        visible: false,
        roleIds: [],
        userId: null // 点击哪个用户，就是哪个用户id,当保存用户角色时，需要使用
      },
      pwd: {
        formData: {},
        title: '',
        visible: false
      }
    }
  },
  created() {
    const permission = ['system:user:get']
    if (!hasPermission(permission)) {
      return
    }
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await api.getList(
        this.query,
        this.page.current,
        this.page.size
      )
      this.list = data.records
      this.page.total = data.total
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchData()
    },
    queryData() {
      this.page.current = 1
      this.fetchData()
    },
    reload() {
      this.query = {}
      this.fetchData()
    },
    handleEdit(id) {
      api.getById(id).then((response) => {
        if (response.code === 20000) {
          this.edit.formData = response.data.user
          this.edit.title = '编辑'
          this.edit.visible = true
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteById(id).then((response) => {
            this.$message({
              type: response.code === 20000 ? 'success' : 'error',
              message: '删除成功!'
            })
            this.fetchData()
          })
        })
        .catch(() => {
        })
    },
    handleRole(id) {
      this.role.userId = id
      api.getRoleIdsByUserId(id).then((response) => {
        this.role.roleIds = response.data.records
        this.role.visible = true
      })
    },
    openAdd() {
      this.edit.title = '新增——默认密码与用户名一致'
      this.edit.visible = true
    },
    remoteClose() {
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    },
    saveUserRole(roleIds) {
      const data = { ids: roleIds }
      api.saveUserRole(this.role.userId, data).then((response) => {
        if (response.code === 20000) {
          this.$message({ message: '分配角色成功', type: 'success' })
          this.role.visible = false
        } else {
          this.$message({ message: '分配角色失败', type: 'error' })
        }
      })
    },
    remotePwdClose() {
      this.pwd.userId = null
      this.pwd.visible = false
      this.fetchData()
    },
    handlePwd(id) {
      api.getById(id).then((response) => {
        if (response.code === 20000) {
          this.pwd.formData = response.data.user
          this.pwd.visible = true
          console.log(this.pwd)
        }
      })
    }
  }
}
</script>
