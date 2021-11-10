<script>
export default {
  render() {
    return <footer class="vs-footer" />
  },
}
</script>

<style lang="less" scoped>
.vs-footer {
  align-items: center;
  display: flex;
  padding: 0 15px;
  background: #f8f8f8;
  border-top: 1px solid #ececec;

  a {
    margin-right: 24px;
    font-weight: 300;
    font-size: 14px;
    color: #888;
    &:hover {
      color: blue;
    }
  }
}
</style>
