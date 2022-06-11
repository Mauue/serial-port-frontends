<template>
  <div id="app">
    <div style="padding: 30px; font-size: 30px">串口调试助手</div>
    <el-row>
      <el-col :span="4">
        <div style="background: #fedcbd; padding:20px; padding-bottom: 300px; border-radius: 10px 10px 10px 10px;" >串口列表
          <div
            v-for="port in ports"
            :key="port.name">
            {{port.name}}
          <el-switch
              v-model="port.enabled"
              @change="wsChange(port.name, port.enabled)"
              active-color="#13ce66"
              inactive-color="#ff4949">

          </el-switch>
        </div>
      </div>

        <template>
          <div style="background: #abc88b; padding:20px; padding-bottom: 260px; border-radius: 10px 10px 10px 10px;" >显示方式
            <el-radio  v-model="radio" label="1">Text</el-radio>
            <el-radio  v-model="radio" label="2">Hex</el-radio>
          </div>
        </template>
      </el-col>



      <el-col :span="16"><div >
        <el-tabs v-model="portSelected" type="card" @tab-click="tabChange">
          <el-tab-pane
              :key="item.name"
              v-for="item in ports"
              :label="item.name"
              :name="item.name"
          >
            <div style="display: flex; padding: 30px; flex-wrap: nowrap; flex-direction: row">
              <div>
                波特率：
                <el-select v-model="item.baud" size="small" style="width:50%">
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
                <el-select v-model="item.number" size="small" style="width:30%">
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
                <el-select v-model="item.check" size="small" style="width:30%">
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
                <el-select v-model="item.oe" size="small" style="width:30%">
                  <el-option
                      v-for="item in oeList"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>

            <div style="padding-left: 30px ">
              {{item.name}}
            </div>
          </el-tab-pane>


        <div ref="chart" style="width: 1000px;height:400px;"></div>
        </el-tabs>
        <el-input
            style="width:80%;padding-left: 30px"
            type="textarea"
            :rows="4"
            placeholder="输出区"
            v-model="output"
            :disabled="true"
        >
        </el-input>
        <el-input 
            style="margin-top: 30px; width:80%;padding-left: 30px"
            type="textarea"
            :rows="4"
            placeholder="输入区"
            v-model="textarea">
        </el-input>


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
        // {ws: null, name: "COM2", baud: 1152000, number:8, oe: 8, check: 8, enabled: false,  data: []},
        // {ws: null, name: "COM3", baud: 1152000, number:8, oe: 8, check: 8, enabled: false,  data: []},
        // {ws: null, name: "COM4", baud: 1152000, number:8, oe: 8, check: 8, enabled: false,  data: []},
      ],
      baudList:[
        1200, 2400, 4800, 9600, 19200, 38400, 57600, 74800, 115200, 230400, 460800, 500000, 576000, 921600, 1000000,
        1152000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000
      ],
      radio: '1', //1-Text,2-Hex
      numberList:[5, 6, 7, 8],
      oeList:[5, 6, 7, 8],
      checkList:[5, 6, 7, 8],
      chartOption:{
        dataZoom:{
          type: "slider",
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [
            ],
            type: 'line',
            smooth: true
          }
        ]
      },
      textarea: '',
      output:'',
      myChart: null,
    }
  },
  methods:{
    drawCharts: function (){
      let chartDom = this.$refs.chart;
      console.log(chartDom)
      this.myChart = this.$echarts.init(chartDom);
      this.chartOption && this.myChart.setOption(this.chartOption);
    },
    tabChange: function (tab){
      console.log(this.ports.find(item=>item.name===tab.label).data)
      this.myChart.setOption({series: [
          {
            data: this.ports.find(item=>item.name===tab.label).data,
            type: 'line',
            smooth: true
          }
        ]})
    },
    ab2str: function (buf){
      return String.fromCharCode.apply(null, new Uint8Array(buf));
    },
    wsChange: function (port_name, enabled){
      let _this = this
      if(enabled){
        let port = this.ports.find(item=>item.name===port_name);
        let buffer = ""
        setTimeout(()=>{
          let websocket = new WebSocket("ws://127.0.0.1:8083" + "/serialconsole?portname=" + port_name);
          websocket.binaryType = "arraybuffer";
          websocket.onopen = function () {

            websocket.onmessage = function (evt) {

              if (evt.data instanceof ArrayBuffer) {
                let d = _this.ab2str(evt.data)
                if(d.endsWith("\r") || d.endsWith("\n") || d.endsWith("\r\n") || d.endsWith("\n\r")) {
                  _this.output += buffer + d
                  d = d.replace("\r|\n", "")
                  buffer += d
                  if(buffer.length === 0) return
                  let num =  Number.parseInt(buffer)
                  if (isNaN(num)) return;
                  port.data.push([port.data.length, num])
                  _this.myChart.setOption({series: [
                      {
                        data: port.data,
                        type: 'line',
                        smooth: true
                      }
                    ]})
                  buffer = ""
                }else{
                  buffer += d
                }
              }
            }

            websocket.onclose = function () {
              port.ws = null
              websocket.close()
            }

            websocket.onerror = function (evt) {
              if (typeof console.log == "function") {
                console.log(evt)
              }
            }
          }
          port.ws = websocket
        }, 1)

      console.log(port_name, enabled)
    }}
  },
  mounted() {
    this.drawCharts()
    this.$axios
        .get('/api/get/config')
        .then(response => {
          console.log(response.data)
          let ports = response.data.Ports
          console.log(ports)
          for(let i =0;i<ports.length;i++){
            this.ports.push({
             ws: null, name: ports[i]["Name"], baud: ports[i]["Baudrate"], number:8, oe: 8, check: 8, enabled: false,  data: [],
            })
          }
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
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
  font-size:larger;
}
.el-row {
  margin-top:30px;
  margin-bottom:30px;
  padding-right:30px;
  padding-left:30px;
  line-height: 40px;
  border-radius: 15px 15px 15px 15px;

}
.el-col {
  border-radius: 4px;
  border-radius: 15px 15px 15px 15px;
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
