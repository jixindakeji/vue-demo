<template>
  <div
    v-permission="['system:audit:get']"
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
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column align="center" type="index" label="序号" width="60" />
      <el-table-column align="center" prop="user" label="用户名" width="120" />
      <el-table-column align="center" prop="ip" label="IP" width="120" />
      <el-table-column align="center" prop="method" label="请求方法" width="100" />
      <el-table-column align="center" prop="path" label="请求路径" width="200" />
      <el-table-column align="center" prop="body" label="请求体" />
      <el-table-column align="center" prop="status" label="响应状态" width="100"  />
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
  </div>
</template>

<script>
import { getAudit } from '@/api/audit'
import { hasPermission } from '@/utils/auth'

export default {
  name: 'Audit',
  data() {
    return {
      list: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      query: {}
    }
  },
  created() {
    const permission = ['system:audit:get']
    if (!hasPermission(permission)) {
      return
    }
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await getAudit(
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
    }
  }
}
</script>
