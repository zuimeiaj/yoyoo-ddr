<script>
import ComponentsVue from './examples/vseditor/components.vue'
import EditorViewVue from './examples/vseditor/editor-view.vue'

import {
  EVENT_COMPONENT_ADD,
  EVENT_COMPONENT_SELECT,
  EVENT_COMPONENT_TRANSFORM,
  EVENT_COMPONENT_UNSELECT,
} from './examples/vseditor/event-enums'
import FooterVue from './examples/vseditor/footer.vue'
import HeaderVue from './examples/vseditor/header.vue'
import { batchUpdateIn, findComponent, findComponentPathById, updateTreeIn } from './examples/utils'
import PropInspectorVue from './examples/vseditor/prop-inspector.vue'
import PluginSelectionVue from './examples/vseditor/plugins/plugin-selection.vue'
import PluginGridVue from './examples/vseditor/plugins/plugin-grid.vue'
const historys = []
const redoHistorys = []
export default {
  name: 'app',
  data() {
    return {
      controls: [],
      currentId: '',
      currentPath: [],
      controlled: {},
    }
  },
  methods: {
    getComponents(components) {
      return components.map((item) => ({
        type: item.type,
        children: item.type === 'container' ? [] : void 0,
        id:
          Date.now() +
          Math.random()
            .toString()
            .slice(2),
        transform: {
          x: item.x - (item.x % 10),
          y: item.y - (item.y % 10),
          width: item.width,
          height: item.height,
          rotation: 0,
        },
        minHeight: 10,
        minWidth: 10,
        rotatable: true,
        resizable: true,
        draggable: true,
        acceptRatio: false,
        active: false,
        parent: true,
        resizeHandler: ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'l', 'bl'],
        extra: item,
        grid: [10, 10],
        axis: 'xy',
      }))
    },
    /**
     * @description 批量添加组件到编辑区域，如果指定了parentid则将添加到指定的组件中。目前parentid对应的组件只能为Container类型的组件
     * @params {{components:Array,parentId:string?}}
     */
    addControl({ components, parentId }) {
      let controls = []
      let newComponents = this.getComponents(components)
      if (parentId) {
        const { path } = findComponentPathById(this.controls, parentId)
        controls = updateTreeIn(this.controls, path, (item) => {
          item.children = item.children.concat(newComponents)
          return item
        })
      } else {
        controls = this.controls.concat(newComponents)
      }

      this.setControls(controls)

      // 默认选中最后一个
      let { component } = findComponentPathById(controls, newComponents[newComponents.length - 1].id)

      // 默认选中最后一个
      this.handleSelect(component)
    },
    /**
     * @description 根据变更id的数据进行批量更新
     * @param {{[id :string]:{key:string;value:any}}} changes
     */
    batchUpdateControlValue(changes) {
      let controls = batchUpdateIn(this.controls, Object.keys(changes), (item) => {
        item[changes[item.id].key] = changes[item.id].value
        return item
      })
      this.setControls(controls)
    },
    /**
     * @description 指定id列表批量删除组件
     * @param {string[]} 要删除的组件id集合
     */
    batchDeleteControls(deleteIds) {
      let controls = batchUpdateIn(this.controls, deleteIds, () => false)
      this.setControls(controls)
    },
    /**
     * @description 更新选中组件指定的key
     * @param {String} key 组件中的字段
     * @param {any} value  新的值
     * @param {Boolean} isExtra 是否为附加参数，对应组件的extra字段。
     */
    updateControlValue(key, value, isExtra) {
      let controls = updateTreeIn(this.controls, this.currentPath, (item) => {
        if (['x', 'y', 'width', 'height', 'rotation'].includes(key)) {
          let transform = { ...item.transform }
          transform[key] = value
          item.transform = transform
          return item
        } else if (isExtra) {
          let extra = { ...item.extra }
          extra[key] = value
          item.extra = extra
        } else {
          item[key] = value
        }
        return item
      })
      this.setControls(controls)
    },
    // 组件拖拽时将新的transform同步到属性编辑器中，并在end事件中进行一次数据同步
    handleTransform({ transform, type }) {
      this.controlled = { ...this.controlled, ...transform }
      if (['resizeend', 'dragend', 'rotateend'].includes(type)) {
        this.updateControlValue('transform', transform, false)
      }
    },
    /**
     * @description 变更当前选中组件的状态
     * @param {Boolean} status
     */
    updateControlStatus(status) {
      let controls = updateTreeIn(this.controls, this.currentPath, (item) => {
        item.active = status
        return item
      })
      this.setControls(controls)
    },
    //  组件选中，右侧展示属性编辑器
    handleSelect(control) {
      this.setCurrentControl(control)
      this.updateControlStatus(true)
    },
    setCurrentControl(control) {
      // 无组件选中时，直接清除属性编辑器
      if (!control || !control.id) {
        this.clearCurrentComponent()
        return
      }

      // 将已选中的取消选中
      if (control && this.currentId) {
        let controls = updateTreeIn(this.controls, this.currentPath, (item) => {
          item.active = false
          return item
        })
        // 不加入历史记录
        this.setControls(controls, false)
      }

      // 深度拷贝数据，避免数据引用污染
      control = JSON.parse(JSON.stringify(control))
      Object.assign(control, control.transform, { active: true })
      //  将选中组件设置到当前属性编辑器中
      let { path } = findComponentPathById(this.controls, control.id)
      this.currentPath = path
      this.controlled = control
      this.currentId = control.id
    },
    // 属性编辑器变化后同步到组件中
    handleChange({ name, value, extra }) {
      if (extra) {
        this.controlled.extra[name] = value
      } else {
        this.controlled[name] = value
      }
      // 注意节流优化提升性能
      this.updateControlValue(name, value, extra)
    },
    getActiveComponent(ctls) {
      return findComponent(ctls, (item) => item.active)
    },
    setControls(controls, needRecordHistory = true) {
      this.controls = controls
      if (needRecordHistory) historys.push(this.controls)
    },
    /**
     * @description 清空选中状态
     */
    clearCurrentComponent() {
      this.controlled = {}
      this.currentId = ''
      this.currentPath = []
    },
    // Actions
    handleUndo() {
      if (historys.length == 0) return
      this.clearCurrentComponent()
      let last = historys.pop()
      let cur = historys[historys.length - 1] || []
      this.controls = cur
      redoHistorys.push(last)
      if (cur) {
        this.setCurrentControl(this.getActiveComponent(this.controls))
      }
    },
    /**
     * @description 删除当前选中的组件
     */
    deleteComponent() {
      if (!this.currentId) {
        return
      }
      let controls = updateTreeIn(this.controls, this.currentPath, () => false)
      this.setControls(controls)
      this.clearCurrentComponent()
    },
    handleClear() {
      this.setControls([])
      this.clearCurrentComponent()
    },

    handleRedo() {
      if (redoHistorys.length === 0) return
      let contrls = redoHistorys.pop()
      this.clearCurrentComponent()
      this.setControls(contrls)
      this.setCurrentControl(this.getActiveComponent(contrls))
    },
    handleUnselect() {
      if (!this.currentId) return
      this.updateControlStatus(false)
      this.clearCurrentComponent()
    },
    getEditorView() {
      return this.$refs.editor
    },
  },
  created() {
    // 使用独立的事件对象来处理，避免多层透传回调函数
    this.eventbus.$on(EVENT_COMPONENT_ADD, this.addControl)
    this.eventbus.$on(EVENT_COMPONENT_SELECT, this.handleSelect)
    this.eventbus.$on(EVENT_COMPONENT_TRANSFORM, this.handleTransform)
    this.eventbus.$on(EVENT_COMPONENT_UNSELECT, this.handleUnselect)
  },
  render() {
    // eslint-disable-next-line no-console
    console.log('render app')
    return (
      <div class="app">
        <HeaderVue
          onUndo={this.handleUndo}
          onRedo={this.handleRedo}
          onClear={this.handleClear}
          onDelete={this.deleteComponent}
        />
        <div class="content">
          <ComponentsVue />
          <EditorViewVue ref="editor" value={this.controls}>
            <PluginSelectionVue application={this} />
            <PluginGridVue />
          </EditorViewVue>
          <PropInspectorVue onChange={this.handleChange} controlled={this.controlled} />
        </div>
        <FooterVue />
      </div>
    )
  },
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.content {
  display: flex;
  flex: 1;
  height: 0;
  .vs-editor {
    flex: 1;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
}
.component-impl,
.match-parent {
  width: 100%;
  height: 100%;
  display: block;
}
.input-has-label {
  display: flex;
  align-items: center;
  input {
    margin-right: 6px;
  }
}
// 自定义class样式
.yoyoo-ddr.ddr-dragging {
  &.active {
    border: 1px solid blue;
    border-radius: 2px;
  }
  .resize-handler-wrapper,
  .rotate-handler {
    display: none;
  }
}
.yoyoo-ddr.ddr-ready-dragging {
  &.active {
    border: 1px solid #ff0000;
  }
  .resize-handler-wrapper,
  .rotate-handler {
    display: none;
  }
}
</style>
