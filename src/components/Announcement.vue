<template>
  <div class="template">
    <header-nav></header-nav>
    <div class="contentDiv">
      <div class="contentTop">
        <div class="listSearch">
          <div class="containerTopDivBtn">
            <el-button type="primary" @click="showAdd">新增</el-button>
            <el-button type="success" @click="showEdit">编辑</el-button>
            <el-button type="danger"  @click="showDelete">删除</el-button>
          </div>
        </div>
      </div>
      <div class="contentBottom">
        <el-table class="tb-edit"
                  :data="tableData"
                  :header-cell-style="{background:'#A1D0FC',color:'rgba(0, 0, 0, 0.8)',fontSize:'14px'}"
                  border
                  @select-all="selectAll"
                  @select="selectList"
                  :cell-style="{fontSize:'12px'}"
                  :height="this.height"
                  highlight-current-row
                  style="width: 98%;margin: auto">
          <el-table-column
            type="selection"
            width="30">
          </el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="公告标题">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--新增弹出框 -->
    <el-dialog title="新增公告" :visible.sync="addVisible" :fullscreen="true" :center="true">
      <el-form ref="form"  label-width="40px">
        <el-form-item label="标题" style="margin-bottom: 10px">
          <el-input v-model="title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="content" type="textarea" :rows="20"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false" style="height:30px;width:80px">取 消</el-button>
                <el-button type="primary" @click="doAdd" style="height:30px;width:80px">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑公告" :visible.sync="editVisible" :fullscreen="true" :center="true">
      <el-form ref="form"  label-width="40px">
        <el-form-item label="标题" style="margin-bottom: 10px">
          <el-input v-model="title" ></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="content" type="textarea" :rows="20"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false" style="height:30px;width:80px">取 消</el-button>
                <el-button type="primary" @click="doSaveEdit" style="height:30px;width:80px">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="删除公告" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false" style="height:30px;width:80px">取 消</el-button>
                <el-button type="primary" @click="doDelete" style="height:30px;width:80px">确 定</el-button>
      </span>
    </el-dialog>

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
  import URL  from '../assets/js/URL'
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
        listData:[],
        id:"",


        tableData: [],



        height:Number,
        addVisible: false,
        editVisible: false,
        delVisible: false,

        title:"",
        content:"",
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
        axios.post(" "+ URL +"/node/getXFMessageList")
          .then((res) => {
            if (res.data.state === "1") {
              if (res.data.data.length > 0) {
                this.tableData = res.data.data
              }
              else {
                this.$message.warning("暂无数据");
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

      //选择那个一个
      selectList(val) {
        if (val.length) {
          let data = [];
          for (let i = 0; i < val.length; i++) {
            let a = val[i].id;
            data.push(a)
          }
          this.listData = data;
        }
        else {
          this.listData=[];
        }
      },

      //列表全部选择
      selectAll(val) {
        if (val.length) {
          let data = [];
          for (let i = 0; i < val.length; i++) {
            let a = val[i].id;
            data.push(a)
          }
          this.listData = data;
        }
        else {
          this.listData = [];
        }
      },

      //显示新增
      showAdd() {
        this.title = "";
        this.content = "";
        this.addVisible = "";
      },

      //进行新增
      doAdd() {
        if (this.title && this.content) {
          axios.post(" " + URL + "/node/addAnnouncement",
            {
              "title": this.title,
              "content": this.content,
            }
          )
            .then((res) => {
              if (res.data.state === "1") {
                this.$message.success(res.data.message);
                this.addVisible = false;
                this.loadingShowData()
              }
              else {
                this.$message.warning(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
        else {
          this.$message.warning("输入不能为空");
        }
      },

      //点击选择编辑
      showEdit() {
        if (this.listData.length) {
          if(this.listData.length>1){
            this.$message.warning("只能选择一个");
          }
          else {
            this.id = this.listData[0];
            axios.post(" " + URL + "/node/viewMessageContent", {"id": this.id})
              .then((res) => {
                if (JSON.stringify(res.data.data) !== "{}") {
                  this.editVisible=true;
                  this.title = res.data.data.title;
                  this.content = res.data.data.content;
                }
                else {
                  this.$message.warning("暂无数据");
                }
              })
              .catch((err) => {
                console.log(err)
              });
          }
        }
        else {
          this.$message.warning("请选择要编辑的公告");
        }
      },

      // 保存编辑
      doSaveEdit() {
        if (this.title && this.content) {
          axios.post(" " + URL + "/node/saveAnnouncement",
            {
              "id":this.id,
              "title": this.title,
              "content": this.content
            }
          )
            .then((res) => {
              if (res.data.state === "1") {
                this.editVisible = false;
                this.$message.success(res.data.message);
                this.loadingShowData();
              }
              else {
                this.$message.warning(`新增失败`);
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
        else {
          this.$message.warning(`输入不能为空`);
        }

      },

      //选择点击显示删除
      showDelete() {
        if (this.listData.length) {
          if (this.listData.length > 1) {
            this.$message.warning("只能选择一个");
          }
          else {
            this.delVisible = true;
          }
        }
        else {
          this.$message.warning("请勾选要删除的公告");
        }
      },

      //确定删除
      doDelete() {
        axios.post(" " + URL + "/node/delAnnouncement",
          {
            "id": this.listData[0],
          }
        )
          .then((res) => {
            if (res.data.state === "1") {
              this.$message.success(res.data.message);
              this.delVisible = false;
              this.loadingShowData();
            }
            else {
              this.$message.warning("删除失败");
            }
          })
          .catch((err) => {
            console.log(err)
          })
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
        .containerTopDivBtn{
          flex: 1;
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
