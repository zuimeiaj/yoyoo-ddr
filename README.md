<p align='center'>
  <img style="150px" height="150px" src="https://github.com/zuimeiaj/yoyoo-ddr/blob/master/src/assets/vue-drag-resize-rotate.jpg"/>
</p>

<p align='center'>
Draggable, rotatable and resizable components based on Vue (2 & 3)
</p>

### [English document](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/ENGLISH-DOC.md)

### 安装-vue 2 [![NPM Version](https://img.shields.io/npm/v/yoyoo-ddr.svg?style=flat)](https://www.npmjs.com/package/yoyoo-ddr)

```
npm i yoyoo-ddr --save
```

### 安装-vue 3 [![NPM Version](https://img.shields.io/npm/v/yoyoo-ddr-vue3.svg?style=flat)](https://www.npmjs.com/package/yoyoo-ddr-vue3)

```
npm i yoyoo-ddr-vue3 --save
```

### 单个组件使用

[Example](https://zuimeiaj.github.io/ddr/#/twowaybind)

```javascript
import DDR from 'yoyoo-ddr'
import 'yoyoo-ddr/dist/yoyoo-ddr.css'

// vue 3
// import DDR from 'yoyoo-ddr-vue3'
// import 'yoyoo-ddr-vue3/dist/yoyoo-ddr-vue3.css'

export default {
  data() {
    return {
      transform: { x: 100, y: 100, width: 100, height: 100, rotation: 0 },
    }
  },
  render() {
    // vue 3 使用 v-model:value={this.transform}
    return (
      <DDR v-model={this.transform}>
        <div style="background:red;width:100%;height:100%">x={this.transform.x}</div>
      </DDR>
    )
  },
}
```

### 在数组中使用

```javascript
export default {
  data() {
    return {
      list: [
        { id: 1, active: false, transform: { x: 100, y: 100, width: 100, height: 100, rotation: 0 } },
        { id: 2, active: false, transform: { x: 200, y: 100, width: 100, height: 100, rotation: 0 } },
        { id: 3, active: false, transform: { x: 300, y: 100, width: 100, height: 100, rotation: 0 } },
        { id: 4, active: false, transform: { x: 400, y: 100, width: 100, height: 100, rotation: 0 } },
      ],
    }
  },
  methods: {
    handleActive(id) {
      // 如果active属性和该函数的返回值都为false时，组件不会响应鼠标操作
      // 将数组内对应id的数据同步为true
      this.list = this.list.map((item) => {
        if (item.id === id) {
          item = { ...item, active: true }
        } else if (item.active) {
          item = { ...item, active: false }
        }
        return item
      })
      return true
    },
    renderChild(item) {
      return <div style="background:red;width:100%;height:100%">Child {item.id}</div>
    },
  },
  render() {
    return (
      <div>
        {this.list.map((item) => {
          // 如果直接使用slot插入子组件的方式会导致全量更新
          // 可以使用 renderContent 函数，或者在对DDR组件进行一次包装来解决更新问题
          return (
            <DDR
              beforeActive={this.handleActive}
              active={item.active}
              key={item.id}
              id={item.id}
              value={item.transform}
              renderContent={this.renderChild}
            />
          )
        })}
      </div>
    )
  },
}
```

### value 单向数据流

```javascript
export default {
  data() {
    return {
      transform: { x: 100, y: 100, width: 100, height: 100, rotation: 0 },
    }
  },
  methods: {
    handleDrag(event, transform) {
      this.transform = transform
    },
    handleResize(event, transform) {
      this.transform = transform
    },
    handleRotate(event, transform) {
      this.transform = transform
    },
  },
  render() {
    // 当组件被拖动时transform的值并不会同步。如果要同步，需要监听事件来同步。
    // 在大数组渲染下，建议在拖拽结束后进行一次数据同步。可参考Demo项目的数据同步
    return (
      <DDR onResize={this.handleResize} onRotate={this.handleRotate} onDrag={this.handleDrag} value={this.transform}>
        <div style="background:red;width:100%;height:100%">child</div>
      </DDR>
    )
  },
}
```

### 特色

- 轻量级，无任何依赖
- 可配置拖拽、旋转、缩放、网格对齐、限制父元素内移动、固定坐标轴移动、等比例缩放

### 注意事项

- 如果容器使用了 `transform:scale(2)` 会导致组件的位置错误
- 基于 vue 2 开发，不支持 vue3
- 容器如果使用了 overflow scroll 也会导致组件拖拽时的位置错误

### 属性

| 名称          | 类型     | 默认值                                    | 描述                                                                                 |
| ------------- | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| draggable     | boolean  | true                                      | 是否可拖拽                                                                           |
| rotatable     | boolean  | true                                      | 是否可旋转                                                                           |
| resizable     | boolean  | true                                      | 是否可缩放                                                                           |
| active        | boolean  | true                                      | 是否可用，                                                                           |
| acceptRatio   | boolean  | false                                     | 纵横比，单词拼写错误。但是发现太晚了,所以就这样吧                                    |
| parent        | boolean  | false                                     | 限制在父容器内拖拽，支持拖动和缩放，旋转角度大于 0 不会判断                          |
| resizeHandler | Array    | ['tl','tm','tr','r','br','bm','l','bl']   | 定义缩放控制点                                                                       |
| handlerSize   | number   | 11                                        | 定义缩放控制点                                                                       |
| minWidth      | number   | 1                                         | 可缩放的最小宽度                                                                     |
| minHeight     | number   | 1                                         | 可缩放最小高度                                                                       |
| maxWidth      | number   | 100000000                                 | 可缩放最大宽度                                                                       |
| maxHeight     | number   | 100000000                                 | 可缩放最大高度                                                                       |
| value         | Object   | {x:0,y:0,width:100,height:100,rotation:0} | 位置，注意该参数并不是双向绑定的不支持 v-model，但能响应 value 的更新                |
| grid          | Array    | [1,1]                                     | 格式[x,y]，支持拖动和缩放对齐。只能为整数                                            |
| axis          | String   | 'xy'                                      | 指定坐标轴拖动，默认 xy 都可以拖动，仅支持拖动                                       |
| id            | string   | undefined                                 | 数组方式渲染时增加的参数，提高性能                                                   |
| beforeActive  | Function | ()=> false                                | 数组方式渲染时增加的参数，当元素被点击时会调用该函数并传入 id                        |
| renderContent | Function | ()=> VNode                                | 数组方式渲染时增加的参数，用于渲染自定义子节点，如果是单个组件使用直接用 slot 就行了 |

### 自定义 class 样式

- 拖动状态： `ddr-ready-drag` 鼠标按下,准备拖动时的 class。`ddr-dragging` 拖动时的 class
- 缩放状态： `ddr-ready-resize` 鼠标按下，准备缩放时的 class。`ddr-resizing` 缩放时的 class
- 旋转状态： `ddr-ready-rotate` 鼠标按下，准备旋转时的 class。`ddr-rotating` 旋转时的 class
- 选中状态： `active` 组件选中时的 class

### 事件

拖拽、旋转、缩放时会触发一系列事件，该事件都会传入两个参数，第一个参数为原始的事件对象，第二个参数为当前组件的位置信息。

| name        | args                          |
| ----------- | ----------------------------- |
| dragstart   | (event,transform)=>{} :void 0 |
| drag        | (event,transform)=>{} :void 0 |
| dragend     | (event,transform)=>{} :void 0 |
| rotatestart | (event,transform)=>{} :void 0 |
| rotate      | (event,transform)=>{} :void 0 |
| rotateend   | (event,transform)=>{} :void 0 |
| resizestart | (event,transform)=>{} :void 0 |
| resize      | (event,transform)=>{} :void 0 |
| resizeend   | (event,transform)=>{} :void 0 |

### 链接

- [在线演示](https://zuimeiaj.github.io/ddr/)

- [更新日志](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/CHANGELOG.md)

### Demo 项目目前已实现的功能，且在不停的更新中

- [x] 可以自定义组件，在目录 `src/examples/vseditor/component-impl.js`中增加实现并导出。 components.vue 中添加对应的类型即可。
- [x] 可自定义组件属性编辑器 在目录 `src/examples/vseditor/prop-inspector.vue` 中添加对应的类型并实现即可
- [x] 可从组件列表中拖拽组件到编辑区域进行编辑
- [x] 支持嵌套组件，`component-impl.js` 中的 `Container` 组件实际包含了一个`editor-view`组件，可无限嵌套
- [x] 编辑器区域的其他功能将以插件的形式提供，方便功能管理
- [x] 支持历史记录回退，组件删除和画布清除等
- [x] 支持编辑器区域框选功能
- [x] 完善编辑器区域的框选功能，需要实现组件的批量更新
- [ ] 持续重构代码，通常情况都是先实现再做优化。
- [ ] 增加快捷键功能，如：删除，复制，添加副本，剪切，粘贴等
- [ ] 增加 canvas 组件，可生成简单的图形，如 曲线、和其他图形等。

> 该项目会一直不停的完善，其目的主要是通过大量的项目实践给 `yoyoo-ddr` 增加一些有用的功能，使他尽可能满足大部分场景的需求。

### 联系我

如果在使用该组件时遇到问题，可以加 QQ(2498683974)联系我。欢迎提出宝贵意见和建议

### License

The MIT License (MIT). Please see [License File](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/LICENSE) for more information.
