# yoyoo-ddr

#### [ Online demo ](https://zuimeiaj.github.io/ddr/)

#### [ Online application ](https://yoyoo.vivw.org/)

#### [ Online application source code ](https://github.com/zuimeiaj/yoyoo-starter)

#### [ Community ](https://vivw.org/)

### Installation

```
npm i yoyoo-ddr --save
```

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
      parent:false,
      resizeHandler:["tl","tm","tr","r","br","bm","bl","l"],
      minWidth:10,
      minHeight:10,
      acceptRatio:false
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
      >
        <div style="width:100%;height:100%;background:red" />
      </DDR>
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

| name          | type    | default                                   | desc                                                                            |
| ------------- | ------- | ----------------------------------------- | ------------------------------------------------------------------------------- |
| draggable     | boolean | true                                      | Whether the component can be dragged                                            |
| rotatable     | boolean | true                                      | Whether the component can be rotated                                            |
| resizable     | boolean | true                                      | Whether the component can be resized                                            |
| active        | boolean | true                                      | Whether the component is selected, it can only be operated after it is selected |
| acceptRatio   | boolean | false                                     | Set to true or hold down the shift key, it will scale proportionally            |
| parent        | boolean | false                                     | When set to true, it will be restricted to move in the parent element           |
| resizeHandler | Array   | ['tl','tm','tr','r','br','bm','l','bl']   | Set the direction that can be resized                                           |
| minWidth      | number  | 1                                         | Minimum width                                                                   |
| minHeight     | number  | 1                                         | Minimum height                                                                  |
| value         | Object  | {x:0,y:0,width:100,height:100,rotation:0} | Controls the position, size, and rotation of components                         |

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
