
### 安装

```
npm i yoyoo-ddr --save
```

### 更新日志

优化大数组渲染时的性能问题

### [ v0.4 ] - 2021-09-09

- 添加ID参数，配合数组渲染时使用beforeActive获取当前选中的组件
- 添加 beforeActive 函数参数。 此函数传入组件 ID 并返回一个布尔值。 当返回值为true时，组件会忽略active属性，让组件立即可用
- 添加renderContent函数参数，单个组件渲染时可以直接用slot的方式，数组渲染时建议使用该函数返回子节点
- 将template 改为render方式

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
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onResize={this.onResize}
        onResizeStart={this.onResizeStart}
        onResizeEnd={this.onResizeEnd}
        onRotate={this.onResize}
        onRotateStart={this.onRotateStart}
        onRotateEnd={this.onRotateEnd}
        value={this.transform}
        id={'cell-id'}
        beforeActive={this.beforeActive}
        renderContent={this.renderContent}
      />
    )
  },
}


单组件使用时可直接使用slot的方式
<DDR>
  <CustomChild></CustomChild>
</DDR>

参数 id、beforeActive、renderContent是专为大数组渲染时提供的

</DDR> 
```

### 特色

- 轻量级，无任何依赖
- 可配置拖拽、旋转、缩放、支持大数组渲染

### 注意事项

- 如果使用了 `transform:scale(2)` 会导致位置不对问题
- 基于vue 2 开发，不支持vue3
- parent属性目前仅支持拖拽
- 父容器如果使用了overflow scroll 也会导致拖拽位置问题


### 属性

| 名称          | 类型      | 默认值                                      | 描述                                                                           |
| ------------- | -------- | ----------------------------------------- | ----------------------------------------------------------------------------------------
| draggable     | boolean  | true                                      | 是否可拖拽                                                                       |
| rotatable     | boolean  | true                                      | 是否可旋转                                                                       |
| resizable     | boolean  | true                                      | 是否可缩放                                                                       |
| active        | boolean  | true                                      | 是否可用，                                                                       |
| acceptRatio   | boolean  | false                                     | 纵横比，单词拼写错误。但是发现太晚了,所以就这样吧                                      |
| parent        | boolean  | false                                     | 限制在父容器内拖拽，仅拖拽时才会判断                                                 |
| resizeHandler | Array    | ['tl','tm','tr','r','br','bm','l','bl']   | 定义缩放控制点                                                                    |
| minWidth      | number   | 1                                         | 可缩放的最小宽度                                                                  |
| minHeight     | number   | 1                                         | 可缩放最小高度                                                                    |
| value         | Object   | {x:0,y:0,width:100,height:100,rotation:0} | 位置，注意该参数并不是双向绑定的不支持v-model，但能响应value的更新                       |
| id            | string   | undefined                                 | 数组方式渲染时增加的参数，提高性能                                                    |
| beforeActive  | Function | ()=> false                                | 数组方式渲染时增加的参数，当元素被点击时会调用该函数并传入id                              |
| renderContent | Function | ()=> VNode                                | 数组方式渲染时增加的参数，用于渲染自定义子节点，如果是单个组件使用直接用 slot就行了           |

### 事件

拖拽、旋转、缩放时会触发一系列事件，该事件都会传入两个参数，第一个参数为原始的事件对象，第二个参数为当前组件的位置信息。


| name        | args                          |
| ----------- | ----------------------------- |
| dragStart   | (event,transform)=>{} :void 0 |
| drag        | (event,transform)=>{} :void 0 |
| dragEnd     | (event,transform)=>{} :void 0 |
| rotateStart | (event,transform)=>{} :void 0 |
| rotate      | (event,transform)=>{} :void 0 |
| rotateEnd   | (event,transform)=>{} :void 0 |
| resizeStart | (event,transform)=>{} :void 0 |
| resize      | (event,transform)=>{} :void 0 |
| resizeEnd   | (event,transform)=>{} :void 0 |
  
### 链接

 [ 在线演示 https://zuimeiaj.github.io/ddr/ ](https://zuimeiaj.github.io/ddr/)

 [ 设计工具，使用react实现的 http://zuimeiaj.github.io/yoyoo/](http://zuimeiaj.github.io/yoyoo/)

### License

The MIT License (MIT). Please see [License File](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/LICENSE) for more information.
