# yoyoo-ddr

### [Demo](https://zuimeiaj.github.io/ddr/)
### [App](https://zuimeiaj.github.io/yoyoo/)


### Installation
```
npm i yoyoo-ddr --save
```


### Usage
```javascript

import DDR from 'yoyoo-ddr'
import 'yoyoo-ddr/dist/yoyoo-ddr.css'

export default {
    data(){
        return {
            transform:{x:100,y:100,width:100,height:100,rotation:0}
        }
    },
    render(){
        return (
            <DDR value={this.transform}>
                <div style="width:100%;height:100%;background:red"></div>
            </DDR>
        )
    }
}

```

### Props

name | type | default | desc
---- | ---   | --- | ---
draggable | boolean | true | Whether the component can be dragged |
rotatable | boolean | true | Whether the component can be rotated |
resizable | boolean | true | Whether the component can be resized |
active | boolean | true | Whether the component is selected, it can only be operated after it is selected|
acceptRatio | boolean | false  | Whether to limit the ratio when resizing
resizeHandler | Array | ['tl','tm','tr','r','br','bm','l','bl']|Set the direction that can be resized
minWidth | number | 1 | Minimum width
minHeight | number | 1| Minimum height
value | Object | {x:0,y:0,width:100,height:100,rotation:0} | Controls the position, size, and rotation of components

### Events
The parameter event is the component's native event object

The parameter transform is the position and rotation angle of the component

name | args
---|---
dragStart | (event,transform)=>{} :void 0
drag | (event,transform)=>{} :void 0
dragEnd | (event,transform)=>{} :void 0
rotateStart | (event,transform)=>{} :void 0
rotate | (event,transform)=>{} :void 0
rotateEnd | (event,transform)=>{} :void 0
resizeStart | (event,transform)=>{} :void 0
resize | (event,transform)=>{} :void 0
resizeEnd | (event,transform)=>{} :void 0










### License
MIT

