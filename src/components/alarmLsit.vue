<template>
  <div class="template">
    <header-nav></header-nav>
    <div class="contentDiv">
      <div class="contentTop" ref="contentTop">
        报警一览表
      </div>
      <div class="contentBottom">
        <el-table class="tb-edit"
                  :data="tableData"
                  :header-cell-style="{background:'#A1D0FC',color:'rgba(0, 0, 0, 0.8)',fontSize:'18px'}"
                  :cell-style="{fontSize:'10px'}"
                  border
                  :height="this.height"
                  @row-click="doSeeCurve"
                  highlight-current-row
                  style="width: 99%;margin: auto">
          <el-table-column
            prop="dryMaterial"
            align="center"
            label="干物料">
          </el-table-column>
          <el-table-column
            prop="wetMaterial"
            align="center"
            label="湿物料">
          </el-table-column>
        </el-table>
      </div>
      <div v-bind:class="{hideModal:isHideCurve}">
        <div class="modal">
          <div class="container">
            <div class="containerTop" v-if="this.topShow==='1'">
              <div class="containerTopDiv">
                <el-button type="danger" @click="modalClose">关闭窗口</el-button>
              </div>
              <div class="containerTopDiv">
                <el-date-picker
                  style="width: 300px"
                  v-model="startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="开始时间">
                </el-date-picker>
              </div>
              <div class="containerTopDiv">
                <el-date-picker
                  style="width: 300px"
                  v-model="endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="结束时间">
                </el-date-picker>
              </div>
              <div class="containerTopDiv">
                <el-button type="primary" @click="doSearchData()">查询曲线</el-button>
              </div>
              <div class="containerTopDiv">
                <el-button type="success"  @click="addEcharts">放大曲线</el-button>
              </div>
              <div class="containerTopDiv">
                <el-button type="warning" @click="reduceEcharts">缩小曲线</el-button>
              </div>
            </div>
            <div class="containerTop2"  v-if="this.topShow==='2'">
              <div class="containerTopDiv2">
                <el-date-picker
                  style="width: 200px"
                  v-model="startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="开始时间">
                </el-date-picker>
              </div>
              <div class="containerTopDiv2">
                <el-date-picker
                  style="width: 200px"
                  v-model="endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="结束时间">
                </el-date-picker>
              </div>
              <div class="containerTopDiv2">
                <el-button type="primary" @click="doSearchData()">查询</el-button>
              </div>
              <div class="containerTopDiv2">
                <el-button type="danger" @click="modalClose">关闭</el-button>
              </div>
              <div class="containerTopDiv2">
                <el-button type="success"  @click="addEcharts">放大</el-button>
              </div>
              <div class="containerTopDiv2">
                <el-button type="warning" @click="reduceEcharts">缩小</el-button>
              </div>
            </div>
            <div class="containerBottom" id="panel">
              <div id="dataBar" :style="{width: '100%', height: '300px'}"></div>
            </div>
          </div>
        </div>
      </div>
      <Modal :msg="message"
             :isHideModal="HideModal"></Modal>
    </div>
    <div class="upTop" ref="upTop" @click="upToTop">
      <i class="iconfont icon-xiangshang1"></i>
    </div>
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
  import Curve from '../common/curve'
  import qs from 'qs'

  export default {
    name: 'ProductionExecution',
    data() {
      return {
        message: '',
        HideModal: true,
        isHideCurve: true,
        curveState :false,
        topShow:'1',
        height:Number,

        img: "",
        tag: "",

        select: "",
        selectOptions: [],

        tableData: [
          {
            "dryMaterial": "IT3001K1一次离心机电流",
            "wetMaterial": "TE1113/TE2113主反应器温度",
            "tag": "TT_2101",
          },
          {
            "dryMaterial": "FT1211干燥进料量",
            "wetMaterial": "FT1211干燥进料量",
            "tag": "TT_2101",
          },
          {
            "dryMaterial": "IT5005F1干燥器刀架电流",
            "wetMaterial": "AT1112/AT2112主反应器ORP显示",
            "tag": "TT_2101",
          },
          {
            "dryMaterial": "IT5002G1干燥器喂料器绞笼电流",
            "wetMaterial": "AIT1110A/AIT2110A主反应器PH显",
            "tag": "TT_2101",
          },
          {
            "dryMaterial": "IT6004G1压实机喂料器电流",
            "wetMaterial": "LT1114/LT2114主反应器液位",
            "tag": "TT_2101",
          },

          {
            "dryMaterial": "IT6004G2   压实机电流",
            "wetMaterial": "IT4004K1/IT4004K2 二次离心机电流",
            "tag": "TT_2101",
          },



          {
            "dryMaterial": "IT6005G1   造粒机电流",
            "wetMaterial": "",
            "tag": "TT_2101",
          },

          {
            "dryMaterial": "TE1516A/B/C  中间仓温度",
            "wetMaterial": "",
            "tag": "TT_2101",
          },


          {
            "dryMaterial": "TE1520A    中间仓下料温度",
            "wetMaterial": "",
            "tag": "TT_2101",
          },
          {
            "dryMaterial": "IT6006M1/M2 提升机进料绞笼电流",
            "wetMaterial": "",
            "tag": "TT_2101",
          },
          {
            "dryMaterial": "TE1613A/B/C/D/E/F 成品仓温度",
            "wetMaterial": "",
            "tag": "TT_2101",
          }
        ],
        cols: [
          {"prop": "dryMaterial", "label": "干物料"},
          {"prop": "wetMaterial", "label": "湿物料"}
          ],


        name: "",
        yMax: "",
        yMin: "",
        xData: [],
        yData: [],
        startTime: "",
        endTime: "",

        size:300,

      }

    },
    components: {Loading, footerNav, Modal, headerNav, Curve},
    mounted() {
      this.showUp();
      this.hp();
      this.setTableHeight();
    },
    computed: {
      style: function () {
        return "width:"+this.width+"px;height:"+this.height+"px"
      }
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
        let that = this;
        axios.all([
          axios.post(" " + realTimeUrl + "/api/showTableTitle.ashx", qs.stringify({"name": "realTime"})),
          axios.post(" " + realTimeUrl + "/api/showContextList.ashx", qs.stringify({"id": data}))
        ])
          .then(axios.spread(function (title, table) {
            that.cols = title.data;
            that.tableData = table.data;
          }));
      },

      //监控横屏
      hp() {
        const that = this;
        window.addEventListener('orientationchange', function () {
          if (that.curveState === true) {
            if(window.orientation===90){
              that.topShow="2";
              that.$nextTick(() => {
                let myChart = that.$echarts.init(document.getElementById('dataBar'));
                myChart.resize();
                // 绘制图表
                myChart.setOption({
                  title: {
                    text: this.name,
                    subtext: '实时显示'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: []
                  },
                  grid: {
                    x: 50,
                    borderWidth: 1,
                    x2: 10,
                    y2: 30
                  },

                  toolbox: {
                    show: true,
                    feature: {
                      mark: {show: true},
                      magicType: {show: true, type: ['line', 'bar']},
                      restore: {show: true},
                    }
                  },
                  calculable: true,
                  xAxis: [
                    {
                      type: 'category',
                      boundaryGap: false,
                      data: that.xData
                    }
                  ],
                  yAxis: [
                    {
                      max: that.yMax,
                      min: that.yMin,
                      type: 'value'
                    }
                  ],
                  series: [
                    {
                      name: '当前时间段数据',
                      type: 'line',
                      smooth: true,
                      data: that.yData
                    }
                  ]
                });
                window.addEventListener("resize",()=>{
                  myChart.resize();
                });
              })
            }
            if(window.orientation===0){
              that.topShow="1";
              that.$nextTick(() => {
                let myChart = that.$echarts.init(document.getElementById('dataBar'));
                myChart.resize();
                // 绘制图表
                myChart.setOption({
                  title: {
                    text: this.name,
                    subtext: '实时显示'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: []
                  },
                  grid: {
                    x: 50,
                    borderWidth: 1,
                    x2: 10,
                    y2: 30
                  },

                  toolbox: {
                    show: true,
                    feature: {
                      mark: {show: true},
                      magicType: {show: true, type: ['line', 'bar']},
                      restore: {show: true},
                    }
                  },
                  calculable: true,
                  xAxis: [
                    {
                      type: 'category',
                      boundaryGap: false,
                      data: that.xData
                    }
                  ],
                  yAxis: [
                    {
                      max: that.yMax,
                      min: that.yMin,
                      type: 'value'
                    }
                  ],
                  series: [
                    {
                      name: '当前时间段数据',
                      type: 'line',
                      smooth: true,
                      data: that.yData
                    }
                  ]
                });
                window.addEventListener("resize",()=>{
                  myChart.resize();
                });
              })
            }
            if(window.orientation===-90){
              that.topShow="2";
              that.$nextTick(() => {
                let myChart = that.$echarts.init(document.getElementById('dataBar'));
                myChart.resize();
                // 绘制图表
                myChart.setOption({
                  title: {
                    text: this.name,
                    subtext: '实时显示'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: []
                  },
                  grid: {
                    x: 50,
                    borderWidth: 1,
                    x2: 10,
                    y2: 30
                  },

                  toolbox: {
                    show: true,
                    feature: {
                      mark: {show: true},
                      magicType: {show: true, type: ['line', 'bar']},
                      restore: {show: true},
                    }
                  },
                  calculable: true,
                  xAxis: [
                    {
                      type: 'category',
                      boundaryGap: false,
                      data: that.xData
                    }
                  ],
                  yAxis: [
                    {
                      max: that.yMax,
                      min: that.yMin,
                      type: 'value'
                    }
                  ],
                  series: [
                    {
                      name: '当前时间段数据',
                      type: 'line',
                      smooth: true,
                      data: that.yData
                    }
                  ]
                });
                window.addEventListener("resize",()=>{
                  myChart.resize();
                });
              })
            }

          }
        });
      },

      //页面加载检查用户是否登陆，没有登陆就加载登陆页面
      getAdminState() {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo === null) {
          this.$router.push("/UserLogin")
        }
        else {

        }
      },


      //关闭曲线页面
      modalClose() {
        this.isHideCurve = true;
        this.curveState = false;
        this.xData = [];
        this.yData = [];
      },

      //查看曲线
      doSeeCurve(row, column, event) {
        this.tag = row.tag;
        if (this.tag) {
          axios.post(" " + realTimeUrl + "/api/getNowRealTimeCure.ashx", qs.stringify({
            "tag": this.tag
          }))
            .then((res) => {
              this.startTime = "";
              this.endTime = "";
              this.xData = res.data.xData;
              this.yData = res.data.yData;
              this.name = res.data.name;
              this.yMax = res.data.Max;
              this.yMin = res.data.Min;
              this.isHideCurve = false;
              this.curveState =true;

              this.drawLine();
            })
            .catch((err) => {

              console.log(err)
            });
        }
        else {
          this.message = "该数据没有找出测点";
          this.HideModal = false;
          const that = this;

          function a() {
            that.message = "";
            that.HideModal = true;
          }

          setTimeout(a, 2000);
        }
      },


      //根据数据进行曲线查询
      doSearchData() {
        if (this.startTime && this.endTime) {
          axios.post(" " + realTimeUrl + "/api/getRealTimeCure.ashx", qs.stringify({
            "tag": this.tag,
            "startTime": this.startTime,
            "endTime": this.endTime
          }))
            .then((res) => {
              this.xData = res.data.xData;
              this.yData = res.data.yData;
              this.name = res.data.name;
              this.yMax = res.data.Max;
              this.yMin = res.data.Min;
              this.drawLine();
            })
            .catch((err) => {
              console.log(err)
            });
        }
        else {
          this.$message({
            message: '时间不能为空',
            center: true,
            type: 'warning'
          });
        }
      },

      //放大趋势图
      addEcharts(){
        if(this.size<2000){
          this.size=this.size+50;}
        else{
          this.size=2000;
        }
      },
      //缩小趋势图
      reduceEcharts(){
        if(this.size>300){
          this.size=this.size-50;}
        else{
          this.size=300;
        }

      },


      //显示向上按钮
      showUp() {
        let height = this.$refs.contentTop.offsetHeight;
        let upTop = this.$refs.upTop;
        window.addEventListener('scroll', () => {
          let top = window.scrollY;
          if (top >= height) {
            upTop.style.display = "block"
          }
          else if (top < height) {
            upTop.style.display = "none"
          }
        });

      },

      //点击向上
      upToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },


      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        this.$nextTick(() => {
          let myChart = this.$echarts.init(document.getElementById('dataBar'));
          // 绘制图表
          myChart.setOption({
            title: {
              text: this.name,
              subtext: '实时显示'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: []
            },
            grid: {
              x: 50,
              borderWidth: 1,
              x2: 10,
              y2: 30
            },

            toolbox: {
              show: true,
              feature: {
                mark: {show: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
              }
            },
            calculable: true,
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: this.xData
              }
            ],
            yAxis: [
              {
                max: this.yMax,
                min: this.yMin,
                type: 'value'
              }
            ],
            series: [
              {
                name: '当前时间段数据',
                type: 'line',
                smooth: true,
                data: this.yData
              }
            ]
          });
          this.$watch("size",function(newVal, oldVal){
            var dom=document.getElementById('panel');
            dom.innerHTML='<div id="dataBar" style="width:'+newVal+'px;height:'+newVal+'px"></div>';
            let myChart = this.$echarts.init(document.getElementById('dataBar'));
            myChart.setOption({
              title: {
                text: this.name,
                subtext: '实时显示'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: []
              },
              grid: {
                x: 50,
                borderWidth: 1,
                x2: 10,
                y2: 30
              },

              toolbox: {
                show: true,
                feature: {
                  mark: {show: true},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                }
              },
              calculable: true,
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  data: this.xData
                }
              ],
              yAxis: [
                {
                  max: this.yMax,
                  min: this.yMin,
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '当前时间段数据',
                  type: 'line',
                  smooth: true,
                  data: this.yData
                }
              ]
            });
          })
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
      height: 30px;
      width: 100%;
      background-color: #D8E5F6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    .contentBottom {
      margin-bottom: 80px;
    }
    .modal {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 999;
      width: 100%;
      height: 100%;
      background-color: @color-background-dd;
      display: flex;
      align-items: center;
      justify-content: center;
      .container {
        width: 98%;
        height: 98%;
        overflow: auto;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: @color-white;
        border-radius: 10px;
        .containerTop {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .containerTopDiv {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 2%;
            .el-button {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 200px;
              height: 35px;
              margin-right: 10%;
              margin-left: 10%;
            }
          }
        }
        .containerTop2 {
          display: flex;
          align-items: center;
          justify-content: center;
          .containerTopDiv2 {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 1%;
            margin-left: 1%;
            .el-button {
              display: flex;
              align-items: center;
              justify-content: center;
              width:40px;
              height: 35px;
              margin-right: 5%;
              margin-left: 5%;
            }
          }
        }
        .containerBottom {
        }
      }
    }

    .hideModal {
      display: none;
    }

  }

  .upTop {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
    display: none;
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 999999;
    background-color: @color-background-d;
    cursor: pointer;
    color: @color-white;
    i {
      font-size: @font-size-large-xxx;
    }

  }

  .container {
    width: 100%;
    height: 100%;

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

