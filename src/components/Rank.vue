<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import { getRank } from '@/api/rank'
export default {
  data(){
    return {
      chartInstance:null,
      allData:null,
      startValue: 0, // 区域缩放起点值
      endValue: 9,   // 区域缩放终点值
      timerId:null,
    }
  },
  created() {
  },
  mounted(){
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods:{
    // 初始化地图
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        title:{
          text:'《地区销售排行》',
          left:20,
          top:20,
        },
        grid:{
          top:'40%',
          left:'5%',
          right:'5%',
          bottom:'5%',
          containLabel:true
        },
        tooltip:{
          show:true,
        },
        xAxis: {
          type:'category',
        },
        yAxis:{
          type:'value'
        },
        series:[{
          type:'bar'
        }]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', ()=>{
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', ()=>{
        this.startInterval()
      })
      this.screenAdapter()
    },
    // 获取接口数据
    async getData(){
      this.allData = await getRank()
      // console.log(this.allData,'this.allData')
      // 从大到小排个序
      this.allData.sort((a,b)=>{
        return b.value - a.value
      })
      this.updateChart()
      this.startInterval()

    },
    //  更新图表
    updateChart(){
      const colorArr = [
          ['#0BA82C','#4FF778'],
          ['#2E72BF','#23E5E5'],
          ['#5052EE','#AB6EE5']
      ]
      // 所有省份形成的数组↓ONE
      const provinceArr = this.allData.map(item=>item.name)
      // 所有省份的销售金额↓TWO
      const valueArr = this.allData.map(item=>item.value)
      const dataOption = {
        xAxis:{
          data:provinceArr
        },
        dataZoom:{
          show:false,
          startValue:this.startValue,
          endValue:this.endValue,
        },
        series: [{
          data:valueArr,
          itemStyle:{
            color:arg=>{
              let targetColorArr = null
              if(arg.value > 300) {
                targetColorArr = colorArr[0]
              }else if(arg.value > 200) {
                targetColorArr = colorArr[1]
              }else {
                targetColorArr = colorArr[2]
              }
              return new this.$echarts.graphic.LinearGradient(0,0,0,1,[{
                offset:0,
                color:targetColorArr[0]
              },{
                offset:1,
                color:targetColorArr[1]
              }])
            }
          }
        }]
      }
      this.chartInstance.setOption(dataOption)
    },
    //  分辨率适配
    screenAdapter(){
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    // 定时器向左移动柱子
    startInterval() {
      if(this.timerId){
        clearInterval(this.timerId)
      }
      this.timerId =   setInterval(() => {
            this.startValue++
            this.endValue++
          if(this.endValue > this.allData.length-1){
            this.startValue = 0
            this.endValue = 9
          }
            this.updateChart()
        }, 1500)
    },


  }
}
</script>

<style scoped></style>
