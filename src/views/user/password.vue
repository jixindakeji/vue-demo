<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="380px"
    :before-close="handleClose"
  >
    <el-form
      ref="formData"
      :rules="rules"
      :model="formData"
      label-width="100px"
      label-position="right"
      style="width: 300px"
      status-icon
    >
      <el-form-item label="新密码：" prop="newPassword">
        <el-input
          v-model="formData.newPassword"
          type="password"
          placeholder="请输入新密码"
          maxlength="40"
        />
      </el-form-item>
      <el-form-item label="确认密码：" prop="repPassword">
        <el-input
          v-model="formData.repPassword"
          type="password"
          placeholder="请输入确认密码"
          maxlength="40"
        />
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
import * as api from '@/api/user'

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
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
    const validateRepPassword = (rule, value, callback) => {
      if (value !== this.formData.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 40 个字符', trigger: 'blur' }
        ],
        repPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validateRepPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.password = this.formData.newPassword
          api.update(this.formData).then((response) => {
            if (response.code === 20000) {
              this.$message({ message: '修改密码成功', type: 'success' })
              this.handleClose()
            } else {
              this.$message({ message: response.message, type: 'error' })
            }
          })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$refs['formData'].resetFields()
      this.remoteClose()
    }
  }
}
</script>
