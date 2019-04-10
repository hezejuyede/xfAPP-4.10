<template>
  <div v-bind:class="{hideModal:isHideCurve}">
    <div class="modal">
      <div class="container">
        <div class="containerTop">
          <div class="containerTopDiv">
            <el-button type="danger" @click="closeModal">关闭窗口</el-button>
          </div>
          <div class="containerTopDiv">
            <el-date-picker
              style="width: 300px"
              v-model="startTime"
              type="datetime"
              value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="开始时间">
            </el-date-picker>
          </div>
          <div class="containerTopDiv">
            <el-date-picker
              style="width: 300px"
              v-model="endTime"
              type="datetime"
              value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="结束时间">
            </el-date-picker>
          </div>
          <div class="containerTopDiv">
            <el-button type="primary" @click="doSearchCurve()">查询曲线</el-button>
          </div>
        </div>
        <div class="containerBottom">
          <div id="dataBar" :style="{width: '100%', height: '300px'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'modal',
    data() {
      return {
        startTime: "",
        endTime:""
      }
    },
    mounted() {
      this.drawLine();
    },
    created() {

    },
    watch: {
      pieData() {
        this.$nextTick(() => {
          if (this.pieData) {
            this.init()
          }
        })
      }
    },
    methods: {
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
              data: ['当前时间段数据']
            },
            grid: {
              x: 40,
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
                type: 'value'
              }
            ],
            series: [
              {
                name:'当前时间段数据',
                type:'line',
                smooth:true,
                data:this.yData
              }
            ]
          });
        })
      },

      closeModal() {
        let flag = true;
        this.$emit('modalClose', flag);
      },

      doSearchCurve() {
        let flag = {
          "startTime":this.startTime,
          "endTime":this.endTime
        };
        this.$emit('doSearchData', flag);
      }
    },
    props: ['xData','yData', 'isHideCurve','name']
  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "../assets/less/base";

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
      width: 95%;
      height: 90%;
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: @color-white;
      border-radius: 10px;
      .containerTop{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .containerTopDiv{
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2%;
          .el-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 200px;
            height:35px;
            margin-right: 10%;
            margin-left: 10%;
          }
        }
      }
      .containerBottom{
        margin-top: 5%;
      }
    }
  }

  .hideModal {
    display: none;
  }
</style>
