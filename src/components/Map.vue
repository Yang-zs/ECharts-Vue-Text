<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart " ref="map_ref"></div>
  </div>
</template>

<script>

import {getChinaMapData, getMapData} from '@/api/map'
import {getProvinceMapInfo} from '@/tool/map_utils'
import axios from "axios";
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'

export default {
  data(){
    return {
      chartInstance:null,
      allData:null,
      mapData:{} // 获取的省份的地图矢量数据
    }
  },
  created() {
  },
  computed:{
    ...mapState(['theme']),
    comStyle() {
      return {
        fontsize:this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px',
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
  },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }

  },
  mounted(){
    this.initChart()
    this.getData()
    // this.updateChart()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods:{
    // 初始化地图
    async initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.map_ref,this.theme)
      // 获取中国地图
      const ret = await getChinaMapData()
      this.$echarts.registerMap('china', ret)
      // console.log(ret,'chinaJson')
      const initOption = {
        title:{
          text:'🏡商家分布',
          left:20,
          top:20,
        },
        // 地图图表具体配置
        geo:{
          type:'map',
          map:'china',
          top:'5%',
          bottom:'5%',
          itemStyle:{
            areaColor:'#2E72BF',
            borderColor:'#333'
          },
        },
        legend: {
          left:'5%',
          bottom:'5%',
        //  更改图例排列方向
          orient:'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click',async (arg)=>{
        // console.log(arg)
        const provinceInfo =  getProvinceMapInfo(arg.name)
        // console.log(provinceInfo,'provinceInfo')
      //  获取省份地图矢量数据
      //  判断是否获取过省份数据
        if(!this.mapData[provinceInfo.key]) {
          const ret = await axios.get('http://localhost:8989' + provinceInfo.path)
          this.mapData[provinceInfo.key] = ret.data
          // console.log(ret,'ret')
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo:{
            map:provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    // 获取接口数据
    async getData(){
      this.allData = await getMapData();
      // console.log(this.allData,'allData')
      // console.log(res,'res')
      this.updateChart()
    },
    //  更新图表
    updateChart(){
      // 处理图标需要的数据
      // 图例的数据
      const legendData = this.allData.map(item=>item.name)
      const seriesArr = this.allData.map(item=>{
        // return的这个对象代表每一个类别下的所有散点数据
        return {
          type:'effectScatter',
          name:item.name,
          data:item.children,
          // 使用地图 坐标 (使用这个才能出现坐标散点)
          coordinateSystem:'geo',
          // ↓涟漪效果
          rippleEffect:{
            brushType:'stroke',
            scale:5,
          },
        }
      })
      const dataOption = {
        legend:{
          data:legendData
        },
        series:seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
  //  分辨率适配
    screenAdapter(){
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 *3.6
      const adapterOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        legend:{
         itemWidth:titleFontSize / 2,
          itemHeight:titleFontSize / 2,
          itemGap:titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
  //  回到初始状态
    revertMap(){
      this.chartInstance.setOption({
        geo:{
          map:'china'
        }
      })
    }

  },
  watch: {
    theme () {
      console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style scoped>
.com-container{
  height: 100%;
  width: 100%;
}
</style>
