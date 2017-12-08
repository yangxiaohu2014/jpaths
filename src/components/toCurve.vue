<template>
  <div class="clear-both">
    <svg class='float-left' ref='svg' xmlns="http://www.w3.org/2000/svg" version="1.1">
      <path class='origin' ref='origin' :d='originPath'></path>
    </svg>
    <ul class="info float-left">
        <li><span>路径A【灰色】</span><div>{{originPath}}</div></li>
        <li><span>路径B【多色】</span><div>{{desPath}}</div></li>
    </ul>
    <div class="code float-left">
        <pre>
            <code>
      var jpathObj = jPaths(this.originPath)
      var newPath = jpathObj.toCurve()
      var subPathes = newPath.subPathes()

      subPathes.forEach((sub, i) => {
        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'path')
   
        obj.setAttribute('d', sub.path)
        this.$refs.svg.appendChild(obj)
      })
            </code>
        </pre>
    </div>
  </div>
</template>

<script>
import jPaths from '@/assets/js/jpaths'

export default {
  name: 'tween',
  data () {
    return {
      originPath: 'M250,150 a100,60 -30 1,0 30, 60l23 45h45v60',
      desPath: ''
    }
  },
  methods: {
    test() {
      var jpathObj = jPaths(this.originPath)
      var newPath = jpathObj.toCurve()
      var subPathes = newPath.subPathes()

      subPathes.forEach((sub, i) => {
        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'path')
   
        this.desPath += sub.path
        obj.setAttribute('d', sub.path)
        this.$refs.svg.appendChild(obj)
      })
    }
  },
  mounted() {
    this.test()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>

</style>
