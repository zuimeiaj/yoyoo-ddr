<template>
    <div ref="wrapper"
         :style="style"
         :class="{active:active}"
         @mousedown="handleMouseDown" class="yoyoo-ddr">
        <slot></slot>
        <div v-if="resizable">
            <span :data-resizetype="item"
                  :key="item"
                  :class="item"
                  :style="{cursor:getNewHandler(item)}"
                  class="resize-handler"
                  v-for="item in resizeHandler"></span>
        </div>
        <span v-if="rotatable" data-type="rotate" class="rotate-handler"></span>
    </div>
</template>


<script>
    import {getHandler, getPoints, getSize, heightMap, pointMap, rad2deg, tr2bl, widthMap} from './helper'
    
    export default {
        name : 'ddr',
        props : {
            value : {
                default : function(){
                    return {x : 0, y : 0, width : 100, height : 100, rotation : 88}
                },
                type : Object
            },
            active : {
                default : true,
                type : Boolean
            },
            resizeHandler : {
                default : function(){
                    return ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'bl', 'l']
                },
                type : Array
            },
            resizable : {
                default : true,
                type : Boolean
            },
            rotatable : {
                default : false,
                type : Boolean
            },
            draggable : {
                default : true,
                type : Boolean
            },
            acceptRatio : {
                default : false,
                type : Boolean
            },
            minWidth : {
                type : Number,
                default : 0
            },
            minHeight : {
                type : Number,
                default : 0
            }
        },
        data(){
            return {
                transform : Object.assign({}, this.value)
            }
        },
        watch : {
            value(t){
                this.transform = t
            }
        },
        computed : {
            style(){
                let transform = this.transform
                return {
                    left : transform.x + 'px',
                    top : transform.y + 'px',
                    width : transform.width + 'px',
                    height : transform.height + 'px',
                    transform : `rotate(${transform.rotation}deg)`
                }
            }
        },
        methods : {
            getNewHandler(type){
                let cursor = getHandler(type, this.transform.rotation)
                return cursor + '-resize'
            },
            handleMouseDown(event){
                if(!this.active) return
                let {clientX, clientY} = event
                this._lastX = clientX
                this._lastY = clientY
                this._activeTarget = event.target
                document.addEventListener('mousemove', this.handleMouseMove, false)
                document.addEventListener('mouseup', this.handleMouseUp, false)
                if(event.target.dataset.type === 'rotate') {
                    this._handlerType = 'rotate'
                    this.handleRotateStart(event)
                    this.$emit('rotate-start', event, this.transform)
                } else if(this._activeTarget.dataset.resizetype) {
                    this._handlerType = 'resize'
                    this._parentRect = this.$refs.wrapper.parentNode.getBoundingClientRect()
                    this.handleResizeStart(event)
                    this.$emit('resize-start', event, this.transform)
                } else {
                    this._handlerType = 'drag'
                    this.draggable && this.$emit('drag-start', event, this.transform)
                }
            },
            handleMouseMove(event){
                if(this._handlerType === 'resize') {
                    this.handleResizeMove(event)
                    this.$emit('resize', event, this.transform)
                } else if(this._handlerType === 'drag' && this.draggable) {
                    let {clientX, clientY} = event
                    let deltaX = clientX - this._lastX
                    let deltaY = clientY - this._lastY
                    this._lastX = clientX
                    this._lastY = clientY
                    this.transform.x += deltaX
                    this.transform.y += deltaY
                    this.$emit('drag', event, this.transform)
                } else if(this._handlerType === 'rotate') {
                    this.handleRotateMove(event)
                    this.$emit('rotate', event, this.transform)
                }
            },
            handleMouseUp(event){
                document.removeEventListener('mousemove', this.handleMouseMove, false)
                document.removeEventListener('mouseup', this.handleMouseUp, false)
                let ev = {
                    drag : 'draggable',
                    resize : 'resizable',
                    rotate : 'rotatable'
                }
                this[ev[this._handlerType]] && this.$emit(this._handlerType + '-end', event, this.transform)
            },
            handleResizeStart(event){
                let type = event.target.dataset.resizetype
                let rect = this.transform
                let matrix = getPoints(rect)
                let pressAngle
                let opposite = matrix[pointMap[type]]
                let {clientX, clientY} = event
                let x1 = clientX - this._parentRect.left - opposite.x
                let y1 = clientY - this._parentRect.top - opposite.y
                let _width = rect.width, _height = rect.height
                let currentRatio = _width / _height
                if(tr2bl[type]) {
                    if(widthMap[type]) _height /= 2
                    pressAngle = rad2deg(Math.atan2(_width, _height))
                } else {
                    if(heightMap[type]) _width /= 2
                    pressAngle = rad2deg(Math.atan2(_height, _width))
                }
                let startAngle = rad2deg(Math.atan2(y1, x1))
                this._resizeOpt = {
                    matrix, rect, type, opposite, currentRatio, pressAngle, startAngle
                }
            },
            handleResizeMove(event){
                let {clientX, clientY} = event
                let {opposite, currentRatio, type, pressAngle, startAngle} = this._resizeOpt
                let x = clientX - this._parentRect.left - opposite.x,
                    y = clientY - this._parentRect.top - opposite.y,
                    dis = Math.hypot(y, x),
                    ratio = event.shiftKey || this.acceptRatio
                let {w, h} = getSize({type, dis, x, y, ratio, startAngle, pressAngle, currentRatio})
                let transform = Object.assign({}, this.transform)
                if(widthMap[type] && !ratio) {
                    transform.width = w
                } else if(heightMap[type] && !ratio) {
                    transform.height = h
                } else {
                    transform.width = w
                    transform.height = h
                }
                if(transform.width < this.minWidth) {
                    transform.width = this.minWidth
                }
                if(transform.height < this.minHeight) {
                    transform.height = this.minHeight
                }
                transform.width = Math.round(transform.width)
                transform.height = Math.round(transform.height)
                currentRatio = transform.width / transform.height
                let matrix = getPoints(transform)
                let _opp = matrix[pointMap[type]]
                let deltaX = -(_opp.x - opposite.x), deltaY = -(_opp.y - opposite.y)
                transform.x = Math.round(transform.x + deltaX)
                transform.y = Math.round(transform.y + deltaY)
                this._resizeOpt.currentRatio = currentRatio
                this.transform = transform
            },
            handleRotateStart(event){
                let t = this.$refs.wrapper.getBoundingClientRect(),
                    cx = t.left + t.width / 2,
                    cy = t.top + t.height / 2,
                    startAngle = 180 / Math.PI * Math.atan2(event.clientY - cy, event.clientX - cx),
                    rotation = this.transform.rotation
                this._rotateOpt = {cx, cy, startAngle, rotation}
            },
            handleRotateMove(event){
                let {cx, cy, startAngle, rotation} = this._rotateOpt
                let x = event.clientX - cx,
                    y = event.clientY - cy,
                    angle = 180 / Math.PI * Math.atan2(y, x),
                    currentAngle = angle - startAngle,
                    r = rotation + currentAngle
                r = r % 360
                r = r < 0 ? r + 360 : r
                this.transform.rotation = Math.round(r)
            }
        }
    }
</script>

<style scoped>

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
        width: 9px;
        height: 9px;
        border: 1px solid #607d8b;
        background: #fff;
        box-sizing: border-box;
        border-radius: 50%;
    }

    .resize-handler.tl {
        left: -4px;
        top: -4px;
    }

    .resize-handler.tm {
        left: 50%;
        top: -4px;
        margin-left: -4px;
    }

    .resize-handler.tr {
        right: -4px;
        top: -4px;
    }

    .resize-handler.r {
        right: -4px;
        top: 50%;
        margin-top: -4px;
    }

    .resize-handler.br {
        bottom: -4px;
        right: -4px;
    }

    .resize-handler.bm {
        left: 50%;
        margin-left: -4px;
        bottom: -4px;
    }

    .resize-handler.bl {
        left: -4px;
        bottom: -4px;
    }

    .resize-handler.l {
        top: 50%;
        margin-top: -4px;
        left: -4px;
        cursor: pointer;
    }

    .rotate-handler {
        top: -25px;
        margin-left: -4px;
        left: 50%;
        cursor: crosshair;
    }

    .rotate-handler:after {
        content: '';
        position: absolute;
        width: 1px;
        height: 17px;
        background: #607d8b;
        top: 7px;
        left: 3px;
        z-index: -1;
    }


</style>