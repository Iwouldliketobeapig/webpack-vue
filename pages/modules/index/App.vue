<style lang="scss">
  .index{
    width: 100vh;
    height: 100vh;
    background: red;
    &-title{
      color: blue;
    }
  }
</style>
<template>
  <layouts>
  </layouts>
</template>
<script>
  import Layouts from "components/layouts";
  export default {
    name: "index",
    components: {
      Layouts
    }
  }
</script>