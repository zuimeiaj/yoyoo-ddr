<script>
import CellWrapperVue from './cell-wrapper.vue'
import { EVENT_COMPONENT_ADD } from './event-enums'
export default {
  props: {
    value: Array,
  },
  methods: {
    handleDropOver(e) {
      e.preventDefault()
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
      // file drop
      let files = e.dataTransfer.files
      let addComponents = []
      let comstr = ''
      let coords = {
        x: e.clientX - 100,
        y: e.clientY - 50,
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
      this.eventbus.$emit(EVENT_COMPONENT_ADD, addComponents)
    },
  },
  render() {
    return (
      <div ondrop={this.handleDrop} ondragover={this.handleDropOver} class="vs-editor">
        {this.value.map((item) => {
          return <CellWrapperVue item={item} />
        })}

        {this.value.length === 0 && (
          <div class="guide">
            <div>拖拽组件或本地图片到此区域开始编辑</div>
            <div>Drag component or local pictures to this area to start editing</div>
          </div>
        )}

        <svg ref={'grid'} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gridSmall" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(207, 207, 207, 0.2)" strokeWidth={1} />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#gridSmall)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(186, 186, 186, 0.1)" strokeWidth={1} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
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
