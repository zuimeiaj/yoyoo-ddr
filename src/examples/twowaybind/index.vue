<script>
import DDR from '@/components/ddr'
export default {
  data() {
    return {
      transform: { x: 100, y: 100, width: 500, height: 100, rotation: 0 },
    }
  },
  render() {
    const { x, y, width, height, rotation } = this.transform
    return (
      <div class="twowaybind page">
        <div class="tips">
          x={x},y={y},width={width},height={height},rotation={rotation}
        </div>

        <DDR minHeight={100} minWidth={300} parent={true} v-model={this.transform}>
          <div class="cell" />
        </DDR>
      </div>
    )
  },
}
</script>

<style lang="less" scoped>
.twowaybind {
  .tips {
    text-align: center;
    padding: 24px;
  }
  .cell {
    background: grey;
    color: #fff;
    height: 100%;
    user-select: none;
    padding: 24px;
  }
}
</style>
