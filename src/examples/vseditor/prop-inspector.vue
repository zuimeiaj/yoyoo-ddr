<script>
import PropCheckInputVue from './prop-check-input.vue'
import PropGridInputVue from './prop-grid-input.vue'
import PropNumberInputVue from './prop-number-input.vue'
import PropRadioInputVue from './prop-radio-input.vue'
const PropInputImpl = {
  grid: PropGridInputVue,
  radio: PropRadioInputVue,
  number: PropNumberInputVue,
  checkbox: PropCheckInputVue,
}
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
        { type: 'grid', name: 'grid' },
        {
          type: 'radio',
          name: 'axis',
          options: [{ label: 'y', value: 'y' }, { label: 'x', value: 'x' }, { label: 'xy', value: 'xy' }],
        },
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
    customChange(e, item) {
      this.$emit('change', {
        ...item,
        value: e,
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
          let DyInput = PropInputImpl[item.type]
          return (
            <div class="input-item" key={item.name}>
              <label class="input-label">{item.name}</label>
              <DyInput
                options={item.options}
                value={this.controlled[item.name]}
                onInput={(e) => this.customChange(e, item)}
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
  width: 240px;
  border-left: 1px solid #ececec;
  background: #f8f8f8;
  padding: 15px;
  overflow-y: auto;
  .input-item {
    margin-bottom: 12px;
    display: flex;
  }
  .input-label {
    display: inline-block;
    width: 100px;
    color: #555;
  }
  .input-value:not([type='checkbox']) {
    height: 24px;
    padding: 0;
    border-radius: 0;
    border: 1px solid #d3d3d3;
    padding-left: 10px;
    flex: 1;
    width: 0;
  }
}
</style>
