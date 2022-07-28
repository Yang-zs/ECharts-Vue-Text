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
  mounted() {
    this.initChart()
    this.getData()
  },
  destroyed() {
    clearInterval(this.timerId)
  },
  methods: {
    // 初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, 'chalk')
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
      console.log(this.allData)
      const option = {
        title: {
          text: '▮ 商家销售统计',
          textStyle: {
            fontSize: 66,
          },
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
          data: sellerName,
        },
        series: [
          {
            type: 'bar',
            data: sellerValues,
            barWidth: 66,
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white',
              },
            },
            itemStyle: {
              barBorderRadius: [40, 40, 40, 40],
            },
          },
        ],
      }
      this.chartInstance.setOption(option)
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
  },
}
</script>

<style scoped></style>
