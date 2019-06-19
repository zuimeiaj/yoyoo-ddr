# yoyoo-ddr

### Basic

```
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

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
