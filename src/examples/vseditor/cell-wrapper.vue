<script>
import DragCell from '@/components/ddr/index.vue'
import { EVENT_COMPONENT_SELECT, EVENT_COMPONENT_TRANSFORM } from './event-enums'
import ComponentImpl from './component-impl'
import { saveComponentRef } from '@/examples/utils/ref'
export default {
  props: {
    item: Object,
  },
  methods: {
    handler(e, transform) {
      e.stopPropagation()
      e.preventDefault()
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
          <DynamicComponent meta={this.item} params={extra} />
        </div>
      )
    },
  },
  mounted() {
    // 保存组件的引用，方便直接对组件进行操作
    saveComponentRef(this.item.id, this.$refs.cell)
  },
  render() {
    let item = this.item
    // eslint-disable-next-line no-console
    return (
      <DragCell
        ref="cell"
        data-component={true}
        grid={item.grid}
        axis={item.axis}
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
        zoom={item.zoom}
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
