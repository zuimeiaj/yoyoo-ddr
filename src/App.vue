<script>
import ComponentsVue from './examples/vseditor/components.vue'
import EditorViewVue from './examples/vseditor/editor-view.vue'
import { EVENT_COMPONENT_ADD, EVENT_COMPONENT_SELECT, EVENT_COMPONENT_TRANSFORM } from './examples/vseditor/event-enums'
import FooterVue from './examples/vseditor/footer.vue'
import HeaderVue from './examples/vseditor/header.vue'
import PropInspectorVue from './examples/vseditor/prop-inspector.vue'
const historys = []
const redoHistorys = []
export default {
  name: 'app',
  data() {
    return {
      controls: [],
      currentId: '',
      controlled: {},
    }
  },
  methods: {
    addControl(components) {
      let controls = this.controls.concat(
        components.map((item) => ({
          id: Math.random()
            .toString()
            .slice(2, 10),
          transform: {
            x: item.x,
            y: item.y,
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
          parent: false,
          resizeHandler: ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'l', 'bl'],
          extra: item,
        }))
      )
      this.setControls(controls)
      // 默认选中最后一个
      this.handleSelect(controls[controls.length - 1])
    },

    updateControlValue(id, key, value, extra) {
      let controls = this.controls.map((item) => {
        if (item.id === id) {
          item = { ...item }
          if (['x', 'y', 'width', 'height', 'rotation'].includes(key)) {
            let transform = { ...item.transform }
            transform[key] = value
            item.transform = transform
            return item
          }
          if (extra) {
            let extra = { ...item.extra }
            extra[key] = value
            item.extra = extra
          } else {
            item[key] = value
          }
          return item
        }
        return item
      })
      this.setControls(controls)
    },
    // 组件拖拽时将新的transform同步到属性编辑器中，并在end事件中进行一次数据同步
    handleTransform({ transform, type }) {
      this.controlled = { ...this.controlled, ...transform }
      if (['resizeend', 'dragend', 'rotateend'].includes(type)) {
        this.updateControlValue(this.currentId, 'transform', transform)
      }
    },
    updateControlStatus(id) {
      let controls = this.controls.map((item) => {
        if (item.id == id) {
          return { ...item, active: true }
        } else if (item.active) {
          return { ...item, active: false }
        }
        return item
      })
      this.setControls(controls)
    },
    //  组件选中，需要将之前选中的组件设置为未选中状态
    handleSelect(control) {
      this.setCurrentControl(control)
      this.updateControlStatus(control.id)
    },
    setCurrentControl(control) {
      // 后退时可能没得了
      if (!control || !control.id) {
        this.controlled = {}
        this.currentId = ''
        return
      }
      // 深度拷贝数据，避免数据引用污染
      control = JSON.parse(JSON.stringify(control))
      Object.assign(control, control.transform, { active: true })
      this.controlled = control
      this.currentId = control.id
    },

    // 属性编辑器变化后同步到组件中
    handleChange({ type, name, value, checked, extra }) {
      if (extra) {
        this.controlled.extra[name] = value
      } else {
        this.controlled[name] = value
      }

      // 注意节流优化提升性能
      this.updateControlValue(this.currentId, name, type === 'checkbox' ? checked : value, extra)
    },
    getActiveComponent(ctls) {
      return ctls.find((item) => item.active)
    },
    setControls(controls) {
      this.controls = controls
      historys.push(this.controls)
    },

    // Actions
    handleUndo() {
      if (historys.length == 0) return
      let last = historys.pop()
      redoHistorys.push(last)
      this.controls = historys[historys.length - 1] || []
      this.setCurrentControl(this.getActiveComponent(this.controls))
    },
    handleDelete() {
      if (!this.currentId) {
        return
      }
      let controls = this.controls.filter((item) => item.id !== this.currentId)
      this.setControls(controls)
      this.setCurrentControl(null)
    },
    handleClear() {
      this.setControls([])
      this.controlled = {}
      this.currentId = ''
    },

    handleRedo() {
      if (redoHistorys.length === 0) return
      let contrls = redoHistorys.pop()
      this.setControls(contrls)
      this.setCurrentControl(this.getActiveComponent(contrls))
    },
  },
  created() {
    // 使用独立的事件对象来处理，避免多层透传回调函数
    this.eventbus.$on(EVENT_COMPONENT_ADD, this.addControl)
    this.eventbus.$on(EVENT_COMPONENT_SELECT, this.handleSelect)
    this.eventbus.$on(EVENT_COMPONENT_TRANSFORM, this.handleTransform)
  },
  render() {
    return (
      <div class="app">
        <HeaderVue
          onUndo={this.handleUndo}
          onRedo={this.handleRedo}
          onClear={this.handleClear}
          onDelete={this.handleDelete}
        />
        <div class="content">
          <ComponentsVue />
          <EditorViewVue value={this.controls} />
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
</style>
