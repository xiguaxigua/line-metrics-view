<template>
  <div class="line-metrics-view">
    <div class="line-metrics-view__tip" ref="tip">
      <div
        class="line-metrics-view__tip-item"
        v-for="(item, index) in dataList"
        ref="tipItem"
        :style="getTipLeft(item)"
        :key="index">
        <div class="line-metrics-view__tip-item-label">{{ item.label }}</div>
        <div class="line-metrics-view__tip-item-num">
          {{ getThousandFormat(item.value) }}
          <span class="line-metrics-view__tip-item-num-percent">
            ({{ item.percent }})
          </span>
        </div>
      </div>
    </div>
    <div class="line-metrics-view__arrow" ref="arrow">
      <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <line
          v-for="(item, index) in dataList"
          :key="index"
          :x1="item.x1"
          :y1="lineGap"
          :x2="item.x2"
          :y2="y2"/>
      </svg>
    </div>
    <div class="line-metrics-view__line">
      <div
        class="line-metrics-view__line-item"
        v-for="(item, index) in dataList"
        ref="lineItem"
        :style="getStyle(item)"
        :key="index">
      </div>
    </div>
    <div class="line-metrics-view__sum">{{ getThousandFormat(sum) }}</div>
  </div>
</template>

<script>
import {
  COLOR
} from './constants'

const TIP_MARGIN = 10
const LINE_GAP = 2

export default {
  name: 'LineMetricsView',

  props: {
    data: {
      required: true,
      type: Array
    },
    color: Array
  },

  data () {
    this.lineGap = LINE_GAP

    return {
      dataList: [],
      y2: 0,
      sum: 0
    }
  },

  computed: {
    colorList ({ color }) {
      return color || COLOR
    }
  },

  methods: {
    dataHandler () {
      const { data, colorList, setTipPosition } = this
      let sum = 0
      data.forEach(({ value }) => { sum += value })
      this.dataList = data.map(({ label, value }, index) => {
        const percent = `${parseFloat((value / sum * 100).toFixed(2))}%`
        return {
          percent: percent,
          label,
          value,
          color: colorList[index],
          left: 0,
          x1: 0,
          x2: 0
        }
      })
      this.sum = sum
      this.$nextTick(setTipPosition)
    },

    setTipPosition () {
      const {
        $refs: {
          tipItem,
          lineItem
        },
        dataList
      } = this
      const centerPointList = []
      const tipWidthList = []
      const lineWidthList = []
      const tipLeftList = []
      const lineLeftList = [0]
      tipItem.forEach((item, index) => {
        const lineItemWidth = lineItem[index].clientWidth
        lineWidthList.push(lineItemWidth)
        tipWidthList.push(item.clientWidth)
        dataList[index].x2 = lineLeftList[index] + lineItemWidth / 2
        centerPointList.push(dataList[index].x2)
        lineLeftList.push(lineItemWidth + lineLeftList[index])
      })
      dataList.forEach((d, i) => {
        const leftDistance = i ? tipLeftList[i - 1] : 0
        d.left = leftDistance < centerPointList[i] - tipWidthList[i] / 2
          ? centerPointList[i] - tipWidthList[i] / 2
          : leftDistance + TIP_MARGIN
        d.x1 = d.left + tipWidthList[i] / 2
        tipLeftList.push(d.left + tipWidthList[i])
      })
    },

    resize () {
      this.dataHandler()
    },

    getTipLeft (item) {
      return { left: `${item.left}px` }
    },

    getStyle ({ percent, color }) {
      return {
        width: percent,
        backgroundColor: color
      }
    },

    getYAxisValue () {
      const {
        $refs: {
          arrow
        }
      } = this
      this.y2 = arrow.clientHeight - LINE_GAP
    },

    getThousandFormat (value) {
      return String(value).replace(/^(\s+|-)?\d+(?=.?\d*($|\s))/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    }
  },

  watch: {
    data: {
      immediate: true,
      handler: 'dataHandler'
    }
  },

  mounted () {
    this.getYAxisValue()
  }
}
</script>

<style lang="scss">
$border-color: #ccc;

.line-metrics-view {
  font-size: 14px;
  padding-right: 115px;
  position: relative;

  .line-metrics-view__sum {
    position: absolute;
    width: 110px;
    right: 0;
    bottom: 7px;
  }

  .line-metrics-view__tip {
    height: 50px;
    position: relative;

    .line-metrics-view__tip-item {
      position: absolute;
      bottom: 0;
      padding: 4px;
      border-radius: 4px;
      border: 1px solid $border-color;

      .line-metrics-view__tip-item-num {
        white-space: nowrap;

        .line-metrics-view__tip-item-num-percent {
          color: #888;
        }
      }

      .line-metrics-view__tip-item-label {
        position: relative;

        &::after {
          content: '';
          position: absolute;
          width: 95%;
          border-bottom: 1px dotted $border-color;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
        }
      }
    }
  }

  .line-metrics-view__arrow {
    height: 20px;

    line {
      stroke: rgb(99,99,99);
      stroke-width: 1px;
    }
  }

  .line-metrics-view__line {
    height: 30px;
    width: 100%;
    display: flex;
    border: 1px solid $border-color;

    .line-metrics-view__line-item {
      &:not(:last-child) {
        border-right: 1px solid $border-color;
      }
    }
  }
}
</style>
