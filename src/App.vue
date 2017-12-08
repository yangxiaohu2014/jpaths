<template>
  <div id="app">
    <!-- <img src="./assets/img/svg.jpg"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang='less'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  >img {
    width: 150px;
  }

  svg {
    width: 500px;
    min-height: 500px;
    border: 1px solid #ccc;

    path {
      position: relative;
      fill: none;
      stroke-width: 2px;

      &:first-child {
        stroke: #ccc !important;
        stroke-width: 10px !important;
      }

      &:nth-child(odd) {
          stroke: green;
      }

      &:nth-child(even){
          stroke: red;
      }
    }
  }
}
</style>
