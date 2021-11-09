<script>
export default {
  render() {
    return (
      <div>
        <router-view />
      </div>
    )
  },
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.page {
  height: 100vh;
  position: relative;
  padding: 0;
  margin: 0;
}
</style>
