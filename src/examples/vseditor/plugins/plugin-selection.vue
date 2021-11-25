<script>
import { Interaction } from '@/examples/utils/dom'
import DDrComponent from '@/components/ddr'
import { EVENT_COMPONENT_UNSELECT } from '../event-enums'
import { getComponentRef, getComponentRefsById } from '@/examples/utils/ref'
import { getBoundingRect } from '@/components/ddr/helper'
import { registerSelectionActions } from './plugin-selection-actions'
/**
 * @description
 *  1、为编辑器增加批量选择功能
 *  2、可批量拖拽改变所选组件位置
 *  3、可批量缩放改变所选组件大小
 *  4、点击页面任何区域可使已选中的组件取消选中
 *  5、可拦截删除功能，对已选中的组件进行批量删除
 *  6、可拦截副本功能，对已选中的组件进行批量复制
 */
export default {
  props: {
    application: Object,
  },
  data() {
    return {
      grid: [1, 1],
      selectedComponents: [],
      selectionTransform: { x: 0, y: 0, width: 0, height: 0, rotation: 0 },
      selectionActive: false,
      selectionHandler: ['tl', 'tr', 'br', 'bl'],
      selectionArea: { x: 0, y: 0, width: 0, height: 0 },
    }
  },
  watch: {
    selectionActive(value) {
      if (!value) {
        this.selectedComponents = []
        this.selectionTransform = { x: 0, y: 0, width: 0, rotation: 0 }
        this.componentRefs = []
      }
    },
  },
  methods: {
    getContains() {
      const rect = this.selectionArea
      const controls = this.application.controls
      // 被包含的元素才会被选中
      const crossComponents = controls.filter((item) => {
        let transform = getBoundingRect(item.transform)
        let isXContain = transform.left > rect.x && transform.right < rect.x + rect.width
        let isYContain = transform.top > rect.y && transform.bottom < rect.y + rect.height
        return isXContain && isYContain
      })
      this.selectedComponents = crossComponents.map((item) => ({
        id: item.id,
        ...item.transform,
      }))
    },
    handleSelectionStart() {
      this.eventbus.$emit(EVENT_COMPONENT_UNSELECT)
      this.selectionActive = false
    },
    handleSelectionMove({ x, y, downClientX, downClientY }) {
      if (x < 0) {
        x = Math.abs(x)
        downClientX -= x
      }
      if (y < 0) {
        y = Math.abs(y)
        downClientY -= y
      }
      this.selectionArea = { x: downClientX, y: downClientY, width: x, height: y }
      this.getContains()
    },
    handleSelectionEnd() {
      if (this.selectedComponents.length == 1) {
        this.application.handleSelect(
          this.application.controls.find((item) => item.id === this.selectedComponents[0].id)
        )
        this.selectedComponents = []
      } else if (this.selectedComponents.length > 1) {
        this.application.handleUnselect()
        this.createSelectionTransform()
      }
      this.selectionArea = { x: 0, y: 0, width: 0, height: 0 }
    },
    createSelectionTransform() {
      let x = []
      let y = []
      let x1 = []
      let y1 = []
      let ids = []
      this.selectedComponents.forEach((item) => {
        ids.push(item.id)
        item = getBoundingRect(item)
        x.push(item.left)
        y.push(item.top)
        x1.push(item.right)
        y1.push(item.bottom)
      })
      let left = Math.min(...x)
      let top = Math.min(...y)
      let right = Math.max(...x1)
      let bottom = Math.max(...y1)
      this.selectionActive = true
      this.selectionTransform = {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
        rotation: 0,
      }
      this.getSelectedComponentRefs(ids, this.selectionTransform)
    },
    getSelectedComponentRefs(ids, { x, y, width, height }) {
      this.componentRefs = getComponentRefsById(ids).map((item) => {
        // 记录组件在选区的位置和宽度百分比
        item._xPercent = (item.transform.x - x) / width
        item._yPercent = (item.transform.y - y) / height
        item._wPercent = item.transform.width / width
        item._hPercent = item.transform.height / height
        return item
      })
    },
    getSelectedComponentTransform() {
      this.selectedComponents = this.selectedComponents.map((item) => {
        let t = getComponentRef(item.id).transform
        item.x = t.x
        item.y = t.y
        item.width = t.width
        item.height = t.height
        return item
      })
    },
    handleSelectionDrag(e) {
      e.stopPropagation()
      let area = this.$refs.ddr.transform
      this.componentRefs.forEach((item) => {
        item.transform.x = Math.round(area.x + area.width * item._xPercent)
        item.transform.y = Math.round(area.y + area.height * item._yPercent)
      })
      this.getSelectedComponentTransform()
    },
    stopPropagation(e) {
      e.stopPropagation()
    },
    handleSelectionDragEnd(e, transform) {
      e.stopPropagation()
      let changes = {}
      this.componentRefs.forEach((item) => {
        changes[item.id] = {
          key: 'transform',
          value: { ...item.transform },
        }
      })
      this.selectionTransform = transform
      this.application.batchUpdateControlValue(changes)
    },

    handleSelectionResize(e) {
      e.stopPropagation()
      let area = this.$refs.ddr.transform
      this.componentRefs.forEach((item) => {
        item.transform.x = Math.round(area.x + area.width * item._xPercent)
        item.transform.y = Math.round(area.y + area.height * item._yPercent)
        item.transform.width = Math.round(area.width * item._wPercent)
        item.transform.height = Math.round(area.height * item._hPercent)
      })
      this.getSelectedComponentTransform()
    },
  },

  mounted() {
    this.componentRefs = []
    let element = this.application.getEditorView().getWrapperElement()

    Interaction.init(element, {
      onStart: () => {
        this.handleSelectionStart()
      },
      onMove: (interaction) => {
        this.handleSelectionMove(interaction)
      },
      onEnd: () => {
        this.handleSelectionEnd()
      },
    })
    // register
    registerSelectionActions(this)
  },
  render() {
    const { x, y, width, height } = this.selectionArea
    return (
      <div data-plugin="selection" class="plugin-selection">
        <div
          style={`
            display:${width > 0 ? 'block' : 'none'};
            width:${width}px;
            height:${height}px;
            left:${x}px;
            top:${y}px`}
          class="selection-box"
        />
        {this.selectedComponents.map((item) => {
          return (
            <div
              class="selection-selected-component-bordered"
              style={`
                transform:rotate(${item.rotation}deg);
                left:${item.x}px;
                top:${item.y}px;
                width:${item.width}px;
                height:${item.height}px`}
              key={item.id}
            />
          )
        })}

        <DDrComponent
          ref="ddr"
          data-component="true"
          rotatable={false}
          grid={this.grid}
          resizeHandler={this.selectionHandler}
          active={this.selectionActive}
          onDragstart={this.stopPropagation}
          onDrag={this.handleSelectionDrag}
          onDragend={this.handleSelectionDragEnd}
          onResizestart={this.stopPropagation}
          onResize={this.handleSelectionResize}
          onResizeend={this.handleSelectionDragEnd}
          value={this.selectionTransform}
        />
      </div>
    )
  },
}
</script>

<style lang="less" scoped>
.selection-box {
  border: 1px dashed blue;
  background: rgba(255, 255, 255, 0.2);
  display: none;
  position: absolute;
}
.selection-selected-component-bordered {
  border: 1px solid blue;
  position: absolute;
}
</style>
