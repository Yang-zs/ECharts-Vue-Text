<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{  showTitle }}</span>
      <span class="iconfont title-icon" :style="comStyle" @click="showChoice = !showChoice">
        &#xe6eb;
      </span>
      <div class="select-con" v-show="showChoice">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import TrendApi from '@/api/trend.js'

export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      showChoice: false, // 是否显示选择框
      choiceType:'map', // 显示的数据是哪一组
      titleFontSize:0  // 指明标题的字体大小
    }
  },
  created() {

  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  // this.handleSelect()
  },
  destroyed() {
    window.removeEventListener('resiz1e', this.screenAdapter)
  },
  computed: {
    // 下拉菜单
    selectTypes() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item=>{
          return item.key !== this.choiceType
        })
      }
    },
    // 下拉标题的展示
    showTitle(){
     if(!this.allData){
     return ''
     }else {
       return  this.allData[this.choiceType].title
     }
    },
  //  设置给标题的样式
    comStyle(){
      return {
        fontSize:this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    // 下拉菜单
    handleSelect(currentType){
     this.choiceType = currentType
      this.updataChart()
      this.showChoice = false
    },
    // 初始化图标
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        grid: {
          left: '2%',
          top: '35%',
          right: '4%',
          bottom: '5%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
        },
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取接口数据
    async getData() {
      this.allData = await TrendApi.getTrendData()
      console.log(this.allData, 'this.allData')
      this.updataChart()
    },
    //
    updataChart() {
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254 ,33, 30, 0.5)',
        'rgba(250 ,105, 0, 0.5)',
      ]
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254 ,33, 30, 0)',
        'rgba(250 ,105, 0, 0)',
      ]
      // x轴数据
      const timeArr = this.allData.common.month
      // y轴数据
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          // 堆叠折线
          stack: [this.choiceType],
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorArr1[index] }, // 0%的颜色
              { offset: 1, color: colorArr2[index] }, // 100%的颜色
            ]),
          },
        }
      })
      // 图例的数据
      const legendArr = valueArr.map((item) => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
    // 关于屏幕大小相关的配置项
    screenAdapter() {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
         legend:{
           itemWidth:this.titleFontSize,
           itemHeight:this.titleFontSize,
           itemGap:this.titleFontSize,
           textStyle: {
             fontSize: this.titleFontSize / 2
           }
         }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}
.select-item{
  cursor: pointer;
}
.select-con{
  background-color: #222733;
}
</style>
