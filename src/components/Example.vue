<!--初始化样板-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import { getMapData } from '@/api/map'
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
      this.chartInstance = this.$echarts.init(this.$refs.map_ref)
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    // 获取接口数据
    async getData(){
      const res = await getMapData()
      console.log(res,'res')
      this.allData = res
      this.updateChart()
    },
    //  更新图表
    updateChart(){
      const dataOption = {}
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
