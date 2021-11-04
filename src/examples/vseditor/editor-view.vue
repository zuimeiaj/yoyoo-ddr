<script>
import CellWrapperVue from './cell-wrapper.vue'
import { EVENT_COMPONENT_ADD } from './event-enums'

export default {
  props: {
    value: Array,
    parentId: String,
    parent: Object,
  },
  methods: {
    handleDropOver(e) {
      e.preventDefault()
      e.stopPropagation()
    },
    getImageDataUrl(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    },
    async handleDrop(e) {
      e.preventDefault()
      e.stopPropagation()
      // file drop
      let files = e.dataTransfer.files
      let addComponents = []
      let comstr = ''
      let rect = this.$refs.editor.getBoundingClientRect()
      let coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      if (files.length > 0) {
        for (let index = 0; index < files.length; index++) {
          const element = files[index]
          const data = await this.getImageDataUrl(element)
          addComponents.push({
            type: 'img',
            url: data,
            ...coords,
            width: 150,
            height: 100,
          })
        }
      } else if ((comstr = e.dataTransfer.getData('text/component'))) {
        let com = JSON.parse(comstr)
        com = { ...com, ...coords }

        addComponents.push(com)
      }
      this.eventbus.$emit(EVENT_COMPONENT_ADD, { components: addComponents, parentId: this.parentId })
    },

    /**
     * @type {HTMLElement}
     */
    getWrapperElement() {
      return this.$refs.editor
    },
  },

  render() {
    // eslint-disable-next-line no-console
    console.log('render editor')
    return (
      <div ref="editor" ondrop={this.handleDrop} ondragover={this.handleDropOver} class="vs-editor">
        {this.value.map((item) => {
          return <CellWrapperVue item={item} />
        })}

        {this.$slots.default}

        {this.value.length === 0 && (
          <div class="guide">
            <div>拖拽组件或本地图片到此区域开始编辑</div>
            <div>Drag component or local pictures to this area to start editing</div>
          </div>
        )}
      </div>
    )
  },
}
</script>

<style lang="less" scoped>
.guide {
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  color: #999;
  line-height: 2;
  font-size: 20px;
  font-weight: 300;
}
</style>
