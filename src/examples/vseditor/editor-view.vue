<script>
import CellWrapperVue from './cell-wrapper.vue'
import PluginDropFileVue from './plugins/plugin-drop.vue'

export default {
  props: {
    value: Array,
    parentId: String,
    parent: Object,
  },
  methods: {
    /**
     * @type {HTMLElement}
     */
    getWrapperElement() {
      return this.$refs.editor
    },
  },

  render() {
    return (
      <div class={`vs-editor ${this.parentId ? 'nest-editor' : 'root-editor'}`}>
        <div class="vs-editor-canvas" ref="editor">
          {this.value.map((item) => {
            return <CellWrapperVue key={item.id} item={item} />
          })}
          {/***Inject Plugins**/}
          {this.$slots.default}
          <PluginDropFileVue parentId={this.parentId} length={this.value.length} />
        </div>
      </div>
    )
  },
}
</script>

<style lang="less">
.vs-editor-canvas {
  width: 100%;
  height: 100%;
}

.root-editor > .vs-editor-canvas {
  transform: scale(1);
  transform-origin: top left;
}
</style>
