<!--初始化样板-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
import { getHot } from '@/api/hot'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  data(){
    return {
      chartInstance:null,
      allData:null,
      currentIndex:0, // 当前分类
      titleFontSize:0
    }
  },
  created() {
  },
  watch: {
    theme () {
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
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
  computed: {
    ...mapState(['theme']),
    catName(){
      if(!this.allData){
        return ''
      }else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle() {
      return {
       fontsize:this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    }
  },
  methods:{
    // 初始化地图
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref,this.theme)
      const initOption = {
        title:{
          text:'热销商品的占比',
          left:20,
          top:20,
        },
        tooltip:{
          show:true,
          formatter:(arg)=>{
            const  thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item=>{
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach(item=>{
              retStr += `${item.name}:${parseInt(item.value/total*100) + '%'}  <br/>`
            })
            return  retStr
          }
        },
        legend: {
          top:'15%',
          icon:'circle',
        },
        series: [
          {
            type:'pie',
            label: {
                show: false,
            },
            emphasis:{
              label:{
                show:true
              },
              labelLine:{
                show:false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.updateChart()
    },
    // 获取接口数据
    async getData(){
      this.allData = await getHot()
      // console.log(this.allData,'this.allData')
      this.updateChart()
    },
    //  更新图表
    updateChart(){
      if(!this.allData) return
      const legendData = this.allData[this.currentIndex].children.map(item=>item.name)
      // console.log(this.allData,'this.allData')
      const seriesData = this.allData && this.allData[this.currentIndex].children.map(v=>{
        return {
          name:v.name,
          value:v.value,
          children:v.children
        }
      })
      const dataOption = {
        legend:{
          data:legendData
        },
        series:[
          {
            data:seriesData
          }
        ],
            }
      this.chartInstance.setOption(dataOption)
    },
    //  分辨率适配
    screenAdapter(){
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 2.5
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend:{
          itemWidth:this.titleFontSize / 2,
          itemHeight:this.titleFontSize / 2,
          itemGap:this.titleFontSize / 2,
          textStyle: {
           fontSize: this.titleFontSize / 2
          }
        },
        series:[
          {
            radius:this.titleFontSize *  4.5,
            center:['50%','50%']
          }
        ]

      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    // 向左翻页
    toLeft(){
      this.currentIndex--
      if(this.currentIndex<0){
        this.currentIndex = this.allData.length-1
      }
      this.updateChart()
    },
    // 向右翻页
    toRight(){
      this.currentIndex++
      if(this.currentIndex > this.allData.length-1){
        this.currentIndex = 0
      }
      this.updateChart()
    }


  }
}
</script>

<style scoped>
.arr-left{
 position: absolute;
  left: 10%;
  top:50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 50px;
  color: white;
}
.arr-right{
  position: absolute;
  right: 10%;
  top:50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 50px;
  color: white;
}
.cat-name{
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>
