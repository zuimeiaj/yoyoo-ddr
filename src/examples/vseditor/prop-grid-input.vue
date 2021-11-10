<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [1, 1],
    },
  },
  methods: {
    handleChange(v, index) {
      let value = this.value.slice()
      value[index] = Math.max(1, Math.floor(v))
      this.$emit('input', value)
    },
  },
  render() {
    return (
      <div class="grid-input">
        <input value={this.value[0]} onInput={(e) => this.handleChange(e.target.value, 0)} type="number" />
        <input value={this.value[1]} onInput={(e) => this.handleChange(e.target.value, 1)} type="number" />
      </div>
    )
  },
}
</script>

<style lang="less" scoped>
.grid-input {
  display: inline-flex;
  flex: 1;
  input {
    flex: 1;
    width: 0;
    height: 24px;
    border-radius: 0;
    border: 1px solid #d3d3d3;
    padding-left: 8px;
  }
}
</style>
