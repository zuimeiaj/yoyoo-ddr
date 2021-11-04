<script>
import { Dom, Interaction, isComponent } from '@/examples/utils/dom'
import DDrComponent from '@/components/ddr'
import { EVENT_COMPONENT_SELECT, EVENT_COMPONENT_UNSELECT } from '../event-enums'
import { getComponentRefsById } from '@/examples/utils/ref'
export default {
  props: {
    application: Object,
  },
  data() {
    return {
      selectedComponents: [],
      selectionTransform: { x: 0, y: 0, width: 0, rotation: 0 },
      selectionActive: false,
      selectionHandler: ['tl', 'tr', 'br', 'bl'],
    }
  },
  methods: {
    onChange(rect) {
      const controls = this.application.controls
      const crossComponents = controls.filter((item) => {
        let transform = item.transform
        let isXCross = transform.x + transform.width > rect.x && transform.x < rect.x + rect.width
        let isYCorss = transform.y + transform.height > rect.y && transform.y < rect.y + rect.height
        return isXCross && isYCorss
      })
      this.selectedComponents = crossComponents.map((item) => ({
        id: item.id,
        ...item.transform,
      }))
    },
    handleClick(e) {
      if (this.selectedComponents.length > 0) {
        this.selectedComponents = []
        return
      }
      if (!isComponent(e.target)) {
        this.eventbus.$emit(EVENT_COMPONENT_UNSELECT)
        this.selectionTransform = { x: 0, y: 0, width: 0, rotation: 0 }
        this.selectionActive = false
      }
    },
    createSelectionTransform() {
      let x = []
      let y = []
      let x1 = []
      let y1 = []
      let ids = []
      this.selectedComponents.forEach((item) => {
        x.push(item.x)
        y.push(item.y)
        x1.push(item.x + item.width)
        y1.push(item.y + item.height)
        ids.push(item.id)
      })
      let left = Math.min(...x)
      let top = Math.min(...y)
      let right = Math.max(...x1)
      let bottom = Math.max(...y1)
      this.selectionTransform = {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
        rotation: 0,
      }
      this.selectionActive = true
      this.componentRefs = getComponentRefsById(ids)
    },
    handleSelectionDrag(e) {
      e.stopPropagation()
      this.componentRefs.forEach((item) => {
        item.transform.x += this.$refs.ddr._deltaX
        item.transform.y += this.$refs.ddr._deltaY
      })
    },
    handleSelectionDragStart(e) {
      e.stopPropagation()
    },
    handleSelectionResize(e) {
      e.stopPropagation()
      // 未完
      this.componentRefs.forEach((item) => {
        item.transform.width += this.$refs.ddr._deltaX
        item.transform.height += this.$refs.ddr._deltaY
      })
    },
  },
  mounted() {
    let selection = Dom.of(this.$refs.selection)
    let element = this.application.getEditorView().getWrapperElement()
    element.addEventListener('click', this.handleClick, false)
    Interaction.init(element, {
      onMove: ({ x, y, downClientX, downClientY }) => {
        if (x < 0) {
          x = Math.abs(x)
          downClientX -= x
        }
        if (y < 0) {
          y = Math.abs(y)
          downClientY -= y
        }
        selection
          .show()
          .size(x, y)
          .position(downClientX, downClientY)
        this.onChange({ x: downClientX, y: downClientY, width: x, height: y })
      },
      onEnd: () => {
        selection.hide()
        if (this.selectedComponents.length == 1) {
          this.eventbus.$emit(
            EVENT_COMPONENT_SELECT,
            this.application.controls.find((item) => item.id === this.selectedComponents[0].id)
          )
        } else if (this.selectedComponents.length > 1) {
          if (this.application.currentId) {
            this.eventbus.$emit(EVENT_COMPONENT_UNSELECT)
          }
          this.createSelectionTransform()
        }
      },
    })
  },
  render() {
    return (
      <div data-plugin="selection" class="plugin-selection">
        <div ref="selection" class="selection-box" />
        {this.selectedComponents.map((item) => {
          return (
            <div
              class="selection-selected-component-bordered"
              style={`left:${item.x}px;top:${item.y}px;width:${item.width}px;height:${item.height}px`}
              key={item.id}
            />
          )
        })}

        <DDrComponent
          ref="ddr"
          data-component="true"
          rotatable={false}
          resizeHandler={this.selectionHandler}
          active={this.selectionActive}
          onDragstart={this.handleSelectionDragStart}
          onDrag={this.handleSelectionDrag}
          onDragend={this.handleSelectionDragStart}
          onResizestart={this.handleSelectionDragStart}
          onResize={this.handleSelectionResize}
          onResizeend={this.handleSelectionDragStart}
          value={this.selectionTransform}
        />
      </div>
    )
  },
}
</script>

<style lang="less" scoped>
.selection-box {
  border: 1px solid blue;
  background: rgba(0, 0, 0, 0.1);
  display: none;
}
.selection-selected-component-bordered {
  border: 1px solid blue;
  position: absolute;
}
</style>
