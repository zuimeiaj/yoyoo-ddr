<script>
import {
  getBoundingRect,
  getHandler,
  getPoints,
  getSize,
  heightMap,
  pointMap,
  pointMap2,
  rad2deg,
  tr2bl,
  widthMap,
} from './helper'

export default {
  name: 'ddr',
  props: {
    value: {
      default: function() {
        return { x: 0, y: 0, width: 100, height: 100, rotation: 0 }
      },
      type: Object,
    },
    handlerSize: {
      type: Number,
      default: 13,
    },
    active: {
      default: true,
      type: Boolean,
    },
    resizeHandler: {
      default: function() {
        return ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'bl', 'l']
      },
      type: Array,
    },
    resizable: {
      default: true,
      type: Boolean,
    },
    rotatable: {
      default: true,
      type: Boolean,
    },
    draggable: {
      default: true,
      type: Boolean,
    },
    acceptRatio: {
      default: false,
      type: Boolean,
    },
    minWidth: {
      type: Number,
      default: 1,
    },
    minHeight: {
      type: Number,
      default: 1,
    },
    parent: {
      type: Boolean,
      default: false,
    },
    beforeActive: {
      type: Function,
      default: () => false,
    },
    id: [Number, String],
    renderContent: {
      type: Function,
    },
    grid: {
      type: Array,
      default: () => [10, 10],
    },
    axis: {
      type: String,
      default: 'yx', // x | y 不填写则都可以移动，仅移动时生效
    },
  },
  data() {
    return {
      transform: Object.assign({}, this.value),
      currentRatio: 1,
      isInitialRatio: false,
      isDragging: false,
      isResizing: false,
      isRatating: false,
    }
  },
  created() {
    // 缓存当前位置信息
    this.localeTransform = { ...this.transform }
  },
  watch: {
    value(t) {
      this.transform = t
    },
  },

  computed: {
    rotateHandler() {
      let size = Math.ceil(this.handlerSize) + 'px'
      return `width:${size};height:${size};top:-25px;margin-left:${-Math.floor(this.handlerSize / 2)}px`
    },
    style() {
      let transform = this.transform
      return `left:${transform.x}px;top:${transform.y}px;width:${transform.width}px;height:${
        transform.height
      }px;transform:rotate(${transform.rotation}deg)`
    },
  },
  methods: {
    getNewHandler(type) {
      let cursor = getHandler(type, this.transform.rotation)
      let { handlerSize } = this
      let props = {}
      let half = -Math.floor(handlerSize / 2) + 'px'
      switch (type) {
        case 'tl':
          props = {
            top: half,
            left: half,
          }
          break
        case 'tm':
          props = { top: half, 'margin-left': half }
          break
        case 'tr':
          props = { right: half, top: half }
          break
        case 'r':
          props = { right: half, 'margin-top': half }
          break
        case 'br':
          props = { bottom: half, right: half }
          break
        case 'bm':
          props = { 'margin-left': half, bottom: half }
          break
        case 'bl':
          props = { left: half, bottom: half }
          break
        case 'l':
          props = { 'margin-top': half, left: half }
          break
      }
      let result = {
        cursor: cursor + '-resize',
        width: Math.ceil(handlerSize) + 'px',
        height: Math.ceil(handlerSize) + 'px',
        ...props,
      }
      return Object.keys(result)
        .map((item) => `${item}:${result[item]}`)
        .join(';')
    },

    handleMouseDown(event) {
      if (!this.active && !this.beforeActive(this.id)) return
      let point = event.touches ? event.touches[0] : event
      let { clientX, clientY } = point
      this._lastX = clientX
      this._lastY = clientY
      this._activeTarget = event.target
      this._parentRect = this.$refs.wrapper.parentNode.getBoundingClientRect()
      this.localeTransform = { ...this.transform }
      // 如果设置了限制在父元素的边界内移
      // 计算组件的边界，在移动时进行判断并修正
      if (this.parent) {
        let mouseDownRect = getBoundingRect(this.transform)
        let minLeft = this.transform.x - mouseDownRect.left
        let maxLeft = this._parentRect.width - this.transform.width - minLeft
        let minTop = this.transform.y - mouseDownRect.top
        let maxTop = this._parentRect.height - this.transform.height - minTop
        this.minBoundary = { minLeft, maxLeft, minTop, maxTop }
      }
      // 添加事件，该事件会在up时移除
      document.addEventListener('mousemove', this.handleMouseMove, false)
      document.addEventListener('touchmove', this.handleMouseMove, false)
      document.addEventListener('touchend', this.handleMouseUp, false)
      document.addEventListener('mouseup', this.handleMouseUp, false)
      if (event.target.dataset.type === 'rotate') {
        this._handlerType = 'rotate'
        this.handleRotateStart(event)
        this.$emit('rotatestart', event, this.transform)
      } else if (this._activeTarget.dataset.resizetype) {
        this._handlerType = 'resize'
        this.handleResizeStart(event)
        this.$emit('resizestart', event, this.transform)
      } else {
        this._handlerType = 'drag'
        this.draggable && this.$emit('dragstart', event, this.transform)
      }
    },
    handleMouseMove(event) {
      if (this._handlerType === 'resize') {
        this.isResizing = true
        this.handleResizeMove(event)
        this.$emit('resize', event, this.transform)
      } else if (this._handlerType === 'drag' && this.draggable) {
        this.isDragging = true
        this.doMove(event)
        this.$emit('drag', event, this.transform)
      } else if (this._handlerType === 'rotate') {
        this.isRatating = true
        this.handleRotateMove(event)
        this.$emit('rotate', event, this.transform)
      }
    },
    doMove(event) {
      let { clientX, clientY } = event.touches ? event.touches[0] : event
      let [gridX, gridY] = this.grid

      let deltaX = clientX - this._lastX
      let deltaY = clientY - this._lastY
      this._lastX = clientX
      this._lastY = clientY
      let x = (this.localeTransform.x = Math.round(this.localeTransform.x + deltaX))
      let y = (this.localeTransform.y = Math.round(this.localeTransform.y + deltaY))
      // 限制在父元素内进行移动
      // 在鼠标按下准备移动时会先计算好当前组件的边界，当超出边界时取计算好的边界进行修正
      if (this.parent) {
        let bounds = this.restrictToParentBoundary()
        x = bounds.x
        y = bounds.y
      }

      // 将当前位置对齐网格
      // 当deltaX > 0 说明当前移动方向为向右移动，则向下取整。例如：10 12 14 始终取 10
      // 当deltaY < 0 说明当干移动方向为向左移动，则向上取整。例如：20 19 17 始终取 20
      if (this.axis.includes('x')) {
        if (deltaX > 0) {
          this.transform.x = x - (x % gridX)
        } else if (deltaX < 0) {
          this.transform.x = x - ((x % gridX) - gridX)
        }
      }

      if (this.axis.includes('y')) {
        if (deltaY > 0) {
          this.transform.y = y - (y % gridY)
        } else if (deltaY < 0) {
          this.transform.y = y - ((y % gridY) - gridY)
        }
      }
    },
    /**
     * 限制在父元素中移动
     * @returns {{x:number;y:number}}
     */
    restrictToParentBoundary() {
      let x = Math.max(this.minBoundary.minLeft, this.localeTransform.x)
      let y = Math.max(this.minBoundary.minTop, this.localeTransform.y)
      x = Math.min(this.minBoundary.maxLeft, x)
      y = Math.min(this.minBoundary.maxTop, y)
      return { x, y }
    },
    handleMouseUp(event) {
      document.removeEventListener('mousemove', this.handleMouseMove, false)
      document.removeEventListener('mouseup', this.handleMouseUp, false)
      document.removeEventListener('touchmove', this.handleMouseMove, false)
      document.removeEventListener('touchend', this.handleMouseUp, false)
      let ev = {
        drag: 'draggable',
        resize: 'resizable',
        rotate: 'rotatable',
      }
      this.isInitialRatio = false
      this.isDragging = false
      this.isResizing = false
      this.isRatating = false
      this[ev[this._handlerType]] && this.$emit(this._handlerType + 'end', event, this.transform)
    },
    handleResizeStart(event) {
      let type = event.target.dataset.resizetype
      let rect = this.transform
      let matrix = getPoints(rect)
      let pressAngle
      // 当前控制点的对角坐标点，该坐标会用来计算新的位置
      // 例如：bottomRight(右下角) 对应 topLeft(左上角)
      let opposite = matrix[pointMap[type]]
      // 与上面的区别是，这里的对角坐标只能是4个直角坐标，用于计算新的宽高
      // 例如：例如：bottomRight 和 bottom 都对应 topLeft
      let opp2 = matrix[pointMap2[type]]
      let { clientX, clientY } = event.touches ? event.touches[0] : event
      let x1 = clientX - this._parentRect.left - opp2.x
      let y1 = clientY - this._parentRect.top - opp2.y
      let _width = rect.width,
        _height = rect.height
      if (tr2bl[type]) {
        if (widthMap[type]) _height /= 2
        pressAngle = rad2deg(Math.atan2(_width, _height))
      } else {
        if (heightMap[type]) _width /= 2
        pressAngle = rad2deg(Math.atan2(_height, _width))
      }
      let startAngle = rad2deg(Math.atan2(y1, x1))
      this._resizeOpt = {
        matrix,
        rect,
        type,
        opposite,
        opp2,
        pressAngle,
        startAngle,
      }
    },
    handleResizeMove(event) {
      let { clientX, clientY } = event.touches ? event.touches[0] : event
      let { opposite, opp2, type, pressAngle, startAngle } = this._resizeOpt
      let x = clientX - this._parentRect.left - opp2.x
      let y = clientY - this._parentRect.top - opp2.y
      let dis = Math.hypot(y, x)
      let ratio = event.shiftKey || this.acceptRatio
      let [gridX, gridY] = this.grid
      // 锁定纵横比
      if (!this.isInitialRatio && ratio) {
        this.currentRatio = this.transform.width / this.transform.height
        this.isInitialRatio = true
      }
      if (!ratio) {
        this.isInitialRatio = false
      }

      // 获取新的宽度和高度
      let { w, h } = getSize({
        type,
        dis,
        x,
        y,
        startAngle,
        pressAngle,
      })
      let transform = { ...this.localeTransform }

      // 进行等比例缩放
      if (this.isInitialRatio) {
        if (widthMap[type]) h = w / this.currentRatio
        else w = h * this.currentRatio
      }
      w = Math.max(Math.round(w), this.minWidth)
      h = Math.max(Math.round(h), this.minHeight)

      // 判断当前控制点是否为宽度缩放还是高度缩放
      if (widthMap[type] && !ratio) {
        transform.width = w
      } else if (heightMap[type] && !ratio) {
        transform.height = h
      } else {
        transform.width = w
        transform.height = h
      }

      // 限制在网格中移动，原理同拖动
      if (transform.width % gridX > 0) {
        if (transform.width > this.localeTransform.width) {
          // 宽度变大时向下取整
          transform.width = transform.width - (transform.width % gridX)
        } else {
          // 宽度变小时向上取整
          transform.width = transform.width - ((transform.width % gridX) - gridX)
        }
      }
      // 原理同上
      if (transform.height % gridY > 0) {
        if (transform.height > this.localeTransform.height) {
          transform.height = transform.height - (transform.height % gridY)
        } else {
          transform.height = transform.height - ((transform.height % gridY) - gridY)
        }
      }

      // 根据新的旋转和宽高计算新的位置
      let matrix = getPoints(transform)
      let newOpposite = matrix[pointMap[type]]
      let deltaX = -(newOpposite.x - opposite.x)
      let deltaY = -(newOpposite.y - opposite.y)
      transform.x = Math.round(transform.x + deltaX)
      transform.y = Math.round(transform.y + deltaY)
      this.transform = transform
    },

    handleRotateStart(event) {
      let { clientX, clientY } = event.touches ? event.touches[0] : event
      let t = this.$refs.wrapper.getBoundingClientRect()
      let cx = t.left + t.width / 2
      let cy = t.top + t.height / 2
      let startAngle = (180 / Math.PI) * Math.atan2(clientY - cy, clientX - cx)
      let rotation = this.transform.rotation
      // 记录旋转的角度和组件的中心点
      this._rotateOpt = { cx, cy, startAngle, rotation }
    },
    handleRotateMove(event) {
      let { cx, cy, startAngle, rotation } = this._rotateOpt
      let { clientX, clientY } = event.touches ? event.touches[0] : event
      let x = clientX - cx
      let y = clientY - cy
      let angle = (180 / Math.PI) * Math.atan2(y, x)
      // 旋转角度 = 鼠标移动时角度 - 鼠标按下时角度
      // 旋转后的角度 = 组件按下时角度 + 旋转角度
      let currentAngle = angle - startAngle
      let r = rotation + currentAngle
      r = r % 360
      r = r < 0 ? r + 360 : r
      this.transform.rotation = Math.floor(r)
    },
  },
  render() {
    const ddrClassNames = ['yoyoo-ddr']

    if (this.active) ddrClassNames.push('active')
    if (this.isDragging) ddrClassNames.push('ddr-dragging')
    if (this.isResizing) ddrClassNames.push('ddr-resizing')
    if (this.isRatating) ddrClassNames.push('ddr-ratating')

    return (
      <div
        ref="wrapper"
        style={this.style}
        class={ddrClassNames}
        onTouchstart={this.handleMouseDown}
        onMousedown={this.handleMouseDown}
      >
        {this.renderContent ? this.renderContent(this) : this.$slots.default}
        {this.resizable && (
          <div class="resize-handler-wrapper">
            {this.resizeHandler.map((item) => {
              return (
                <span
                  data-resizetype={item}
                  key={item}
                  style={this.getNewHandler(item)}
                  class={`resize-handler ${item}`}
                />
              )
            })}
          </div>
        )}
        {this.rotatable && <span style={this.rotateHandler} data-type="rotate" class="rotate-handler" />}
      </div>
    )
  },
}
</script>

<style>
.yoyoo-ddr {
  position: absolute;
}

.yoyoo-ddr .resize-handler,
.yoyoo-ddr .rotate-handler {
  display: none;
}

.yoyoo-ddr.active {
  border: 1px dashed #607d8b;
}

.yoyoo-ddr.active .resize-handler,
.yoyoo-ddr.active .rotate-handler {
  display: inline-block;
}

.resize-handler,
.rotate-handler {
  position: absolute;
  border: 1px solid #607d8b;
  background: #fff;
  box-sizing: border-box;
  border-radius: 50%;
}

.resize-handler.tm {
  left: 50%;
}

.resize-handler.r {
  top: 50%;
}

.resize-handler.bm {
  left: 50%;
}

.resize-handler.l {
  top: 50%;
  cursor: pointer;
}

.rotate-handler {
  left: 50%;
  cursor: crosshair;
}
</style>
