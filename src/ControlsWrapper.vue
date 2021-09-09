<script>
import DragCell from './components/ddr'
export default {
  props: {
    value: Array,
    beforeActive: Function,
  },
  methods: {
    handler(event, transform) {
      this.$emit('transform', transform, this.handleType)
    },
    beforeActive1(id) {
      this.handleType = 'beforeactive'
      return this.beforeActive(id)
    },
    handleDragStart(e, t) {
      this.handleType = 'dragstart'
      this.handler(e, t)
    },
    handleDrag(e, t) {
      this.handleType = 'drag'
      this.handler(e, t)
    },
    handleDragEnd(e, t) {
      this.handleType = 'dragend'
      this.handler(e, t)
    },
    handleResizeStart(e, t) {
      this.handleType = 'resizestart'
      this.handler(e, t)
    },
    handleResize(e, t) {
      this.handleType = 'resize'
      this.handler(e, t)
    },
    handleResizeEnd(e, t) {
      this.handleType = 'resizeend'
      this.handler(e, t)
    },
    handleRotateStart(e, t) {
      this.handleType = 'rotatestart'
      this.handler(e, t)
    },
    handleRotate(e, t) {
      this.handleType = 'rotate'
      this.handler(e, t)
    },
    handleRotateEnd(e, t) {
      this.handleType = 'rotateend'
      this.handler(e, t)
    },
    renderContent(cell) {
      return <div class="cell">{cell.id}</div>
    },
  },
  render() {
    return (
      <div class="content">
        {this.value.map((item) => {
          return (
            <DragCell
              key={item.id}
              id={item.id}
              draggable={item.draggable}
              rotatable={item.rotatable}
              resizable={item.resizable}
              parent={item.parent}
              acceptRatio={item.acceptRatio}
              resizeHandler={item.resizeHandler}
              minWidth={item.minWidth}
              minHeight={item.minHeight}
              active={item.active}
              value={item.transform}
              beforeActive={this.beforeActive1}
              onDragStart={this.handleDragStart}
              onDrag={this.handleDrag}
              onDragEnd={this.handleDragEnd}
              onResizeStart={this.handleResizeStart}
              onResize={this.handleResize}
              onResizeEnd={this.handleResizeEnd}
              onRotateStart={this.handleRotateStart}
              onRotate={this.handleRotate}
              onRotateEnd={this.handleRotateEnd}
              renderContent={this.renderContent}
            />
          )
        })}
      </div>
    )
  },
}
</script>
