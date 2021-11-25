/**
 *
 * 根据组件的id返回对应组件和组件在属性结构的路径
 * @param {Array} array
 * @param {String} id 组件的唯一ID
 * @returns {{path:Array;component:Object}} 返回对应的组件和组件在树形结构中的路径
 *
 */
export function findComponentPathById(array, id) {
  const findComponent = (controls, isRoot) => {
    for (let index = 0; index < controls.length; index++) {
      const element = controls[index]
      if (isRoot) {
        componentPath = []
      }
      if (element.id === id) {
        componentPath.push(index)
        return element
      } else if (element.type === 'container') {
        componentPath.push(index)
        let ele = findComponent(element.children, false)
        if (ele) return ele
      }
    }
  }
  let componentPath = []
  const component = findComponent(array, true)
  return { path: componentPath, component }
}

/**
 *
 * 类似数组的find(fn)方法
 * @param {Array} array
 * @param {Function} fn 返回 true表示直接返回该元素
 * @returns {Object}
 */
export function findComponent(array, fn) {
  const findComponent = (controls) => {
    for (let index = 0; index < controls.length; index++) {
      const element = controls[index]
      if (fn(element)) {
        return element
      } else if (element.type === 'container') {
        let ele = findComponent(element.children)
        if (ele && fn(ele)) return ele
      }
    }
  }
  return findComponent(array)
}

export function deepCopyComponent(item) {
  item = JSON.parse(JSON.stringify(item))

  const setNewId = (item) => {
    item.id = generateId()
    if (item.children) {
      item.children.forEach(setNewId)
    }
  }

  setNewId(item)
  return item
}

/**
 *
 * 基于不可变数据结构，只修改指定路径下的对象。如果回调函数返回false表示删除该路径对应的对象
 *
 * @param {Array} array
 * @param {Array} path
 * @param {(item:Object)=> Object|Boolean} callback
 * @returns {Array} 返回新的数组
 *
 */
export function updateTreeIn(array, path, callback) {
  path = path.slice()
  let resultArray = array.slice()
  let index = path.shift()
  let firstIndex = index
  let newData = { ...resultArray[index] }
  let object = newData
  while (path.length > 0) {
    index = path.shift()
    if (newData.children && newData.children.length > 0) {
      newData.children = newData.children.slice()
      if (path.length === 0) {
        let _obj = callback({ ...newData.children[index] })
        newData.children[index] = _obj
        if (!_obj) newData.children.splice(index, 1)
        resultArray[firstIndex] = object
        return resultArray
      } else {
        let _obj = { ...newData.children[index] }
        newData.children[index] = _obj
        newData = _obj
      }
    }
  }

  let _obj = callback(newData)
  resultArray[index] = _obj
  if (!_obj) resultArray = resultArray.filter(Boolean)
  return resultArray
}

/**
 *
 * @param {Array} array
 * @param {Array} ids
 * @param {(object:Object)=>Object|Boolean} callback
 */
export function batchUpdateIn(array, ids, callback) {
  return array
    .map((item) => {
      if (ids.includes(item.id)) {
        return callback({ ...item })
      }
      return item
    })
    .filter(Boolean)
}

/**
 *
 * @returns {string}
 */
export function generateId() {
  return (
    Date.now() +
    Math.random()
      .toString()
      .slice(2)
  )
}
