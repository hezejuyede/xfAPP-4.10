<template>
  <div class="index">
    <header>
      <div class="headerTitle">
        <div class="headerTitleLogo">
          <img src="../assets/img/xf.png" alt="">
        </div>
        <div class="headerTitleText">
          <div class="headerTitleTextTop">湖北兴发化工集团股份有限公司</div>
          <div class="headerTitleTextBottom">PI实时数据分析系统</div>
        </div>
      </div>
    </header>
    <main>
      <div id="banner">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item,index) in bannerImg" :key="item.id">
            <img :src="item.img"
                 style="width: 100%"
                 @click="showBanner(index,item.id,item.sindex)">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-scrollbar" slot="scrollbar"></div>
        </swiper>
      </div>
      <div class="yc-headline" ref="headerline">
        <div ref="headerlineD" class="yc-headline-box">
          <div class="yc-headline-div" v-for="(item,index) in headerLines" @click="lookNotice(item.id)">
            <span>公告:</span>
            <span class="yc-headline-firsta" >
              {{item.title}}
            </span>
          </div>
        </div>
      </div>
      <div class="navigation clearfix" ref="navigation">
        <div class="IconTemplate" v-if="amdInfo==='2'" v-for="(item , index) in admIconData" @click="goToPage(index,item.url)">
          <i :class=" item.icon"></i>
          <span>{{item.text}}</span>
        </div>
        <div class="IconTemplate" v-if="amdInfo==='1'" v-for="(item , index) in iconData" @click="goToPage(index,item.url)">
          <i :class=" item.icon"></i>
          <span>{{item.text}}</span>
        </div>
      </div>
    </main>
    <!--公告详情 -->
    <el-dialog :visible.sync="sbVisible" width="80%" :fullscreen="true" :center="true">
      <div class="equipmentDiv">
        <div class="closeBtn">
          <el-button type="danger" @click="sbVisible = false">关闭窗口</el-button>
        </div>
        <div class="equipmentDivContent">
          <div style="width:100%;height:50px;display: flex;align-items: center;justify-content: center">
            {{titilename}}
          </div>
          <div style="width:100%;height: 350px;overflow: auto;">
            <quill-editor ref="myTextEditor" v-model="htmlData" :options="editorOption" height="530" :disabled="true"></quill-editor>
          </div>
        </div>
      </div>
    </el-dialog>

    <footer-view></footer-view>
    <div class="loading-container" v-show="!img.length">
      <loading></loading>
    </div>

  </div>
</template>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import FooterView from '../common/footer';
  import {swiper, swiperSlide} from 'vue-awesome-swiper';
  import Loading from '../common/loading';
  import URL  from '../assets/js/URL'

  require('swiper/dist/css/swiper.css');
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import { quillEditor } from 'vue-quill-editor';
  export default {
    name: 'index',
    data() {
      return {
        img: '',
        amdInfo:"1",
        iconData: [
          {"icon": "iconfont icon-1jituan", "text": "兴发集团", "url": "https://www.xingfagroup.com"},
          {"icon": "iconfont icon-zu", "text": "片碱报表", "url": "/ReportForm"},
          {"icon": "iconfont icon-gaoduanhuagong", "text": "漂粉精一线报表", "url": "/ReportForm"},
          {"icon": "iconfont icon-jichuhuagong", "text": "漂粉精二线报表", "url": "/ReportForm"},
          {"icon": "iconfont icon-huaxue", "text": "片碱实时", "url": "/RealTimeData"},
          {"icon": "iconfont icon-huaxue1", "text": "漂粉精一线实时", "url": "/RealTimeData"},
          {"icon": "iconfont icon-huaxueyongpin", "text": "漂粉精二线实时", "url": "/RealTimeData"}
        ],
        admIconData: [
          {"icon": "iconfont icon-1jituan", "text": "兴发集团", "url": "https://www.xingfagroup.com"},
          {"icon": "iconfont icon-zu", "text": "片碱报表", "url": "/ReportForm"},
          {"icon": "iconfont icon-gaoduanhuagong", "text": "漂粉精一线报表", "url": "/ReportForm"},
          {"icon": "iconfont icon-jichuhuagong", "text": "漂粉精二线报表", "url": "/ReportForm"},
          {"icon": "iconfont icon-huaxue", "text": "片碱实时", "url": "/RealTimeData"},
          {"icon": "iconfont icon-huaxue1", "text": "漂粉精一线实时", "url": "/RealTimeData"},
          {"icon": "iconfont icon-huaxueyongpin", "text": "漂粉精二线实时", "url": "/RealTimeData"},
          {"icon": "iconfont icon-gonggao", "text": "发布公告", "url": "/Announcement"},
          /*{"icon": "iconfont icon-renyuan", "text": "编辑班次", "url": "/editorialShift"}*/
        ],
        bannerImg: [
          {"img": require("../assets/img/1.jpg")},
          {"img": require("../assets/img/2.jpg")},
          {"img": require("../assets/img/3.jpg")}
        ],
        headerLines:[],
        htmlData:'',
        titilename:"",
        editorOption: {
          placeholder: '',
          modules: {
            toolbar: '',
          },
        },
        sbVisible:false,
        swiperOption: {
          direction: "horizontal",
          loop: true,
          pagination: ".swiper-pagination",
          prevButton: ".swiper-button-prev",
          nextButton: ".swiper-button-next",
          autoplay: 3000,
          autoplayDisableOnInteraction: false,
        }
      }
    },
    components: {FooterView, swiper, swiperSlide, Loading,quillEditor},
    mounted() {
      this.changeHeaderLine();
    },
    created() {
      this.getAdminState();
      setTimeout(() => {
        this.getLoading();
      }, 1000);
    },
    methods: {
      //页面加载检查用户是否登陆，没有登陆就加载登陆页面
      getAdminState() {
        localStorage.setItem("IndexUrl", 0);
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo === null) {
          this.$router.push("/UserLogin")
        }
        else {
          let Info = JSON.parse(userInfo);
          let username = Info.username;
          if(username==="11"){
            this.amdInfo="2"
          }
          else {
            this.amdInfo="1"
          }
          this.getMessageList();


        }
      },

      //获取公共列表
      getMessageList() {
        axios.post(" "+ URL +"/node/getXFMessageList")
          .then((res) => {
            if (res.data.state === "1") {
              if (res.data.data.length > 0) {
                this.headerLines = res.data.data
              }
              else {
                this.$message.warning(res.data.message);
              }
            }
            else {
              this.$message.warning(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err)
          });
      },

      //公告自动跳转
      changeHeaderLine() {
        let headerLine = this.$refs.headerlineD;
        let a = 0;
        setInterval(() => {
          a++;
          if (a === this.headerLines.length) {
            a = 0
          }
          let l = -20 * a;
          headerLine.style.top = l + "px";
        }, 3000)

      },

      //图片加载
      getLoading() {
        this.img = ["1"]
      },


      //查看公告
      lookNotice(id){
        if (id) {
          axios.post(" "+ URL +"/node/viewMessageContent",{"id":id})
            .then((res) => {
              if(res.data.state==="1"){
                if(JSON.stringify(res.data.data) !== "{}"){
                  this.sbVisible = true;
                  this.titilename = res.data.data.title;
                  this.htmlData = res.data.data.content;
                }
                else {
                  this.$message.warning( "暂无数据");
                }
              }
              else {
                this.$message.warning(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err)
            });
        }
        else {
          this.$message.warning("查不到数据");
        }
      },

      //前往页面
      goToPage(index,url){
        if(index===0){
          window.location.href = url;
        }
        else if (index===1){
          localStorage.setItem("IndexUrl", 2);
          this.$router.push({
            path:url,
            query:{
              id:1
            }
          })
        }
        else if(index===2){
          localStorage.setItem("IndexUrl", 2);
          this.$router.push({
            path:url,
            query:{
              id:2
            }
          })
        }
        else if(index===3){
          localStorage.setItem("IndexUrl", 2);
          this.$router.push({
            path:url,
            query:{
              id:3
            }
          })
        }
        else if(index===4){
          localStorage.setItem("IndexUrl", 1);
          this.$router.push({
            path:url,
            query:{
              id:1
            }
          })
        }
        else if(index===5){
          localStorage.setItem("IndexUrl", 1);
          this.$router.push({
            path:url,
            query:{
              id:2
            }
          })
        }
        else if(index===6){
          localStorage.setItem("IndexUrl", 1);
          this.$router.push({
            path:url,
            query:{
              id:3
            }
          })
        }
        else {
          localStorage.setItem("IndexUrl", index+1);
          this.$router.push(url)
        }
      }
    }
  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "../assets/less/base";

  .index {
    width: 100%;
    height: 100%;
    header{
      height: 80px;
      background-color: @color-white;
      .headerTitle{
        display: flex;
        align-items: center;
        justify-content: center;
        .headerTitleLogo{
          img{
            height:80px;
          }
        }
        .headerTitleText{
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .headerTitleTextTop{
            font-size: @font-size-medium-x;
            margin-bottom: 5px;
            color: #25201E;
          }
          .headerTitleTextBottom{
            font-size: @font-size-medium;
            color: #25201E;
          }

        }

      }
    }
    .yc-headline {
      width: 95%;
      margin: 10px auto 10px auto;
      height: 20px;
      position: relative;
      overflow: hidden;
      .yc-headline-box {
        width: 100%;
        position: relative;
        top: 0;
        left: 0;
        .yc-headline-div {
          height: 20px;
          overflow: hidden;
          span {
            font-size: @font-size-medium;
            color: @color-red;
          }
        }
      }
    }

    .equipmentDiv {
      width: 100%;
      height: 500px;
      .closeBtn {
        width: 100%;
        height: 15%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: -10px;
        left: 0;
        z-index: 999;
        .el-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30%;
          height: 50px;
        }
      }
      .equipmentDivTitle {
        height: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .equipmentDivContent {
        height: 400px;
        display: flex;
        align-items: center;
        flex-direction: column;
        overflow: auto;
      }
      .equipmentDivBtn {
        height: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40%;
          height: 80px;
          margin-right: 10%;
          margin-left: 10%;
          font-size: @font-size-large-xxxxxx;
        }
      }
    }
    .navigation{
      margin-bottom: 70px;
      .IconTemplate {
        float: left;
        width: 30%;
        height: 40%;
        margin-bottom:2%;
        margin-left: 3%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        padding-top: 2%;
        padding-bottom: 2%;
        .icon-1jituan {
          display: block;
          background-color: @color-bg-lv;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        .icon-zu {
          display: block;
          background-color: @color-bg-lan;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        .icon-gaoduanhuagong {
          display: block;
          background-color: @color-bg-cs;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        .icon-jichuhuagong {
          display: block;
          background-color: #409EFF;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        .icon-huaxue {
          display: block;
          background-color: #67C23A;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        .icon-huaxue1 {
          display: block;
          background-color:@color-red;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        .icon-huaxueyongpin {
          display: block;
          background-color:@color-bg-cs;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        .icon-gonggao{
          display: block;
          background-color:@color-bg-anLv;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        .icon-renyuan{
          display: block;
          background-color:@color-background;
          color: @color-white;
          border-radius: 20%;
          width: 70px;
          height:70px;
          line-height: 70px;
          font-size: 350%;
          text-align: center;
        }
        span {
          margin-top: 5%;
          color: #909399;
          font-size: 13px;
        }
      }
    }

  }

  .loading-container {
    position: absolute;
    max-width: 640px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }


</style>
