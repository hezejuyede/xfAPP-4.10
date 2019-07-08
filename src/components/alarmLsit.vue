<template>
  <div class="template">
    <header-nav></header-nav>
    <div class="contentDiv">
      <div class="contentTop">
        <div class="listSearch">
          <el-button type="primary" @click="doSearch">查询</el-button>
        </div>
      </div>
      <div class="contentBottom">
        <el-table class="tb-edit"
                  :data="tableData"
                  :header-cell-style="{background:'#A1D0FC',color:'rgba(0, 0, 0, 0.8)',fontSize:'14px'}"
                  border
                  :cell-style="{fontSize:'12px'}"
                  :height="this.height"
                  highlight-current-row
                  style="width: 98%;margin: auto">
          <el-table-column
            align="center"
            fixed
            width="130"
            prop="tagName"
            label="测点名">
          </el-table-column>
          <el-table-column
            align="center"
            width="150"
            prop="chineseTagName"
            label="中文测点名">
          </el-table-column>
          <el-table-column
            align="center"
            prop="realTimeValue"
            label="实时值">
          </el-table-column>
          <el-table-column
            align="center"
            prop="upperLimitValue"
            label="上限值">
          </el-table-column>
          <el-table-column
            align="center"
            prop="lowerLimitValue"
            label="下限值">
          </el-table-column>
          <el-table-column
            align="center"
            prop="currentState"
            label="当前状态">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <Modal :msg="message"
           :isHideModal="HideModal"></Modal>
    <div class="loading-container" v-show="!img">
      <loading></loading>
    </div>
    <footer-nav></footer-nav>
  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import otherUrl from '../assets/js/otherUrl'
  import headerNav from '../common/header'
  import footerNav from '../common/footer'
  import Loading from '../common/loading'
  import Modal from '../common/modal'


  export default {
    name: 'ProductionExecution',
    data() {
      return {
        message: '',
        HideModal: true,
        img: "",
        tableData: [],
        height:Number
      }

    },
    components: {Loading, footerNav, Modal, headerNav},
    mounted() {


    },
    computed: {

    },
    created() {
      //检索用户状态
      this.getAdminState();

      //让旋转图片旋转一秒钟
      setTimeout(() => {
        this.getLoading();
      }, 1000);


    },
    methods: {
      //旋转的图片
      getLoading() {
        this.img = ["1"]
      },

      //根据屏幕设置Table高度
      setTableHeight(){
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          var H = window.screen.height;
          this.height = H - 230;
        }
        else {
          var h = document.body.clientHeight;
          this.height = h - 230;
        }

      },


      //改变数据瞬间显示数据
      loadingShowData() {
        axios.post(" " + otherUrl + "/Station/showTableData")
          .then((res) => {
            if (res.data.code === 1) {
              if (res.data.data.length > 0) {
                this.tableData = res.data.data;
              }
              else {
                this.$message.warning("暂无数据");
              }
            }
            else {
              this.$message.warning(res.data.msg);
            }
          })
          .catch((err) => {
            console.log(err)
          });
      },

      //页面加载检查用户是否登陆，没有登陆就加载登陆页面
      getAdminState() {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo === null) {
          this.$router.push("/UserLogin")
        }
        else {
          this.setTableHeight();
          this.loadingShowData();
        }
      },

      //进行查询
      doSearch() {
        this.loadingShowData()
      },

    }
  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "../assets/less/base";

  .template {
    margin-bottom: 80px;
    .contentTop {
      width: 100%;
      background-color: #D8E5F6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      .listSearch {
        width: 95%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 95%;
          height: 35px;
          margin-left: 2%;
          font-size: @font-size-large-xx;
        }
      }
    }
    .contentBottom {

    }

  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  @media only screen and (max-width: 900px) {

  }


</style>
