<script>
export default {
  props: {
    value: Number,
  },

  methods: {
    handleChange(v) {
      this.$emit('input', +v)
    },
  },
  render() {
    return (
      <input class="input-value" value={this.value} onInput={(e) => this.handleChange(e.target.value)} type="number" />
    )
  },
}
</script>
