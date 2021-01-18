<template>
  <div
    v-permission="['system:role:get']"
    class="app-container"
  >
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item
        label="角色名称：">
        <el-input v-model.trim="query.name" />
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
          v-if="!roleIds"
          v-permission="['system:role:post']"
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click="openAdd"
        >新增</el-button>
        <el-button
          v-if="roleIds"
          v-permission="['system:menu:get', 'system:user:role:get', 'system:user:role:post']"
          icon="el-icon-setting"
          type="success"
          @click="handleUserRole"
        >设置角色</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="dataTable"
      :data="list"
      stripe
      border
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="roleIds"
        align="center"
        reserve-selection
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="60"
      />
      <el-table-column
        align="center"
        prop="name"
        label="角色名称"
      />
      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      />
      <!--roleIds如果有值，则是用户管理组件传递过来了，则把操作列隐藏  -->
      <el-table-column v-if="!roleIds" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['system:role:put']"
            type="success"
            size="mini"
            @click="handleEdit(scope.row.id)"
          >编辑</el-button>
          <el-button
            v-permission="['system:role:delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
          <el-button
            v-permission="['system:menu:get', 'system:role:menu:get']"
            type="primary"
            size="mini"
            @click="handlePermission(scope.row.id)"
          >分配权限</el-button>
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
      :visible="edit.visible"
      :form-data="edit.formData"
      :remote-close="remoteClose"
    />
    <permission
      title="分配权限"
      :visible="per.visible"
      :remote-close="remotePerClose"
      :role-id="per.roleId"
    />
  </div>
</template>
<script>
import api from '@/api/role'

import Edit from './edit'
import Permission from './permission'
import { hasPermission } from '@/utils/auth'

export default {
  name: 'Role',
  components: { Edit, Permission },
  props: {
    roleIds: {
      type: Array,
      default: null
    }
  },
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
      per: {
        visible: false,
        roleId: null
      },
      checkedRoleList: []
    }
  },
  watch: {
    roleIds() {
      this.query = {}
      this.queryData()
    }
  },
  created() {
    const permission = ['system:role:get']
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
      this.chekedRoles()
    },
    chekedRoles() {
      this.$refs.dataTable.clearSelection()
      if (this.roleIds) {
        this.list.forEach((item) => {
          if (this.roleIds.indexOf(item.id) !== -1) {
            this.$refs.dataTable.toggleRowSelection(item, true)
          }
        })
      }
    },
    async handleEdit(id) {
      const { data } = await api.getById(id)
      this.edit.formData = data.role
      this.edit.title = '编辑'
      this.edit.visible = true
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
          this.fetchData()
        })
        .catch(() => {
        })
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
    openAdd() {
      this.edit.visible = true
      this.edit.title = '新增'
    },
    remoteClose() {
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    },
    handlePermission(id) {
      this.per.roleId = id
      this.per.visible = true
    },
    remotePerClose() {
      this.per.visible = false
      this.per.roleId = null
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.checkedRoleList = val
    },
    handleUserRole() {
      const checkedRoleIds = []
      this.checkedRoleList.forEach((item) => {
        checkedRoleIds.push(item.id)
      })
      this.$emit('saveUserRole', checkedRoleIds)
    }
  }
}
</script>
