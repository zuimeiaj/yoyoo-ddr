### Install (vue2)

```
npm i yoyoo-ddr-vue2 --save
```

### Install (vue3)

```
npm i yoyoo-ddr-vue3-ts --save
```

### Install (react)

```
npm i yoyoo-ddr-react --save
```

### Usage vue2

Two-way data binding(v-model)

```js
import DDR from 'yoyoo-ddr-vue2'
import 'yoyoo-ddr-vue2/dist/yoyoo-ddr.css'

export default {
  data() {
    return {
      transform: { x: 100, y: 100, width: 100, height: 100, rotation: 0 },
    }
  },
  render() {
    return (
      <DDR v-model={this.transform}>
        <div style="background:red;width:100%;height:100%">x={this.transform.x}</div>
      </DDR>
    )
  },
}
```

### Usage vue3

Two-way data binding(v-model)

```ts
import DDR from 'yoyoo-ddr-vue3-ts'
import 'yoyoo-ddr-vue3-ts/dist/style.css'
import { defineComponent, ref } from 'vue'
import { TransformProps } from 'yoyoo-ddr-vue3-ts/dist/type'

export default defineComponent({
  setup() {
    const t = ref < TransformProps > ({ x: 100, y: 100, width: 100, height: 100, rotation: 0 })
    return () => {
      return (
        <div style={'width:100%;height:100%'}>
          <DDR
            axis="x"
            minHeight={20}
            minWidth={20}
            maxWidth={200}
            maxHeight={200}
            parent={true}
            grid={[10, 10]}
            v-model:value={t.value}
          >
            <div style={{ width: '100%', height: '100%', background: 'red' }}>
              <div>x= {t.value.x}</div>
              <div>y= {t.value.y}</div>
              <div>w= {t.value.width}</div>
              <div>h= {t.value.height}</div>
            </div>
          </DDR>
          <button onClick={() => (t.value.x += 100)}> to right</button>
        </div>
      )
    }
  },
})
```

### Usage react

```ts
import DDR from 'yoyoo-ddr-react'
import 'yoyoo-ddr-react/dist/style.css'

import { useState } from 'react'
import { TransformProps } from 'yoyoo-ddr-react/dist/type'

function App() {
  const [transform, setTransform] = useState<TransformProps>({ x: 100, y: 100, width: 100, height: 100, rotation: 0 })
  return (
    <>
      <DDR onChange={(_, t) => setTransform(t)} value={transform} parent={true} grid={[10, 10]}>
        <div style={{ background: 'red', width: '100%', height: '100%' }}>
          x={transform.x},y={transform.y},w={transform.width},h={transform.height},r={transform.rotation}
        </div>
      </DDR>
    </>
  )
}
```

### Features

- Lightweight, no third-party dependencies
- Configurable drag, rotation, resize, snap to grid , limit movement within the parent element, fixed coordinate axis movement, etc.

### Possible problems

- If the container uses `overflow:scroll`, it will also cause the component to be in the wrong position when dragging.

### Props

#### value(v-model)

Type: `Object`<br>
Defaults: `{x:0,y:0,width:100,height:100,rotation:0}`<br>
Required: `true`<br>

One-way data flow. The position, rotation angle, size of the component. make sure the parent container is set to position=relative|absolute|fixed

- x: Left of parent side,will add `left={x}px` to Dom
- y: Top of parent side,will add `top={y}px`to Dom
- width: Width of the component,will add `width={x}px`to Dom
- height: Height of the component, will add `height={x}px` to Dom
- rotation: Rotation of the component, will add `transform=rotation({rotation}deg)` to Dom

Example:

```js
<DDR value={{ x: 100, y: 100, width: 100, height: 100, rotation: 45 }} />
```

#### draggable

Type: `Boolean`<br>
Defaults: `true`<br>
Required: `false`<br>

Whether the component can be dragged

Example:

```js
<DDR draggable={false} />
```

#### rotatable

Type: `Boolean`<br>
Defaults: `true`<br>
Required: `false`<br>

Whether the component can be rotated

Example:

```js
<DDR rotatable={false} />
```

#### resizable

Type: `Boolean`<br>
Defaults: `true`<br>
Required: `false`<br>

Whether the component can be resized

Example:

```js
<DDR resizable={false} />
```

#### active

Type: `Boolean`<br>
Defaults: `true`<br>
Required: `false`<br>

When the value is false,The current component does not accept a response. it is equivalent to the same effect as draggable, rotatable, and resizable are all false

Example:

```js
<DDR active={false} />
```

#### acceptRatio

Type: `Boolean`<br>
Defaults: `true`<br>
Required: `false`<br>

When set to true will lock the aspect ratio of the component for resizing ,the same effect is achieved if the shift key is pressed

Example:

```js
<DDR acceptRatio={true} />
```

#### parent

Type: `Boolean`<br>
Defaults: `true`<br>
Required: `false`<br>

When set to true the component can only be moved and resized within the parent container, if the rotation angle is greater than 0 this property will be ignored when resizing

Example:

```js
<DDR parent={true} />
```

#### resizeHandler

Type: `Array`<br>
Defaults: `['tl','tm','tr','r','br','bm','bl','l']`<br>
Required: `false`<br>

Define the array of handles to restrict the element resizing

- tl: Top left
- tm: Top middle
- tr: Top right
- r: Middle right
- br: Bottom right
- bm: Bottom middle
- bl: Bottom left
- l: Middle left

Example:

```js
<DDR resizeHandler={['tl', 'tr', 'br', 'bl']} />
```

#### handlerSize

Type: `Number`<br>
Defaults: `11`<br>
Required: `false`<br>

Example:

```js
<DDR handlerSize={7} />
```

#### minWidth

Type: `Number`<br>
Defaults: `1`<br>
Required: `false`<br>

Resizable minimum width

Example:

```js
<DDR minWidth={40} />
```

#### minHeight

Type: `Number`<br>
Defaults: `1`<br>
Required: `false`<br>

Resizable minimum height

Example:

```js
<DDR minHeight={40} />
```

#### maxWidth

Type: `Number`<br>
Defaults: `100000000`<br>
Required: `false`<br>

Resizable maximum width

Example:

```js
<DDR minWidth={40} />
```

#### maxHeight

Type: `Number`<br>
Defaults: `100000000`<br>
Required: `false`<br>

Resizable maximum height

Example:

```js
<DDR minHeight={40} />
```

#### grid

Type: `Array`<br>
Defaults: `[1,1]`<br>
Required: `false`<br>

Define the grid on which the element is snapped. The format is `[x,y]`

Example:

```js
<DDR grid={[10, 10]} />
```

#### axis

Type: `String`<br>
Defaults: `xy`<br>
Required: `false`<br>

Specify the coordinate axis to drag, the default xy can be dragged, the optional values are `x` | `y` | `xy`

Example:

```js
<DDR axis="x" />
```

#### zoom

Type: `Number`<br>
Defaults: `1`<br>
Required: `false`<br>

When the parent container uses `transform: scale()`, the zoom value of the component should be consistent with the scale

Example:

```js
<div style={'transform:scale(1.5)'}>
  <DDR zoom={1.5}>
</div>
```

#### id

Type: `String`<br>
Defaults: `''`<br>
Required: `false`<br>

When using arrays, the unique identifier of the component needs to be provided

Example:

```js
<div>
  {this.list.map((item) => (
    <DDR key={item.id} id={item.id} />
  ))}
</div>
```

#### beforeActive

Type: `(id:string)=> boolean`<br>
Defaults: `(id)=> false`<br>
Required: `false`<br>

When the component mouse is pressed, this function will be called and the ID of the component will be passed,This function is provided for array rendering. when both `active` and the function return value are false, the component will not respond to any operation. if true is returned, the component will accept the response even if `active` is false.

Example:

```js
<DDR
  beforeActive={(id) => {
    console.log(id)
    return true
  }}
/>
```

#### renderContent

Type: `(vm)=> VNode`<br>
Defaults: `undefined`<br>
Required: `false`<br>

This function returns your custom subcomponent
<br>

Example:

```js
<DDR
  renderContent={(drag) => {
    console.log(drag)
    return <div>Child {drag.transform.x}</div>
  }}
/>
```

### Custom class style

- The mouse is pressed and ready to drag: `ddr-ready-drag` . Dragging: `ddr-dragging`
- The mouse is pressed and ready to resize: `ddr-ready-resize` . Resizing: `ddr-resizing`
- The mouse is pressed and ready to rotate: `ddr-ready-rotate` . Rotating: `ddr-rotating`
- the component is selected: `active`

### Events

A series of events are triggered when dragging, rotating and resizing. The event will pass in two parameters. The first parameter is the native event object, and the second parameter is the transformation of the current component.

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

- Template usage: `<ddr @dragstart="handler" />`
- Render usage: `<DDR onDragstart={handler} onDragend={handler} />`

### Slots

name: default

Example:

```js
<DDR>
  <div style="width:100%;height:100%;background:red" />
</DDR>
```

If you use arrays you need to wrap the components

Example:

Container component

```js
{

  data(){
    return {list:[]}
  },
  render(){
    return <div>
       {
         this.list.map(item=>{
           return  <DDRWrapper key={item.id} item={item}/>
         })
       }
    </div>
  }
}
```

DDRWrapper component

```js
{
  props:['item'],
  render(){
    let {id} = this.item
    return (
      <DDR id={id}  >
        <div style="width:100%;height:100%;background:red" />
      </DDR>
    )
  }
}
```

### Demo project

[ Link https://zuimeiaj.github.io/ddr/ ](https://zuimeiaj.github.io/ddr/)

### The currently implemented functions of the Demo project and are constantly being updated

- [x] Can customize components,add implementation and export in the directory `src/examples/vseditor/component-impl.js`. Just add the corresponding type in components.vue.
- [x] Customizable component property editor Add the corresponding type in the directory `src/examples/vseditor/prop-inspector.vue` and implement it
- [x] You can drag and drop components from the component list to the editing area for editing
- [x] Support component nesting, the `Container` component in `component-impl.js` actually contains an `editor-view` component, which can be nested infinitely
- [x] Other functions in the editor area will be provided in the form of plug-ins to facilitate function management
- [x] Support historical record rollback, component deletion and canvas clearing, etc.
- [x] Support batch selection
- [ ] Continue to refactor the code, usually it is implemented first and then optimized.
- [ ] Add more components such as forms, charts, etc.
- [ ] Add shortcut key functions, such as: delete, copy, add copy, cut, paste, etc.
- [ ] Add the canvas component can generate simple graphics, such as curves, and other graphics.

> The Demo project will continue to improve and add new functions, and its purpose is to add some useful functions to the component through a large number of project practices, so that it can meet the needs of more scenarios as much as possible.

### Comments and suggestions

Welcome to make valuable comments and suggestions

### License

The MIT License (MIT). Please see [License File](https://github.com/zuimeiaj/yoyoo-ddr/blob/master/LICENSE) for more information.
