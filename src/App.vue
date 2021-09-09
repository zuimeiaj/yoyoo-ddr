<script>
import ControlsWrapperVue from './ControlsWrapper.vue'
let k = 0
export default {
  name: 'app',
  data() {
    return {
      inputs: [
        { type: 'number', name: 'x' },
        { type: 'number', name: 'y' },
        { type: 'number', name: 'width' },
        { type: 'number', name: 'height' },
        { type: 'number', name: 'rotation' },
        { type: 'number', name: 'minWidth' },
        { type: 'number', name: 'minHeight' },
        { type: 'checkbox', name: 'acceptRatio' },
        { type: 'checkbox', name: 'draggable' },
        { type: 'checkbox', name: 'resizable' },
        { type: 'checkbox', name: 'rotatable' },
        { type: 'checkbox', name: 'active' },
        { type: 'checkbox', name: 'parent' },
      ],
      controls: [],
      currentId: '',
      controlled: {},
    }
  },
  created() {
    // 2000个组件勉强还能拖动 😓
    let controls = []
    let size = 50
    let space = 20
    for (let i = 1; i < 50; i++) {
      for (let j = 1; j < 40; j++) {
        controls.push({
          transform: {
            x: j * size + space * j,
            y: i * size + space * i,
            width: size,
            height: size,
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
          id: String(k++),
          resizeHandler: ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'l', 'bl'],
        })
      }
    }
    this.controls = controls
    this.beforeActive(this.controls[0].id)
  },
  methods: {
    addControl() {
      this.controls = this.controls.concat([
        {
          id: String(k++),
          transform: {
            x: Math.floor(Math.random() * 800 + 10),
            y: Math.floor(Math.random() * 400 + 10),
            width: Math.floor(Math.random() * 100 + 50),
            height: Math.floor(Math.random() * 100 + 50),
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
        },
      ])
    },
    updateControlValue(id, key, value) {
      this.controls = this.controls.map((item) => {
        if (item.id === id) {
          if (['x', 'y', 'width', 'height', 'rotation'].includes(key)) {
            item = { ...item }
            let transform = { ...item.transform }
            transform[key] = value
            item.transform = transform
            return item
          }
          return { ...item, [key]: value }
        }
        return item
      })
    },
    handleTransform(newTransform, handleType) {
      this.controlled = { ...this.controlled, ...newTransform }
      // 仅在结束时将数据同步
      if (['resizeend', 'dragend', 'rotateend'].includes(handleType)) {
        this.updateControlValue(this.currentId, 'transform', newTransform)
      }
    },
    updateControlStatus(id) {
      this.controls = this.controls.map((item) => {
        if (item.id == id) {
          return { ...item, active: true }
        } else if (item.active) {
          return { ...item, active: false }
        }
        return item
      })
    },
    beforeActive(id) {
      let control = this.controls.find((item) => item.id === id)
      this.controlled = { ...control, ...control.transform, active: true }
      this.currentId = id
      this.updateControlStatus(id)
      return true
    },
    handleSelect(value) {
      this.list = this.list.map((item) => {
        if (item.id == value.id) {
          return { ...item, num: item.num + 1 }
        }
        return item
      })
    },
    handleChange(e) {
      let type = e.target.dataset.type
      let name = e.target.dataset.name
      this.controlled[name] = e.target.value
      // 注意节流优化提升性能
      this.updateControlValue(this.currentId, name, type === 'checkbox' ? e.target.checked : +e.target.value)
    },
  },
  render() {
    return (
      <div id="app">
        <div class="columns">
          <h1 class="header">
            <span>轻量级无依赖、可拖拽、缩放、旋转的vue组件</span>
            <span>
              渲染 <strong>2000</strong> 个组件 选中第{this.currentId}个
            </span>
            <button class="button" onClick={this.addControl}>
              添加控件
            </button>
          </h1>
          <ControlsWrapperVue
            onTransform={this.handleTransform}
            beforeActive={this.beforeActive}
            value={this.controls}
          />
          <footer class="footer">
            <a target="_blank" href="https://zuimeiaj.github.io/yoyoo/">
              可视化编辑器
            </a>
            <a target="_blank" href="https://vivw.org/">
              前端社区
            </a>
            <a target="_blank" href="https://github.com/zuimeiaj/yoyoo-ddr">
              Github
            </a>
          </footer>
        </div>
        <div class="inspector">
          {this.inputs.map((item) => {
            return (
              <div class="input-item" key={item.name}>
                <label class="input-label">{item.name}</label>
                <input
                  data-type={item.type}
                  data-name={item.name}
                  onInput={this.handleChange}
                  class="input-value"
                  type={item.type}
                  checked={this.controlled[item.name]}
                  value={this.controlled[item.name]}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  height: 100vh;
}

.button {
  padding: 6px 24px;
  font-size: 14px;

  border: 1px solid #d3d3d3;
  color: #353535;
}
.button:hover {
  background: #ccc;
}
.columns {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.columns .header {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
  height: 60px;
  line-height: 60px;
  padding-left: 25px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  display: flex;
  justify-content: space-between;
}

.columns .content {
  flex: 1;
  position: relative;
  overflow: scroll;
}

.cell {
  position: absolute;
  background: #f5f5f5;
  border: 1px solid #d3d3d3;
  width: 100%;
  height: 100%;
  cursor: move;
  user-select: none;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.inspector {
  width: 260px;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
}

.input-item {
  display: flex;
  padding: 0px 10px;
  margin-top: 10px;
  font-size: 14px;
}

.input-item input {
  padding-left: 8px;
  height: 24px;
  font-size: 14px;
  border-radius: 0;
  border: 1px solid #d3d3d3;
}

.input-label {
  flex: 1;
}

.input-value {
  display: inline-block;
  width: 120px;
}

.footer {
  font-size: 14px;
  font-weight: bold;
  padding: 15px 15px;
  padding-left: 10px;
}

.footer a {
  margin-right: 20px;
  color: #666;
  text-decoration: none;
}

@media screen and (max-width: 600px) {
  .footer a {
    color: #989898;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
  }

  .inspector {
    width: 140px;
  }

  .input-item {
    padding: 0 5px;
  }

  .input-label {
    font-size: 14px;
  }

  .input-value {
    font-size: 14px;
    width: 70px;
  }
}
</style>
