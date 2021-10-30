<script>
export default {
  render() {
    return (
      <footer class="vs-footer">
        <a target="_blank" href="https://zuimeiaj.github.io/yoyoo/">
          编辑器(React 版)
        </a>
        <a target="_blank" href="https://github.com/zuimeiaj/yoyoo-ddr">
          Github
        </a>
      </footer>
    )
  },
}
</script>

<style lang="less" scoped>
.vs-footer {
  height: 30px;
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
