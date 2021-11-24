<script>
import DDR from '@/components/ddr'
import config from './config'
export default {
  data() {
    return {
      list: [],
    }
  },
  created() {
    let size = 150
    let gutter = [20, 50]
    let count = Math.floor(window.innerWidth / (size + gutter[0]))
    let totalSpace = (count + 1) * gutter[0]
    let newSize = (window.innerWidth - totalSpace) / count
    let row = -1
    let col = 0

    this.list = config.map((item, index) => {
      if (index % count === 0) {
        row += 1
        col = 0
      }
      item.transform.x = col * newSize + (col + 1) * gutter[0]
      item.transform.width = newSize
      item.transform.y = row * newSize + (row + 1) * gutter[1]
      col += 1
      return item
    })
  },
  render() {
    return (
      <div class="main-content">
        {this.list.map((item) => {
          return (
            <DDR active={true} {...{ props: item.params }} v-model={item.transform}>
              <div class="cell">{item.content}</div>
            </DDR>
          )
        })}
      </div>
    )
  },
}
</script>

<style lang="less">
.main-content {
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  height: 100vh;
  position: relative;
  overflow: hidden;
  .cell {
    padding: 10px;
    font-size: 16px;
    user-select: none;
    background: linear-gradient(45deg, #ff9800, #673ab7);
    height: 100%;
    border-radius: 20px;
  }
  .yoyoo-ddr {
    &.active {
      border: 0;
    }
    > .resize-handler-wrapper {
      .resize-handler {
        border-radius: 0;
        border: 0;
        user-select: none;
      }
    }
    .rotate-handler {
      border-radius: 0;
      border: 0;
      user-select: none;
    }
    .bm,
    .tm {
      width: 100% !important;
      left: 0;
      margin-left: 0 !important;
    }
    .l,
    .r {
      height: 100% !important;
      top: 0;
      margin-top: 0 !important;
    }
    .tl,
    .tr,
    .br,
    .bl {
      z-index: 1;
    }
  }
}
</style>
