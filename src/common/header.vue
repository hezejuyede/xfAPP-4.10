<template>
    <div class="headerCommon clearfix">
      <div class="header-left fl">
        <div class="collapse-btn fl">
          <i class="el-icon-menu"></i>
        </div>
        <div class="logo fl">{{headerTitle}}</div>
      </div>
      <div class="header-right fl" >
        <div class="headerOut fr" @click="LeavePost">
          <i class="iconfont icon-ligang"></i>
          <span>退出</span>
        </div>
        <div class="headerUserInfo fr">
          <div class="">
            <span class="">用户名</span>
            <span class="">:</span>
            <span class="">{{userName}}</span>
          </div>
        </div>
        <div class="headerAvatar fr">
          <img src="../assets/img/avatar.jpg" alt="">
        </div>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import url from '../assets/js/URL'
  import realTimeUrl from '../assets/js/realTimeUrl'
  import qs from 'qs'
  export default {
    name: 'headerCommon',
    data() {
      return {
        headerTitle:"PI实时数据分析系统",
        userName: "",
      }
    },
    components: {},
    mounted() {


    },
    created() {
      this.getAdminState();

    },
    methods: {
      //页面加载检查用户是否登陆，没有登陆就加载登陆页面
      getAdminState() {
        const userInfo = localStorage.getItem("userInfo");
        const info = JSON.parse(userInfo);
        if (info === null) {
          this.$router.push("/userLogin")
        }
        else {
          this.userName = info.username;
        }
      },
      //离开岗位
      LeavePost() {
        this.$confirm('是否确认离开退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            axios.post("  " + realTimeUrl + "/api/LeavePost.ashx", qs.stringify({"username": this.userName}))
              .then((res) => {
                if (res.data === "1") {
                  this.$message({
                    type: 'success',
                    message: '退出成功!'
                  });
                  setTimeout(() => {
                    localStorage.setItem("IndexUrl", 0);
                    localStorage.removeItem("userInfo");
                    this.$router.push("/userLogin");
                  }, 3000);
                }
                else {
                  this.$message({
                    type: 'warning',
                    message: '退出失败!'
                  });
                }
              })
              .catch(() => {
                console.log(err)
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出'
            });
          });
      },

    },

  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "../assets/less/base";

  .headerCommon {
    width: 100%;
    box-sizing: border-box;
    background-color: #66B1FF;
    .header-left {
      width: 45%;
      height: 70px;
      line-height: 70px;
      padding-left: 5%;
      font-size: @font-size-large-xx;
      color: @color-white;
    }
    .header-right {
      width: 50%;
      height: 70px;
      color: @color-white;
      .headerAvatar {
        width: 10%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        img {
          height: 50px;
          border-radius: 50%;
        }
      }
      .headerUserInfo {
        width: 15%;
        height: 70px;
        display: flex;
        align-items: start;
        justify-content: center;
        flex-direction: column;
        padding-left: 1%;

      }
      .headerOut {
        width: 20%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: start;
        cursor: pointer;

      }

    }

  }

  @media only screen and (max-width: 1250px) {
    .headerCommon {

      .header-right {

        .headerUserInfo {
          width:20%;

        }
        .headerOut {
          width: 20%;

        }

      }

    }

  }

  @media only screen and (max-width: 1150px) {
    .headerCommon {
      .header-left {
        font-size: @font-size-large;

      }
      .header-right {
        .headerAvatar {
          width: 20%;
        }
        .headerUserInfo {
          width: 25%;

        }
        .headerOut {
          width: 20%;

        }

      }

    }

  }
  @media only screen and (max-width: 700px) {
    .headerCommon {
      .header-left {
        font-size: @font-size-medium-x;

      }
      .header-right {
        .headerAvatar {
          width: 30%;
        }
        .headerUserInfo {
          width: 40%;

        }
        .headerOut {
          width: 20%;
          font-size: @font-size-small-ss;
        }

      }

    }

  }
  @media only screen and (max-width:540px) {
    .headerCommon {
      .header-left {
        font-size: @font-size-small;

      }
      .header-right {
        .headerUserInfo {
          width: 50%;
          font-size: @font-size-small-s;

        }

      }


    }

  }
  @media only screen and (max-width:410px) {
    .headerCommon {
      .header-left {
        font-size: @font-size-small-s

      }
      .header-right {
        .headerAvatar {
         img{
           height: 40px;
         }
        }
        .headerUserInfo {
          width: 50%;


        }


      }


    }

  }
</style>
