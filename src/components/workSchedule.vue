<template>
  <div class="template">
    <header-nav></header-nav>
    <div class="contentDiv">
      <div class="contentTop">
        <div class="listSearch">
          <div class="containerTopDivTime">
            <el-date-picker
              style="width: 100%"
              v-model="time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="查询日期">
            </el-date-picker>
          </div>
          <div class="containerTopDivBtn">
            <el-button type="success" @click="doSearch">查询</el-button>
          </div>
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
            label="白班">
            <el-table-column
              prop="dryMaterial"
              align="center"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="dayPersonnel"
              align="center"
              label="人员">
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="晚班">
            <el-table-column
              prop="classNight"
              align="center"
              label="班级">
            </el-table-column>
            <el-table-column
              prop="nightPersonnel"
              align="center"
              label="人员">
            </el-table-column>
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
  import realTimeUrl from '../assets/js/realTimeUrl'
  import headerNav from '../common/header'
  import footerNav from '../common/footer'
  import Loading from '../common/loading'
  import Modal from '../common/modal'
  import qs from 'qs'
  import {getNowTime} from '../assets/js/api'

  export default {
    name: 'ProductionExecution',
    data() {
      return {
        message: '',
        HideModal: true,

        img: "",

        tableData: [],

        time: "",

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
      loadingShowData(data) {
        axios.post("/node/getWorkScheduleList", ({ "time": data}))
          .then((res)=>{
            if(res.data.state==="1"){
              if(res.data.data.length>0){
                this.tableData=res.data.data
              }
              else {
                this.message = "暂无数据";
                this.HideModal = false;
                const that = this;
                function b() {
                  that.message = "";
                  that.HideModal = true;
                }
                setTimeout(b, 2000);
              }
            }
            else {
              this.message = res.data.message;
              this.HideModal = false;
              const that = this;
              function a() {
                that.message = "";
                that.HideModal = true;
              }
              setTimeout(a, 2000);
            }

          })
          .catch((err)=>{
            console.log(err)
          })
      },

      //页面加载检查用户是否登陆，没有登陆就加载登陆页面
      getAdminState() {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo === null) {
          this.$router.push("/UserLogin")
        }
        else {
          this.time = getNowTime();
          this.setTableHeight();
          this.loadingShowData(this.time)
        }
      },



      //进行查询
      doSearch() {
        if (this.time) {
          this.loadingShowData(this.time)
        }
        else {
          this.message = "查询时间不能为空";
          this.HideModal = false;
          const that = this;
          function a() {
            that.message = "";
            that.HideModal = true;
          }
          setTimeout(a, 2000);
        }
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
        .containerTopDivTime{
          flex: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .containerTopDivSelect{
          flex: 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .containerTopDivBtn{
          flex: 0.7;
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
          }
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
