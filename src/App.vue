<template>
  <div id="app">
    <ul class="nav">
      <router-link to="/toCurve" tag="li">贝塞尔曲线化</router-link>
      <router-link to="/tween" tag="li">变形动画</router-link>
      <router-link to="/cutBezier" tag="li">切割贝塞尔曲线</router-link>
      <router-link to="/cutArc" tag="li">切割椭圆狐</router-link>
      <router-link to="/getArcCenter" tag="li">找椭圆弧中心点</router-link>
    </ul>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang='less'>
body {
  background: #03A9F4;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.clear-both {
  &:after {
    content: '';
    height: 0;
    width: 0;
    display: block;
    clear: both;
  }
}
.float-left {
  float: left;
}

.nav {
  text-align: left;
  margin-bottom: 10px;
}
.nav li {
  display: inline-block;
  background: #607d8b;
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
}

.info {
    height: 482px;
    width: 520px;
    vertical-align: top;
    word-break: break-all;
    padding: 0 20px;

    li {
        margin-bottom: 16px;

        div {
          text-align: left;
          background: #fff;
          padding: 10px;
          margin-top: 12px;
        }

        &:last-of-type div {
            height: 180px;
            overflow: auto;
        }
    }
}

.code {
    text-align: left;
    max-height: 480px;
    overflow-y: auto;

    pre {
      margin: 0;
    }

    code {
      display: block;
      overflow-x: auto;
      padding: 0.5em;
      background: #444;
      color: #fff;
    }
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 20px;

  svg {
    width: 640px;
    height: 480px;
    background: url('./assets/img/replayboxBg.jpg') center center no-repeat;
    background-size: cover;
    border: 1px solid #ccc;

    path {
      position: relative;
      fill: none;
      stroke-width: 4px;

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
