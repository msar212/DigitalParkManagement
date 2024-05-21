<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login_btn"
            @click="submitForm('form')"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { FORMDATA_KEY } from '@/constants/KEY'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      remember: true,
      rules: {
        username: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('校验成功！')
          this.$store.dispatch('doLogin', this.form)
          // remeber逻辑
          if (this.remember) {
            localStorage.setItem(FORMDATA_KEY, JSON.stringify(this.form))
          } else {
            localStorage.removeItem(FORMDATA_KEY)
          }
          this.form = {
            username: '',
            password: ''
          }
          this.$router.push('/')
        } else {
          console.log('校验失败！')
          return false
        }
      })
    }
  },
  created () {
    const userString = localStorage.getItem(FORMDATA_KEY)
    if (!userString) return
    const { username, password } = JSON.parse(userString)
    this.form.username = username
    this.form.password = password
  }
}
</script>

<style scoped lang="scss">
.login_body {
  display: flex;
}
.bg {
  width: 60vw;
  height: 100vh;
  background: url('~@/assets/login-bg.svg') no-repeat;
  background-position: right top;
  background-size: cover;
}
.box {
  margin: 200px 10% 0;
  flex: 1;
  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }
  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }
    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }
    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}
.login_btn {
  width: 100%;
}
</style>
