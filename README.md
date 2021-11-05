### 安装

```
npm i yoyoo-ddr --save
```

### 更新日志

### [ v0.5.3] - 2021-11-03

- 优化组件在嵌套下存在样式污染的问题

### [ v0.5.2] - 2021-11-03

- parent 属性支持在缩放时进行限制。但如果组件旋转角度大于 0 会忽略该属性

### [ v0.5 ] - 2021-11-02

增加新的功能

- 新增组件在各个状态时的 class，方便定义不同状态下的样式
- 移除了组件 style 标签的 scoped 标识，方便外部自定义样式
- 新增 axis 属性，可选值为 x 或者 y，默认为 xy。该属性仅支持拖动
- 新增 grid 属性，格式为[x,y]，默认为[1,1]。该属性支持拖动和缩放

### [ v0.4.1] - 2021-10-30

修改 render 函数下不能正确触发事件

- 修改事件名称改为全小写 ，例如 dragStart 修改为 dragstart，使用 render 函数时用 onDragstart 监听事件。

### [ v0.4 ] - 2021-09-09

优化大数组渲染时的性能问题

- 添加 ID 参数，配合数组渲染时使用 beforeActive 获取当前选中的组件
- 添加 beforeActive 函数参数。 此函数传入组件 ID 并返回一个布尔值。 当返回值为 true 时，组件会忽略 active 属性，让组件立即可用
- 添加 renderContent 函数参数，单个组件渲染时可以直接用 slot 的方式，数组渲染时建议使用该函数返回子节点
- 将 template 改为 render 方式

### 使用

```javascript
import DDR from 'yoyoo-ddr'
import 'yoyoo-ddr/dist/yoyoo-ddr.css'

export default {
  data() {
    return {
      transform: { x: 100, y: 100, width: 100, height: 100, rotation: 0 },
      active: true,
      rotatable: true,
      draggalbe: true,
      resizable: true,
      parent: false,
      resizeHandler: ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'bl', 'l'],
      minWidth: 10,
      minHeight: 10,
      acceptRatio: false,
    }
  },
  methods: {
    onDrag(event, transform) {},
    onDragStart(envent, transform) {},
    onDragEnd(event, transform) {},

    onResize(event, transform) {},
    onResizeStart(event, transform) {},
    onResizeEnd(event, transform) {},

    onRotate(event, transform) {},
    onRotateStart(event, transform) {},
    onRotateEnd(event, transform) {},

    beforeActive(id) {
      // cell-id
      return true
    },

    renderContent(cell) {
      // cell instance of DDR
      return <div class="cell" style="width:100%;height:100%;background:red" />
    },
  },
  render() {
    return (
      <DDR
        active={this.active}
        draggable={this.draggable}
        resizable={this.resizable}
        rotatable={this.rotatable}
        parent={this.parent}
        minWidth={this.minWidth}
        minHeight={this.minHeight}
        acceptRatio={this.acceptRatio}
        onDrag={this.onDrag}
        onDragstart={this.onDragStart}
        onDragend={this.onDragEnd}
        onResize={this.onResize}
        onResizestart={this.onResizeStart}
        onResizesnd={this.onResizeEnd}
        onRotate={this.onResize}
        onRotatestart={this.onRotateStart}
        onRotateend={this.onRotateEnd}
        value={this.transform}
        id={'cell-id'}
        beforeActive={this.beforeActive}
        renderContent={this.renderContent}
      />
    )
  },
}
```

```html
<!-- 单组件使用时可直接使用slot的方式 -->
<DDR>
  <CustomChild></CustomChild>
</DDR>
<!-- 参数 id、beforeActive、renderContent是专为大数组渲染时提供的 -->
```

### 特色

- 轻量级，无任何依赖
- 可配置拖拽、旋转、缩放、支持大数组渲染

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
| minWidth      | number   | 1                                         | 可缩放的最小宽度                                                                     |
| minHeight     | number   | 1                                         | 可缩放最小高度                                                                       |
| value         | Object   | {x:0,y:0,width:100,height:100,rotation:0} | 位置，注意该参数并不是双向绑定的不支持 v-model，但能响应 value 的更新                |
| grid          | Array    | [1,1]                                     | 格式[x,y]，支持拖动和缩放对齐。只能为整数                                            |
| axis          | String   | 'xy'                                      | 指定坐标轴拖动，默认 xy 都可以拖动，仅支持拖动                                       |
| id            | string   | undefined                                 | 数组方式渲染时增加的参数，提高性能                                                   |
| beforeActive  | Function | ()=> false                                | 数组方式渲染时增加的参数，当元素被点击时会调用该函数并传入 id                        |
| renderContent | Function | ()=> VNode                                | 数组方式渲染时增加的参数，用于渲染自定义子节点，如果是单个组件使用直接用 slot 就行了 |

### 各个状态下的 class 定义

- 拖动： `ddr-ready-drag` 鼠标按下,准备拖动时的 class。`ddr-dragging` 拖动时的 class
- 缩放： `ddr-ready-resize` 鼠标按下，准备缩放时的 class。`ddr-resizing` 缩放时的 class
- 旋转： `ddr-ready-rotate` 鼠标按下，准备旋转时的 class。`ddr-rotating` 旋转时的 class
- 选中： `active` 组件选中时的 class

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

[ 在线演示 https://zuimeiaj.github.io/ddr/ ](https://zuimeiaj.github.io/ddr/)

### Demo 项目目前已实现的功能，且在不停的更新中

- [x] 可以自定义组件，在目录 `src/examples/vseditor/component-impl.js`中增加实现并导出。 components.vue 中添加对应的类型即可。
- [x] 可自定义组件属性编辑器 在目录 `src/examples/vseditor/prop-inspector.vue` 中添加对应的类型并实现即可
- [x] 可从组件列表中拖拽组件到编辑区域进行编辑
- [x] 支持嵌套组件，`component-impl.js` 中的 `Container` 组件实际包含了一个`editor-view`组件，可无限嵌套
- [x] 编辑器区域的其他功能将以插件的形式提供，方便功能管理
- [x] 支持历史记录回退，组件删除和画布清除等
- [x] 支持编辑器区域框选功能
- [ ] 持续重构代码，通常情况都是先实现再做优化。
- [x] 完善编辑器区域的框选功能，需要实现组件的批量更新
- [ ] 增加快捷键功能，如：删除，复制，添加副本，剪切，粘贴等
- [ ] 增加 canvas 组件，可生成简单的图形，如 曲线、和其他图形等。

> 该项目会一直不停的完善，其目的主要是通过大量的项目实践给 `yoyoo-ddr` 这个组件增加一些有用的功能，使之尽可能满足大部分场景的需求。

### License

The MIT License (MIT). Please see [License File](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/LICENSE) for more information.
