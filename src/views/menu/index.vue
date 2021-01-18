<template>
  <div
    v-permission="['system:menu:get']"
    class="app-container"
  >
    <!-- 条件查询 -->
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button
          v-permission="['system:menu:post']"
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click="handleAdd(0)"
        >新增目录</el-button>
      </el-form-item>
    </el-form>
    <!-- row-key="id" 指定唯一标识的属性名，其中数据要包含children才会被渲染为树状 -->
    <el-table row-key="id" :data="list" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="60" />
      <el-table-column align="center" prop="name" label="名称" />
      <el-table-column align="center" prop="url" label="前端路由" >
        <template slot-scope="scope">
          <!-- 1目录，2菜单，3按钮 -->
          <p v-if="scope.row.type === 3">--</p>
          <p v-else>{{ scope.row.url }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="code" label="权限标识" width="200px">
        <template slot-scope="scope">
          <p v-if="scope.row.type !== 3">--</p>
          <p v-else>{{ scope.row.code }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type === 1" type="primary" size="mini">目录</el-button>
          <el-button v-if="scope.row.type === 2" type="success" size="mini">菜单</el-button>
          <el-button v-if="scope.row.type === 3" type="info" size="mini">按钮</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="icon" label="图标">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 3">--</p>
          <i v-else :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 3">--</p>
          <p v-else>{{ scope.row.sort }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button
            v-permission="['system:menu:post']"
            type="primary"
            size="mini"
            @click="handleAdd(scope.row.id)"
          >新增</el-button>
          <el-button
            v-permission="['system:menu:put']"
            type="success"
            size="mini"
            @click="handleEdit(scope.row.id)"
          >编辑</el-button>
          <el-button
            v-permission="['system:menu:delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增或者编辑组件 -->
    <edit
      :title="edit.title"
      :visible="edit.visible"
      :form-data="edit.formData"
      :remote-close="remoteClose"
    />
  </div>
</template>
<script>
import api from '@/api/menu'

import Edit from './edit'
import { hasPermission } from '@/utils/auth'

export default {
  name: 'Menu', // 和对应路由表中配置的name值一致
  components: { Edit },
  data() {
    return {
      list: [], // 列表数据
      query: {}, // 查询条件
      edit: {
        title: '',
        visible: false,
        formData: {}
      }
    }
  },

  created() {
    const permission = ['system:menu:get']
    if (!hasPermission(permission)) {
      return
    }
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await api.getList(this.query)
      this.list = data.records
    },
    handleAdd(id) {
      this.edit.formData.parentId = id
      this.edit.title = '新增'
      this.edit.visible = true
    },
    remoteClose() {
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    },
    handleEdit(id) {
      api.getById(id).then((response) => {
        if (response.code === 20000) {
          this.edit.formData = response.data.menu
          this.edit.title = '编辑'
          this.edit.visible = true
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除当前节点与子节点记录吗?', '提示', {
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
    reload() {
      this.query = {}
      this.fetchData()
    }
  }
}
</script>
