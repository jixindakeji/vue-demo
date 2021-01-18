<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="formData"
      :rules="rules"
      :model="formData"
      label-width="100px"
      label-position="right"
      style="width: 400px"
      status-icon
    >
      <el-form-item label="类型：" prop="type">
        <el-radio-group v-model="formData.type">
          <template v-if="formData.id !== undefined">
            <el-radio :label="1" disabled>目录</el-radio>
            <el-radio :label="2" disabled>菜单</el-radio>
            <el-radio v-if="formData.parentId !== 0" :label="3" disabled>按钮</el-radio>
          </template>
          <template v-else>
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio v-if="formData.parentId !== 0" :label="3">按钮</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item v-if="formData.type === 3" label="权限标识：" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item v-if="formData.type !== 3" label="前端路由：" prop="url">
        <el-input v-model="formData.url" />
      </el-form-item>
      <el-form-item v-if="formData.type !== 3" label="图标：" prop="icon">
        <el-input v-model="formData.icon" />
      </el-form-item>
      <el-form-item v-if="formData.type !== 3" label="排序：" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :min="1"
          :max="10000"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="formData.remark" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button
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
import api from '@/api/menu'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },

    // eslint-disable-next-line vue/require-default-prop
    remoteClose: Function // 用于关闭窗口
  },

  data() {
    return {
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入前端路由', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    handleClose() {
      this.$refs['formData'].resetFields()
      this.remoteClose()
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过，提交表单数据
          // 判断类型是否为按钮，按钮则不提交：请求地址，图标，将两个属性设置为null
          if (this.formData.type === 3) {
            this.formData.url = ''
            this.formData.icon = ''
          }
          this.submitData()
        } else {
          return false
        }
      })
    },

    async submitData() {
      let response = null
      console.log(this.formData)
      if (this.formData.id) {
        response = await api.update(this.formData)
      } else {
        response = await api.add(this.formData)
      }

      if (response.code === 20000) {
        this.$message({ message: '保存成功', type: 'success' })
        this.handleClose()
      } else {
        this.$message({ message: '保存失败', type: 'error' })
      }
    }
  }
}
</script>
