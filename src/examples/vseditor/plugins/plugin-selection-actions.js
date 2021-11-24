import { deepCopyComponent } from '@/examples/utils'

export function selectionActionHandlers(e) {
  switch (e.target.dataset.action) {
    case 'delete':
      if (this.componentRefs.length > 1) this.application.batchDeleteControls(this.componentRefs.map((item) => item.id))
      break
    // 创建副本
    case 'duplicate':
      if (this.componentRefs.length > 1) {
        const components = []
        const transformList = []
        const newComponent = (item) => {
          // 深度拷贝，粗暴！！
          let copyOfSelected = deepCopyComponent(item)
          let t = copyOfSelected.transform
          copyOfSelected.transform = {
            x: t.x,
            y: t.y + this.selectionTransform.height,
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
        this.application.controls.forEach((item) => {
          let component = this.componentRefs.find((ref) => item.id == ref.id)
          if (component) {
            components.push(newComponent(item))
          }
        })
        this.application.controls = this.application.controls.concat(components)
        this.selectedComponents = transformList
        this.selectionTransform = {
          ...this.selectionTransform,
          y: this.selectionTransform.y + this.selectionTransform.height,
        }
        // 渲染后重新获取ref
        this.$nextTick(() => {
          this.getSelectedComponentRefs(ids, this.selectionTransform)
        })
        return
      }
  }

  this.selectionActive = false
}
