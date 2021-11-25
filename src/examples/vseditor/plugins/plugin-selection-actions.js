import { deepCopyComponent } from '@/examples/utils'
import { EVENT_COMPONENT_DELETE, EVENT_COMPONENT_DUPLICATE } from '../event-enums'

export function registerSelectionActions(selection) {
  selection.eventbus.$on(EVENT_COMPONENT_DELETE, () => {
    if (selection.componentRefs.length > 1) {
      selection.application.batchDeleteControls(selection.componentRefs.map((item) => item.id))
      selection.selectionActive = false
    }
  })

  selection.eventbus.$on(EVENT_COMPONENT_DUPLICATE, () => {
    if (selection.componentRefs.length > 1) {
      const components = []
      const transformList = []
      const newComponent = (item) => {
        let copyOfSelected = deepCopyComponent(item)
        let t = copyOfSelected.transform
        copyOfSelected.transform = {
          x: t.x,
          y: t.y + selection.selectionTransform.height,
          width: t.width,
          height: t.height,
          rotation: t.rotation,
        }
        ids.push(copyOfSelected.id)

        transformList.push({
          id: copyOfSelected.id,
          ...copyOfSelected.transform,
        })
        return copyOfSelected
      }
      let ids = []
      selection.application.controls.forEach((item) => {
        let component = selection.componentRefs.find((ref) => item.id == ref.id)
        if (component) {
          components.push(newComponent(item))
        }
      })
      selection.application.controls = selection.application.controls.concat(components)
      selection.selectedComponents = transformList
      selection.selectionTransform = {
        ...selection.selectionTransform,
        y: selection.selectionTransform.y + selection.selectionTransform.height,
      }
      // 渲染后重新获取ref
      selection.$nextTick(() => {
        selection.getSelectedComponentRefs(ids, selection.selectionTransform)
      })
      return
    }
  })

  document.addEventListener('mousedown', (e) => {
    if (e.target.dataset.action === 'duplicate') {
      return
    }
    selection.selectionActive = false
  })
}
