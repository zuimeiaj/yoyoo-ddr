<script>
export default {
  methods: {},
  render() {
    return (
      <div class="vs-header">
        <h1>Vue-ratatable-resizable-draggable</h1>
        <div>
          <button onClick={() => this.$emit('undo')}>Undo</button>
          <button onClick={() => this.$emit('redo')}>Redo</button>
          <button onClick={() => this.$emit('delete')}>Delete</button>
          <button onClick={() => this.$emit('clear')}>Clear </button>
        </div>
      </div>
    )
  },
}
</script>

<style lang="less">
.vs-header {
  height: 50px;
  border-bottom: 1px solid #ececec;
  display: flex;
  align-items: center;
  background: #f8f8f8;
  h1 {
    padding-left: 15px;
    font-size: 20px;
    color: #333;
    font-weight: 300;
  }
  button {
    padding: 4px 16px;
    font-size: 14px;
    color: #555;
    background: #f5f5f5;
    border: 1px solid #d3d3d3;
    margin-left: 20px;
    border-radius: 40px;
    &:hover {
      background: #d3d3d3;
      cursor: pointer;
      transition: all 300ms;
    }
  }
}
</style>
