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
  return resultArray
}
