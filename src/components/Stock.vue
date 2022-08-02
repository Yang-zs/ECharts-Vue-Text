<!--初始化样板-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import { getStock } from '@/api/stock'
export default {
  data(){
    return {
      chartInstance:null,
      allData:null
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
  },
  methods:{
    // 初始化地图
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref,)
      const initOption = {
        title:{
          text:'《库存和销量分析》',
          left:20,
          top:20,
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取接口数据
    async getData(){
      const res = await getStock()
      console.log(res,'res')
      this.allData = res
      this.updateChart()
    },
    //  更新图表
    updateChart(){
      const  centerArr = [
          ['18%','40%'],
          ['50%','40%'],
          ['82%','40%'],
          ['34%','75%'],
          ['66%','75%'],
      ]
      const colorArr = [
          ['#4ff778','#0BA82C'],
          ['#E4DD45','#E8811C'],
          ['#E8821C','#E55445'],
          ['#5052EE','#AB6EE5'],
          ['#23E5E5','#2E72BF'],
      ]
      const showData = this.allData.slice(0,5)
      const seriesArr = showData.map((item,index)=>{
        return {
          type:'pie',
          radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false,  // 关闭鼠标移入的动画
          labelLine: {
              show: false,
          },
          label:{
            position:'center',
            color:colorArr[index][0],
          },
          data:[
            {
              name:item.name + '\n' + item.sales,
              value:item.sales,
              itemStyle:{
                color:new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset:0,
                    color:colorArr[index][0]
                  },
                  {
                    offset:1,
                    color:colorArr[index][1]
                  }

                ]),
              }
            } ,
            {
              value:item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    //  分辨率适配
    screenAdapter(){
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }

  }
}
</script>

<style scoped></style>
