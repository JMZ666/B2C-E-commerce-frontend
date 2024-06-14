<!--登录页面-->
<template>
  <div class="login">
    <div class="left-effect">
      <div class="main">
        <div class="box" id="box1">B2C-E-</div>
        <div class="box" id="box2">commerce</div>
      </div>
    </div>
    <el-form class="form" :model="model" :rules="rules" ref="loginForm">
      <img class="logo" src="~@/assets/logo.svg" />
      <h2 class="heading">ADMIN PANEL</h2>
      <el-form-item prop="userName">
        <el-input
          class="input"
          v-model="model.userName"
          prefix-icon="User"
          clearable
          :placeholder="$t('login.username')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="input"
          v-model="model.password"
          prefix-icon="Lock"
          show-password
          clearable
          :placeholder="$t('login.password')"
        />
      </el-form-item>
      <el-form-item prop="captcha">
          <div class="captcha">
              <el-input
                        class="input"
                        v-model="model.captcha"
                        prefix-icon="Picture"
                        placeholder="请输入验证码"
                        ></el-input>
              <img :src="captchaSrc" @click="refreshCaptcha" />
          </div>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="btn"
          size="large"
          @click="submit"
        >
          {{ btnText }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="change-lang">
    <change-lang />
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
  onMounted,
  watch,
} from 'vue'
import { Login , GetValidateCode } from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
import ChangeLang from '@/layout/components/Topbar/ChangeLang.vue'
import useLang from '@/i18n/useLang'
import { useApp } from '@/pinia/modules/app'

export default defineComponent({
  components: { ChangeLang },
  name: 'login',
  setup() {
    const { proxy: ctx } = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    const { lang } = useLang()
    watch(lang, () => {
      state.rules = getRules()
    })
    const getRules = () => ({
      userName: [
        {
          required: true,
          message: ctx.$t('login.rules-username'),
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: ctx.$t('login.rules-password'),
          trigger: 'blur',
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t('login.rules-regpassword'),
          trigger: 'blur',
        },
      ],
      captcha: [
        {
            required: true,
            message: ctx.$t('login.rules-validate-code'),
            trigger: 'blur',
        },
      ],
    })

    onMounted(() => {
      state.refreshCaptcha()
    })

    const state = reactive({
      model: {
        userName: 'admin',
        password: '111111',
        captcha: '',
        codeKey: ''
      },
      rules: getRules(),
      loading: false,
      captchaSrc: "" ,
      refreshCaptcha: async () => {
          const { data } = await GetValidateCode() ;
          state.model.codeKey = data.codeKey
          state.captchaSrc = data.codeValue
      },
      btnText: computed(() =>
        state.loading ? ctx.$t('login.logining') : ctx.$t('login.login')
      ),
      loginForm: ref(null),
      submit: () => {
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          if (valid) {
            state.loading = true
            const { code, data, message } = await Login(state.model)
            if (+code === 200) {
              ctx.$message.success({
                message: ctx.$t('login.loginsuccess'),
                duration: 1000,
              })

              const targetPath = decodeURIComponent(route.query.redirect)
              if (targetPath.startsWith('http')) {
                window.location.href = targetPath
              } else if (targetPath.startsWith('/')) {
                router.push(targetPath)
              } else {
                router.push('/')
              }
              useApp().initToken(data)
            } else {
              ctx.$message.error(message)
            }
            state.loading = false
          }
        })
      },
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  background: white;
  padding-left: 2em; /* 左侧间距 */
  padding-right: 2em; /* 右侧间距 */
}

.left-effect {
  width: 60%; /* 调整宽度 */
  height: 100%;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  animation: slideIn 2s ease-in-out;
  padding-right: 2em; /* 表单和动效之间的间距 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.main {
  display: inline-flex;
}

.box {
  margin-top: 50px;
  font-size: 5em;
  padding: 20px;
  color: white;
  font-weight: 800;
  animation: aniload 3s;
}

#box1::after {
  content: "B2C-E-";
  display: flex;
  transform: rotateX(180deg);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, .0) 10%, rgba(255, 255, 255, .5));
  -webkit-background-clip: text;
  color: transparent;
}

#box2 {
  color: rgb(37, 116, 236);
}

#box2::after {
  content: "commerce";
  display: flex;
  transform: rotateX(180deg);
  background-image: linear-gradient(180deg, rgba(37, 116, 236, .0) 10%, rgba(37, 116, 236, .5));
  -webkit-background-clip: text;
  color: transparent;
}

@keyframes aniload {
  from {
    transform: translate(-1000px, 0px)
  }
  to {
    transform: translate(0px, 0px)
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: white;
  padding: 2.5em;
  border-radius: 25px;
  transition: .4s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.4) 1px 2px 2px;
  max-width: 400px;
  width: 100%;
  &:hover {
    transform: translateX(-0.5em) translateY(-0.5em);
    border: 1px solid #171717;
    box-shadow: 10px 10px 0px #666666;
  }
}

.logo {
  place-self: center;
  max-width: 150px;
  max-height: 150px;
}

.heading {
  color: black;
  padding-bottom: 2em;
  text-align: center;
  font-weight: bold;
}

.input {
  border-radius: 5px !important;
  border: 1px solid whitesmoke;
  background-color: whitesmoke;
  outline: none;
  padding: 0.7em;
  transition: .4s ease-in-out;
  &:hover {
    box-shadow: 6px 6px 0px #969696,
                -3px -3px 10px #ffffff;
  }
  &:focus {
    background: #ffffff;
    box-shadow: inset 2px 5px 10px rgba(0,0,0,0.3);
  }
}

.btn {
  background-color: whitesmoke;
  margin-top: 2em;
  align-self: center;
  padding: 0.7em;
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 10px;
  border: none;
  color: black;
  transition: .4s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.4) 1px 1px 1px;
  &:hover {
    box-shadow: 6px 6px 0px #969696,
               -3px -3px 10px #ffffff;
    transform: translateX(-0.5em) translateY(-0.5em);
  }
  &:active {
    transition: .2s;
    transform: translateX(0em) translateY(0em);
    box-shadow: none;
  }
}

.captcha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.captcha img {
  cursor: pointer;
  margin-left: 20px;
}

.change-lang {
  position: fixed;
  right: 20px;
  top: 20px;
  :deep {
    .change-lang {
      height: 24px;
      &:hover {
        background: none;
      }
      .icon {
        color: #fff;
      }
    }
  }
}
</style>
