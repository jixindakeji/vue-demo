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
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="formData.username" :disabled="typeof(formData.id) !== 'undefined' && formData.id !== 0" maxlength="30" />
      </el-form-item>
      <el-form-item label="昵称：" prop="displayName">
        <el-input v-model="formData.displayName" maxlength="50" />
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="formData.phone" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="formData.email" maxlength="30" />
      </el-form-item>
      <el-form-item label="帐号锁定：" prop="status">
        <!-- (1 未锁定，0已锁定) -->
        <el-radio-group v-model="formData.status">
          <el-radio :label="2" border>未锁定</el-radio>
          <el-radio :label="3" border>已锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="formData.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size=""
        @click="submitForm('formData')"
      >确定</el-button>
      <el-button size="" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as api from '@/api/user'

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
    remoteClose: Function
  },

  data() {
    return {
      rules: {
        username: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        displayName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          return false
        }
      })
    },
    async submitData() {
      let response = null
      if (this.formData.id) {
        response = await api.update(this.formData)
      } else {
        this.formData.password = this.formData.username
        response = await api.add(this.formData)
      }
      // eslint-disable-next-line no-constant-condition
      if ((response.code = 20000)) {
        this.$message({ message: '保存成功', type: 'success' })
        this.handleClose()
      } else {
        this.$message({ message: '保存失败', type: 'error' })
      }
    },
    handleClose() {
      this.$refs['formData'].resetFields()
      this.remoteClose()
    }
  }
}
</script>
