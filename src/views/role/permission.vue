<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formData" v-loading="loading" label-width="80px">
      <!--
        :data 绑定的渲染数据，数组
        show-checkbox 显示勾选框
        node-key 树节点的唯一标识属性名
        props 配置响应数据中对应展示的属性名 children 是子菜单的属性名，label显示的菜单名属性名
        :default-checked-keys 默认勾选的集合
        accordion 每次只能展开一个，会将之前展开把它隐藏
      -->
      <el-tree
        ref="tree"
        :data="menuList"
        show-checkbox
        node-key="id"
        :props="{ children: 'children', label: 'name' }"
        accordion
        :default-checked-keys="menuIds"
      />
      <el-form-item>
        <el-button
          v-permission="['system:role:menu:post']"
          type="primary"
          size="mini"
          @click="submitForm('formData')"
        >确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import menuApi from '@/api/menu'
import roleApi from '@/api/role'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    roleId: {
      type: Number,
      default: null
    },
    // eslint-disable-next-line vue/require-default-prop
    remoteClose: Function
  },
  data() {
    return {
      menuList: [],
      loading: false,
      menuIds: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getMenuList()
      }
    }
  },
  methods: {
    getMenuList() {
      this.loading = true
      menuApi.getList({}).then((response) => {
        this.menuList = response.data.records
        this.getMenuIdsByRoleId()
      })
      this.loading = false
    },
    async getMenuIdsByRoleId() {
      const { data } = await roleApi.getMenuIdsByRoleId(this.roleId)
      this.menuIds = data.records
    },
    submitForm(formName) {
      const checkedMenuIds = this.$refs.tree.getCheckedKeys()
      const data = { ids: checkedMenuIds }
      roleApi.saveRoleMenu(this.roleId, data).then((response) => {
        if (response.code === 20000) {
          this.$message({ message: '分配权限成功', type: 'success' })
          this.handleClose()
        } else {
          this.$message({ message: '分配权限失败', type: 'error' })
        }
      })
    },
    handleClose() {
      this.menuList = []
      this.menuIds = []
      this.remoteClose()
    }
  }
}
</script>
