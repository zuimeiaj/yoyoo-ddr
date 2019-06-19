# yoyoo-ddr


### Installation
```
npm i yoyoo-ddr --save
```


### Usage
```javascript

import DDR from 'yoyoo-ddr'

<DDR :draggable="true"
     :rotatable="true"
     :resizable="true"
     :accept-ratio="false"
     :resize-handler="['tl','tm','tr','r','br','bm','l','bl']"
     :min-width="10"
     :min-height="10"
     :active="true"
     @drag-start="handleDragStart"
     @drag="handleDrag"
     @drag-end="handleDragEnd"
     @resize-start="handleResizeStart"
     @resize="handleResize"
     @resize-end="handleResizeEnd"
     @rotate-start="handleRotateStart"
     @rotate="handleRotate"
     @rotate-end="handleRotateEnd">
    <div class="cell"></div>
</DDR>
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

