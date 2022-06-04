<template>
  <div id="app">
    <div>串口调试助手</div>
    <el-row>
      <el-col :span="4"><div>
        串口列表
        <div
            v-for="port in ports"
            :key="port.name"
        >
          {{port.name}}
          <el-switch
              v-model="port.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </div>
      </div></el-col>
      <el-col :span="16"><div >
        <el-tabs v-model="portSelected" type="card" >
          <el-tab-pane
              :key="item.name"
              v-for="item in ports"
              :label="item.name"
              :name="item.name"
          >
            <div style="display: flex; flex-wrap: nowrap; flex-direction: row">
              <div>
                波特率：
                <el-select v-model="item.baud" size="mini">
                  <el-option
                      v-for="item in baudList"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </div>
              <div>
                数字位：
                <el-select v-model="item.number" size="mini">
                  <el-option
                      v-for="item in numberList"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </div>
              <div>
                校验位：
                <el-select v-model="item.check" size="mini">
                  <el-option
                      v-for="item in checkList"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </div>
              <div>
                奇偶位：
                <el-select v-model="item.oe" size="mini">
                  <el-option
                      v-for="item in oeList"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>
            {{item.name}}
          </el-tab-pane>
        </el-tabs>
        <div ref="chart" style="width: 600px;height:400px;"></div>

      </div></el-col>
    </el-row>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
  },
  data: function (){
    return{
      portSelected: "port1",
      ports:[
        {name: "port1", baud: 1152000, number:8, oe: 8, check: 8, enabled: true},
        {name: "port2", baud: 1152000, number:8, oe: 8, check: 8, enabled: true},
        {name: "port3", baud: 1152000, number:8, oe: 8, check: 8, enabled: true},
      ],
      baudList:[
        1200, 2400, 4800, 9600, 19200, 38400, 57600, 74800, 115200, 230400, 460800, 500000, 576000, 921600, 1000000,
        1152000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000
      ],
      numberList:[5, 6, 7, 8],
      oeList:[5, 6, 7, 8],
      checkList:[5, 6, 7, 8],
      chartOption:{
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      }
    }
  },
  methods:{
    drawCharts: function (){
      let chartDom = this.$refs.chart;
      console.log(chartDom)
      let myChart = this.$echarts.init(chartDom);
      this.chartOption && myChart.setOption(this.chartOption);
    }
  },
  mounted() {
    this.drawCharts()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
