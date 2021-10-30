<script>
export default {
  props: ['controlled'],
  data() {
    return {
      inputs: [
        { type: 'number', name: 'x' },
        { type: 'number', name: 'y' },
        { type: 'number', name: 'width' },
        { type: 'number', name: 'height' },
        { type: 'number', name: 'rotation' },
        { type: 'number', name: 'minWidth' },
        { type: 'number', name: 'minHeight' },
        { type: 'checkbox', name: 'acceptRatio' },
        { type: 'checkbox', name: 'draggable' },
        { type: 'checkbox', name: 'resizable' },
        { type: 'checkbox', name: 'rotatable' },
        { type: 'checkbox', name: 'active' },
        { type: 'checkbox', name: 'parent' },
      ],
      extraInputs: [{ type: 'text', name: 'value' }, { type: 'text', name: 'label' }],
    }
  },
  methods: {
    handleChange(e, item) {
      this.$emit('change', {
        ...item,
        value: +e.target.value,
        checked: e.target.checked,
      })
    },
    extraChange(e, item) {
      this.$emit('change', {
        ...item,
        value: e.target.value,
        checked: e.target.checked,
        extra: true,
      })
    },
  },
  render() {
    if (!this.controlled.id) return null
    return (
      <div class="vs-inspector">
        <div>DDR Props</div>
        {this.inputs.map((item) => {
          return (
            <div class="input-item" key={item.name}>
              <label class="input-label">{item.name}</label>
              <input
                onInput={(e) => this.handleChange(e, item)}
                class="input-value"
                type={item.type}
                checked={this.controlled[item.name]}
                value={this.controlled[item.name]}
              />
            </div>
          )
        })}

        <div>Extra Props</div>
        {this.extraInputs
          .filter((item) => item.name in this.controlled.extra)
          .map((item) => {
            return (
              <div class="input-item" key={item.name}>
                <label class="input-label">{item.name}</label>
                <input
                  onInput={(e) => this.extraChange(e, item)}
                  class="input-value"
                  type={item.type}
                  checked={this.controlled.extra[item.name]}
                  value={this.controlled.extra[item.name]}
                />
              </div>
            )
          })}
      </div>
    )
  },
}
</script>

<style lang="less">
.vs-inspector {
  width: 200px;
  border-left: 1px solid #ececec;
  background: #f8f8f8;
  padding: 15px;
  .input-item {
    margin-bottom: 12px;
  }
  .input-label {
    display: inline-block;
    width: 80px;
    color: #555;
  }
  .input-value:not([type='checkbox']) {
    width: 80px;
    height: 24px;
    padding: 0;
    border-radius: 0;
    border: 1px solid #d3d3d3;
    padding-left: 10px;
  }
}
</style>
