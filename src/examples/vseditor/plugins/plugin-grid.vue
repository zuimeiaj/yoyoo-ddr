<script>
export default {
  render() {
    return (
      <svg data-plugin="grid" ref={'grid'} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gridSmall" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(207, 207, 207, 0.2)" strokeWidth={1} />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#gridSmall)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(186, 186, 186, 0.1)" strokeWidth={1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    )
  },
}
</script>
