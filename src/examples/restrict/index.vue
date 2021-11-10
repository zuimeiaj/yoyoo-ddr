<script>
import DDR from '@/components/ddr'
export default {
  data() {
    return {
      transform: { x: 100, y: 100, width: 100, height: 100, rotation: 0 },
      minWidth: 50,
      minHeight: 50,
      maxWidth: 200,
      maxHeight: 200,
      grid: [10, 10],
    }
  },
  render() {
    return (
      <div class="restrict page">
        <DDR
          grid={this.grid}
          maxWidth={this.maxWidth}
          maxHeight={this.maxHeight}
          minHeight={this.minHeight}
          minWidth={this.minWidth}
          parent={true}
          v-model={this.transform}
        >
          <div class="cell" />
        </DDR>
      </div>
    )
  },
}
</script>

<style lang="less" scoped>
.restrict {
  .cell {
    background: grey;
    color: #fff;
    height: 100%;
    user-select: none;
    padding: 24px;
  }
}
</style>
