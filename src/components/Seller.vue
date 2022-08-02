<template>
  <div class="com-container">
    <!-- 图表容器 -->
    <div
      class="com-chart"
      ref="sellerRef"
      style="height: 100%; width: 100%;"
    ></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SellerApi from '@/api/seller'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 总页数
      timerId: null,
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    // 在组件销毁的时候将分辨率监听器取消
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, this.theme)
      const initOption = {
        title: {
          text: '▮ 商家销售统计',
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443',
              type: 'solid',
            },
          },
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white',
              },
            },
            itemStyle: {
              barBorderRadius: [0, 66, 66, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#5052EE' },
                { offset: 1, color: '#AB6EE5' },
              ]),
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    async getData() {
      const ret = await SellerApi.getSellerData()
      // console.log(ret, 'ret')
      this.allData = ret
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.totalPage = Math.ceil(
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1,
      )

      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerName = showData.map((item) => item.name)
      const sellerValues = showData.map((item) => item.value)
      // console.log(this.allData)
      const dataOption = {
        yAxis: {
          data: sellerName,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    // 切换定时器
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
              type: 'solid',
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用
      this.chartInstance.resize()
    },
  },
}
</script>

<style scoped></style>
