<script>
import DragCell from '@/components/ddr'
import { EVENT_COMPONENT_SELECT, EVENT_COMPONENT_TRANSFORM } from './event-enums'
import ComponentImpl from './component-impl'
export default {
  props: {
    item: Object,
  },
  methods: {
    handler(event, transform) {
      this.eventbus.$emit(EVENT_COMPONENT_TRANSFORM, { type: this.handleType, transform })
    },
    beforeActive1() {
      this.handleType = 'beforeactive'
      this.eventbus.$emit(EVENT_COMPONENT_SELECT, this.item)
      return true
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
    renderContent() {
      let extra = this.item.extra
      let DynamicComponent = ComponentImpl[extra.type]
      return (
        <div class="component-impl">
          <DynamicComponent params={extra} />
        </div>
      )
    },
  },
  render() {
    let item = this.item
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
        onDragstart={this.handleDragStart}
        onDrag={this.handleDrag}
        onDragend={this.handleDragEnd}
        onResizestart={this.handleResizeStart}
        onResize={this.handleResize}
        onResizeend={this.handleResizeEnd}
        onRotatestart={this.handleRotateStart}
        onRotate={this.handleRotate}
        onRotateend={this.handleRotateEnd}
        renderContent={this.renderContent}
      />
    )
  },
}
</script>

<style lang="less" scoped>
.component-impl {
  position: absolute;
  user-select: none;
}
</style>
