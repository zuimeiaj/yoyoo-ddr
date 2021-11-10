/**
 *
 * @description 返回当前dom是否为可拖拽组件
 * @param {HTMLElement} domNode
 * @returns {Boolean} 是否是组件
 */
export function isComponent(domNode) {
  while (domNode) {
    if (domNode.dataset.component === 'true') {
      return true
    }
    domNode = domNode.parentElement
  }
  return false
}

/**
 * 简单封装鼠标交互的一些事件
 */
export class Interaction {
  /**
   * 需要添加事件的dom节点
   * @type {HTMLElement}
   */
  element = null
  // 鼠标移动增量
  deltaX = 0
  deltaY = 0
  // 鼠标上次位置
  lastPointerX = 0
  lastPointerY = 0

  // 鼠标按下点的位置
  downPointerX = 0
  downPointerY = 0

  /**
   * @type {DOMRect}
   */
  elementRect = null

  // 鼠标移动点到按下点的位置
  x = 0
  y = 0

  clientX = 0
  clientY = 0
  downClientX = 0
  downClientY = 0

  /**
   * @private
   * @type {(interaction:Interaction)=> void 0}
   */
  moveHanlder = null
  /**
   * @private
   * @type {(interaction:Interaction)=> void 0}
   */
  startHandler = null
  /**
   * @private
   * @type {(interaction:Interaction)=> void 0}
   */
  endHanler = null

  /**
   *
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element
    element.addEventListener('mousedown', this.handleMouseDown, false)
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {{
   *    onStart:(interaction:Interaction)=> void;
   *    onMove:(interaction:Interaction)=> void;
   *    onEnd:(interaction:Interaction)=> void;
   *  }} handlers 处理回调函数
   * @returns {Interaction}
   */
  static init(element, handlers = {}) {
    let inter = new Interaction(element)
    inter.moveHanlder = handlers.onMove
    inter.startHandler = handlers.onStart
    inter.endHanler = handlers.onEnd
    return inter
  }

  /**
   *
   * @private
   * @param {PointerEvent} e
   */
  handleMouseDown = (e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    document.addEventListener('mousemove', this.handleMouseMove, false)
    document.addEventListener('mouseup', this.handleMouseUp, false)
    const { clientX, clientY } = e
    this.elementRect = this.element.getBoundingClientRect()
    this.lastPointerX = clientX
    this.lastPointerY = clientY
    this.downPointerX = clientX
    this.downPointerY = clientY
    this.downClientX = clientX - this.elementRect.left
    this.downClientY = clientY - this.elementRect.top
    this.clientX = clientX - this.elementRect.left
    this.clientY = clientY - this.elementRect.top
    if (this.startHandler) {
      this.startHandler(this)
    }
  }
  /**
   *
   * @private
   * @param {PointerEvent} e
   */
  handleMouseMove = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.deltaX = e.clientX - this.lastPointerX
    this.deltaY = e.clientY - this.lastPointerY
    this.lastPointerX = e.clientX
    this.lastPointerY = e.clientY

    this.x = e.clientX - this.downPointerX
    this.y = e.clientY - this.downPointerY

    this.clientX = e.clientX - this.elementRect.left
    this.clientY = e.clientY - this.elementRect.top

    if (this.moveHanlder) {
      this.moveHanlder(this)
    }
  }

  /**
   * @private
   */
  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove, false)
    document.removeEventListener('mouseup', this.handleMouseUp, false)
    if (this.endHanler) {
      this.endHanler(this)
    }
  }
  destory() {
    this.element.removeEventListener('mousedown', this.handleMouseDown, false)
    this.element = null
    this.moveHanlder = null
    this.startHandler = null
    this.endHanler = null
  }
}

/**
 * @description dom的简单操作封装
 */
export class Dom {
  /**
   * @type {HTMLElement}
   */
  element = null

  /**
   *
   * @param {HTMLElement} element
   * @returns  {Dom}
   */
  static of(element) {
    let dom = new Dom()
    dom.element = element
    return dom
  }

  /**
   * @param {Number} width
   * @param {Number} height
   * @returns  {Dom}
   */
  size(width, height) {
    this.element.style.width = width + 'px'
    this.element.style.height = height + 'px'
    return this
  }
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @returns {Dom}
   */
  position(x, y) {
    this.element.style.position = 'absolute'
    this.element.style.left = x + 'px'
    this.element.style.top = y + 'px'
    return this
  }

  /**
   * @returns {Dom}
   */
  show() {
    this.element.style.display = 'block'
    return this
  }
  /**
   *
   * @returns {Dom}
   */
  hide() {
    this.element.style.display = 'none'
    return this
  }
}
