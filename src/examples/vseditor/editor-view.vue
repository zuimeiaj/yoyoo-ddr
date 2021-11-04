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
    // eslint-disable-next-line no-console
    console.log('render editor', this.parentId)
    return (
      <div ref="editor" class="vs-editor">
        {this.value.map((item) => {
          return <CellWrapperVue key={item.id} item={item} />
        })}
        {/***Inject Plugins**/}
        {this.$slots.default}

        <PluginDropFileVue parentId={this.parentId} length={this.value.length} />
      </div>
    )
  },
}
</script>
