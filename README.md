# yoyoo-ddr

#### [ Online demo ](https://zuimeiaj.github.io/ddr/)

#### [ Online application ](http://zuimeiaj.github.io/yoyoo/)

#### [ Online application source code ](https://github.com/zuimeiaj/yoyoo-starter)

#### [ Community ](https://vivw.org/)

### Installation

```
npm i yoyoo-ddr --save
```

### Changelog

Optimize performance issues when array loop rendering

### [ v0.4 ] - September 9, 2021

- Add the ID parameter, and use beforeActive to get the currently selected component when cooperating with the array loop rendering
- Add the beforeActive function parameter. This function passes in the component ID and returns a boolean value. When the return value is true, the component will ignore the active attribute and make the component available immediately
- Add the renderContent function, which passes in the current component instance and returns a dom tree, which is used to customize the content of the rendering component and replace the "<slot>" method when the array is rendered in a loop
- Modify template to render function
- Rendering 2000 components at a time barely works normally 

### Usage

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
```

### Features

- Lightweight and no dependencies
- Draggable, resizable, rotatable, configurable
- Define handles for resizing
- Support aspect ratio
- Support parent element boundary limit
- Keep the most streamlined functions, strong scalability
- Can be customized according to your own needs

### Tips

This component cannot be used normally in the following scenarios

`transform:scale(2)`

### Props

| name          | type     | default                                   | desc                                                                                                                                                   |
| ------------- | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| draggable     | boolean  | true                                      | Whether the component can be dragged                                                                                                                   |
| rotatable     | boolean  | true                                      | Whether the component can be rotated                                                                                                                   |
| resizable     | boolean  | true                                      | Whether the component can be resized                                                                                                                   |
| active        | boolean  | true                                      | Whether the component is selected, it can only be operated after it is selected                                                                        |
| acceptRatio   | boolean  | false                                     | Set to true or hold down the shift key, it will scale proportionally                                                                                   |
| parent        | boolean  | false                                     | When set to true, it will be restricted to move in the parent element. currently only works on dragging, and it is planned to provide support for rotation and resizing in future versions                                                                                  |
| resizeHandler | Array    | ['tl','tm','tr','r','br','bm','l','bl']   | Set the direction that can be resized                                                                                                                  |
| minWidth      | number   | 1                                         | Minimum width                                                                                                                                          |
| minHeight     | number   | 1                                         | Minimum height                                                                                                                                         |
| value         | Object   | {x:0,y:0,width:100,height:100,rotation:0} | Controls the position, size, and rotation of components                                                                                                |
| id            | string   | undefined                                 | This id is passed through the beforeActive function when the array is rendered in a loop, and is used to obtain the component currently being dragged. |
| beforeActive  | Function | ()=> false                                | When the function returns true, it ignores active and can be dragged immediately                                                                       |
| renderContent | Function | ()=> VNode                                | When the array is rendered in a loop, it is used to replace the slot slot to customize the content of the component                                    |

### Events

The parameter event is the component's native event object

The parameter transform is the position and rotation angle of the component

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

### License

The MIT License (MIT). Please see [License File](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/LICENSE) for more information.
