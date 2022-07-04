<template>
  <div>
    <div ref="flyawayMWL">
      <!-- so named because it will go away to another component -->
      <slot name="labelContent"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default (function (x) { return x.default || x })(require('/assets/markerWithLabel.js'))
</script>