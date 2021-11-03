<script>
export default {
  props: {
    value: Boolean,
  },

  methods: {
    handleChange(v) {
      this.$emit('input', v)
    },
  },
  render() {
    return (
      <input
        class="input-value"
        checked={this.value}
        onInput={(e) => this.handleChange(e.target.checked)}
        type="checkbox"
      />
    )
  },
}
</script>
