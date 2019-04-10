<template>
  <div class="login">
    <header class="login-title" >
      <h1>{{loginTitle}}</h1>
    </header>
    <div class="loginIndex">
      <div class="loginIndex-content">
        <div class="loginIndex-title">
          用户登录
        </div>
        <div class="loginIndex-username">
          <i class="iconfont icon-solid-person"></i>
          <input
            @blur="userNameBlur(username)"
            @focus="userNameFocus(username)"
            v-model="username"
            type="text"
            placeholder="请输入用户名"/>
          <div class="userErrText">
            <span>{{userNameErrText}}</span>
          </div>
        </div>
        <div class="loginIndex-password">
          <i class="iconfont icon-mima"></i>
          <input
            @blur="passwordBlur(password)"
            @focus="passwordFocus(password)"
            v-model="password"
            type="password"
            placeholder="请输入密码"/>
          <div class="passwordText">
            <span>{{ passwordErrText}}</span>
          </div>
        </div>
        <div class="loginIndex-login">
          <div class="" style="width:100%;display: flex;align-items: center;justify-content: center;flex-direction: column">
            <button @click="login">登录</button>
            <span style="margin-top: 10px;color: #d93f30;font-size: 20px" @click="goToRegister">用户注册</span>
          </div>
        </div>
      </div>
    </div>
    <footer class="">{{loginFooter}}</footer>
    <Modal :msg="message"
           :isHideModal="HideModal"></Modal>

  </div>

</template>

<script type="text/ecmascript-6">
  import url from '../../assets/js/URL'
  import axios from 'axios'
  import Modal from '../../common/modal'
  import realTimeUrl from '../../assets/js/realTimeUrl'

  import qs from 'qs'

  export default {
    name: 'indexLogin',
    data() {
      return {
        loginTitle:"PI实时数据分析系统",
        loginFooter:" Copyright ©2019 湖北兴发化工集团股份有限公司",



        username: '',
        password: '',
        userNameErrText: '',
        passwordErrText: '',
        userNameState: false,
        passwordState: false,
        message: '',
        HideModal: true
      }
    },
    components: {Modal},
    created() {
      this.getLoginMessage()

    },
    mounted() {
    },
    methods: {
      getLoginMessage() {
        let loginMessage =localStorage.getItem('loginMessage');
        if(loginMessage===null){

        }
        else {
          let loginData = JSON.parse(loginMessage);
          this.username =loginData.username;
          this.password =loginData.password;
          this.userNameState =true;
          this.passwordState = true
        }


      },
      //用户名框移开焦点监测
      userNameBlur(username) {
        if (username.length === 0) {
          this.userNameErrText = "用户名不能为空";
        }
        else {
          this.userNameErrText = "";
          this.userNameState = true;
        }
      },
      //用户名框获得焦点监测
      userNameFocus(username) {
        if (username.length === 0) {
          this.userNameErrText = "请填写用户名";
        }
      },
      //密码框移开焦点监测
      passwordBlur(password) {
        if (password.length === 0) {
          this.passwordErrText = "密码不能为空";
        }
        else {
          this.passwordErrText = "";
          this.passwordState = true
        }
      },
      //密码获得焦点监测
      passwordFocus(password) {
        if (password.length === 0) {
          this.passwordErrText = "请填写密码";
        }
      },

      //前往注册页面
      goToRegister(){
        this.$router.push("/UserRegister");
      },

      //进行登陆
      login() {
        if (this.userNameState === true && this.passwordState === true) {
          axios.post(" " + realTimeUrl + "/api/userLogin.ashx",qs.stringify(
            {
              "username": this.username,
              "password": this.password
            }
          ))
            .then((res) => {
              if (res.data.state === "1") {
                let LoginMessage = {
                  "username": this.username,
                  "password": this.password
                };
                let loginMessage = JSON.stringify(LoginMessage);
                localStorage.setItem('loginMessage', loginMessage);
                let userInfo = res.data;
                userInfo = JSON.stringify(userInfo);
                localStorage.setItem("userInfo", userInfo);
                this.message = "登录成功";


                this.HideModal = false;
                const that = this;
                function a() {
                  that.message = "";
                  that.HideModal = true;
                  localStorage.setItem("IndexUrl", 0);
                  that.$router.push({path: "/"})
                }
                setTimeout(a, 2000);

              }
              else if (res.data === "-1") {
                this.message = "密码错误";
                this.HideModal = false;
                const that = this;

                function c() {
                  that.message = "";
                  that.HideModal = true;
                  that.password = '';
                }

                setTimeout(c, 2000);
              }
              else if (res.data == "2") {
                this.message = "该用户没有注册";
                this.HideModal = false;
                const that = this;

                function b() {
                  that.message = "";
                  that.HideModal = true;
                  that.username = '';
                  that.password = '';
                }

                setTimeout(b, 2000);
              }
              else {
                this.message = "登录失败";
                this.HideModal = false;
                const that = this;

                function d() {
                  that.message = "";
                  that.HideModal = true;
                  that.username = '';
                  that.password = '';
                }

                setTimeout(d, 2000);
              }
            })
            .catch((err) => {
              console.log(err)
            });
        }
        else {
          this.message = "请正确填写信息";
          this.HideModal = false;
          const that = this;

          function a() {
            that.message = "";
            that.HideModal = true;
          }

          setTimeout(a, 2000);
        }
      }
    },
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "../../assets/less/base";

  .login {
    width: 100%;
    height: 100%;
    background: url("../../assets/img/bg.jpg") center center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    header {
      text-align: center;
      margin-bottom: 30px;
      h1 {
        font-size: @font-size-large-xxxxxx;
        color: @color-white;
      }

    }
    .loginIndex {
      width: 400px;
      height: 380px;
      border-radius: 20px;
      background-color: #E7EBEE;
      position: relative;
      .loginIndex-title{
        height: 60px;
        background-color: #409EFF;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @color-white;
        font-size: @font-size-large;
        border-top-left-radius: 19px;
        border-top-right-radius:19px;
      }
      .loginIndex-username {
        width: 90%;
        margin: 40px auto 0 auto;
        height: 50px;
        background-color: @color-white;
        padding-left: 2%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: @font-size-medium-x;
        position: relative;
        border-radius: 10px;
        input {
          width: 80%;
          height: 50px;
          padding-left: 20px;
          background-color: @color-white;
        }
      }
      .loginIndex-password {
        width: 90%;
        margin: 40px auto 0 auto;;
        height: 50px;
        background-color: @color-white;
        border-radius: 10px;
        padding-left: 2%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        input {
          width: 80%;
          height: 50px;
          padding-left: 20px;
          font-size: @font-size-medium-x;
          background-color: @color-white;
        }
      }
      .loginIndex-login {
        width: 90%;
        margin: 40px auto 0 auto;;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        button {
          background-color:#409EFF;
          border: 0;
          width: 100%;
          height: 50px;
          color: #ffffff;
          font-size: @font-size-large;
          border-radius: 10px;
        }
      }
      .userErrText {
        position: absolute;
        bottom: -22px;
        left: 0;
        width: 100%;
        height: 20px;
        color: #d93f30;
        line-height: 20px;
        padding-left: 20px;
      }
      .passwordText {
        position: absolute;
        bottom: -22px;
        left: 0;
        width: 100%;
        height: 20px;
        color: #d93f30;
        line-height: 20px;
        padding-left: 20px;
      }
    }
    footer {
      text-align: center;
      margin-top: 20px;
      font-size: @font-size-large-x;
      color: @color-white;
    }

  }

  @media only screen and (max-width: 400px) {
    .login {
      .login-title {
        h1 {
          font-size: @font-size-large-xx;
        }

      }
      .loginIndex {
        width: 300px;
        .loginIndex-top {
          left: 42%;
        }
      }
      footer {
        font-size: @font-size-small;
      }
    }

  }

</style>
