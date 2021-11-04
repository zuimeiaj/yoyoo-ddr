const ComponentRefMap = {}

export function saveComponentRef(id, ref) {
  ComponentRefMap[id] = ref
}

export function getComponentRefsById(ids) {
  return ids.map((item) => ComponentRefMap[item])
}
export function destoryComponentRef(id) {
  ComponentRefMap[id] = null
}
