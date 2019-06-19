<template>
    <div id="app">
        <div class="columns">
            <h1 class="header">yoyoo - ddr
            Mobile & PC</h1>
            <div class="content">
                <DDR :draggable="controlled.draggable"
                     :rotatable="controlled.rotatable"
                     :resizable="controlled.resizable"
                     :accept-ratio="controlled.acceptRatio"
                     :resize-handler="['tl','tm','tr','r','br','bm','l','bl']"
                     :min-width="+controlled.minWidth"
                     :min-height="+controlled.minHeight"
                     :active="controlled.active"
                     :value="transform"
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
            </div>
            <footer class="footer">
                <a target="_blank" href="https://app.yoyoo.ink">YOYOO原型设计 - 一个在线高保真原型设计工具 </a>
                <a target="_blank" href="https://www.fechat.ink">FE社区 - 一个基于JavaScript的垂直化前端技术社区</a>
                <a target="_blank" href="https://github.com/zuimeiaj/yoyoo-ddr">Github</a>
            </footer>
        </div>
        <div class="inspector">
            <div class="input-item" :key="item.name" v-for="item in inputs">
                <label class="input-label">{{item.name}}</label>
                <input class="input-value" :type="item.type" v-model="controlled[item.name]"/>
            </div>
            <div class="input-item">
                <label class="input-label">events</label>
                <span class="input-value">{{events}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import DDR from './components/ddr'
    
    export default {
        name : "app",
        components : {DDR},
        data(){
            return {
                events : '',
                inputs : [
                    {type : 'number', name : 'x'},
                    {type : 'number', name : 'y'},
                    {type : 'number', name : 'width'},
                    {type : 'number', name : 'height'},
                    {type : 'number', name : 'rotation'},
                    {type : 'number', name : 'minWidth'},
                    {type : 'number', name : 'minHeight'},
                    {type : 'checkbox', name : 'acceptRatio'},
                    {type : 'checkbox', name : 'draggable'},
                    {type : 'checkbox', name : 'resizable'},
                    {type : 'checkbox', name : 'rotatable'},
                    {type : 'checkbox', name : 'active'},
                ],
                controlled : {
                    x : 30,
                    y : 30,
                    width : 100,
                    height : 100,
                    rotation : 0,
                    minHeight : 10,
                    minWidth : 10,
                    rotatable : true,
                    resizable : true,
                    draggable : true,
                    acceptRatio : false,
                    active : true,
                }
            }
        },
        computed : {
            transform(){
                const {x, y, height, width, rotation} = this.controlled
                return {
                    x : +x,
                    y : +y,
                    width : +width,
                    height : +height,
                    rotation : +rotation
                }
            }
        },
        methods : {
            handler(event, transform){
                this.controlled = Object.assign({}, this.controlled, transform)
            },
            handleDragStart(e, t){
                this.events = 'drag-start'
                this.handler(e, t)
            },
            handleDrag(e, t){
                this.events = 'drag'
                this.handler(e, t)
            },
            handleDragEnd(e, t){
                this.events = 'drag-end'
                this.handler(e, t)
            },
            handleResizeStart(e, t){
                this.events = 'resize-start'
                this.handler(e, t)
            },
            handleResize(e, t){
                this.events = 'resize'
                this.handler(e, t)
            },
            handleResizeEnd(e, t){
                this.events = 'resize-end'
                this.handler(e, t)
            },
            handleRotateStart(e, t){
                this.events = 'rotate-start'
                this.handler(e, t)
            },
            handleRotate(e, t){
                this.events = 'rotate'
                this.handler(e, t)
            },
            handleRotateEnd(e, t){
                this.events = 'rotate-end'
                this.handler(e, t)
            }
        },
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        display: flex;
        height: 100vh;
    }

    .columns {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .columns .header {
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
        height: 60px;
        line-height: 60px;
        padding-left: 25px;
        font-size: 14px;
        font-weight: 400;
        color: #333;
    }

    .columns .content {
        flex: 1;
        position: relative;
        overflow: hidden;
    }

    .cell {
        position: absolute;
        background: rgba(156, 39, 176, 0.34);
        width: 100%;
        height: 100%;
    }

    .inspector {
        width: 260px;
        height: 100%;
        background: #fff;
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);;
    }

    .input-item {
        display: flex;
        padding: 0px 10px;
        margin-top: 10px;
    }

    .input-item input {
        padding-left: 8px;
    }

    .input-label {
        flex: 1;
    }

    .input-value {
        display: inline-block;
        width: 120px;
    }

    .footer {
        font-size: 12px;
        padding: 2px 15px;
        padding-left: 10px;
    }

    .footer a {
        margin-right: 20px;
        color: #989898;
        text-decoration: none;
    }

    @media screen and (max-width: 600px) {
        .footer a {
            color: #989898;
            text-decoration: none;
            display: block;
            margin-bottom: 10px;

        }

        .inspector {
            width: 140px;
        }

        .input-item {
            padding: 0 5px;
        }

        .input-label {
            font-size: 10px;
        }

        .input-value {
            font-size: 10px;
            width: 70px;
        }
    }
</style>
