<template>
  <div class="pos-login">
    <template v-if="signInView">
      <div class="title" style="margin-bottom: 41px">Welcome Back</div>
      <div class="sub-title">New to Online Ordering?
        <a class="ref" @click="showSignUpView">Sign Up</a>
      </div>
      <div class="pos-login__input">
        <g-text-field-bs label="Email" style="margin-bottom: 23px"
                 v-model="email" ref="email"/>
        <g-text-field-bs password label="Password" style="margin-bottom: 14px"
                 v-model="password"
                 @enterpressed="signIn"/>
        <div v-if="signInMessage" class="message message-sign-in">{{signInMessage}}</div>
        <div class="remember-forgot" style="margin-bottom: 36px">
          <g-checkbox label="Remember me" v-model="rememberSignIn"/>
        </div>
        <g-btn class="login-btn" @click="signIn">Log In</g-btn>
      </div>
    </template>
    <template v-else-if="signUpView">
      <div class="title" style="margin-bottom: 25px">Create Your Account</div>
      <div class="sub-title" style="margin-bottom: 41px">Already have Online Ordering account?
        <a class="ref" @click="showSignInView">Sign In</a></div>
      <div class="pos-login__input">
        <g-text-field-bs label="Email" style="margin-bottom: 23px" v-model="email"/>
        <g-text-field-bs password label="Password" style="margin-bottom: 24px" v-model="password"/>
        <g-text-field-bs password label="Type your password again" style="margin-bottom: 29px" v-model="retypePassword"/>
        <div v-if="signUpMessage" class="message message-sign-up">{{signUpMessage}}</div>
        <g-btn primary class="login-btn" @click="signUp">Sign Up</g-btn>
      </div>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash'

  export default {
    name: 'PosLogin',
    injectService: ['PosStore:(login,createUser)'],
    props: {},
    data: function () {
      return {
        view: 'sign-in',
        email: '',
        password: '',
        retypePassword: '',
        rememberSignIn: false,
        errorMessage: '',
        signInMessage: '',
        signUpMessage: '',
        waitingSendResetPasswordResponse: false
      }
    },
    computed: {
      signInView() {
        return this.view === 'sign-in'
      },
      signUpView() {
        return this.view === 'sign-up'
      }
    },
    methods: {
      showSignInView() {
        this.view = 'sign-in'
        this.errorMessage = ''
      },
      showSignUpView() {
        this.view = 'sign-up'
        this.errorMessage = ''
      },
      showForgotPassword() {
        this.view = 'reset-password'
        this.errorMessage = ''
      },
      signIn() {
        this.signInMessage = ''
        if(_.trim(this.email) === '')
          return
        this.login(this.email, this.password)
      },
      async signUp() {
        if (this.password === this.retypePassword) {
          this.signUpMessage = '';
          await this.createUser(this.email, this.password);
        } else {
          this.signUpMessage = 'Password and Retype password are mismatch!';
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.email.$refs.input.focus()
      })
    }
  }
</script>
<style scoped lang="scss">
  .pos-login {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: url('/plugins/pos-plugin/assets/samples/login-bg.png');
    background-size: cover;

    &__input {
      width: 409px;
      margin-bottom: 14px;
    }
  }

  .title {
    font-family: Muli, sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 56px;
  }

  .sub-title {
    font-family: Muli, sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    margin-bottom: 65px;
  }

  .ref {
    color: #536DFE;
    cursor: pointer;
  }

  .remember-forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .login-btn {
    width: 100%;
  }

  .message {
    color: red;
    font-size: 14px;
    line-height: 18px;
    text-transform: capitalize;
    font-style: italic;
    position: relative;
    left: 4px;

    &-sign-in {
      top: -8px;
    }

    &-sign-up {
      top: -12px;
    }

    &-reset-pwd {
      height: 1em;
      margin-top: 5px;
      margin-bottom: 15px;
    }
  }
</style>
