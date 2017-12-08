<template>
  <div class="clear-both">
    <svg class='float-left' ref='svg' xmlns="http://www.w3.org/2000/svg" version="1.1">
      <path class='origin' ref='origin' :d='originPath'></path>
      <path :d='part1'></path>
      <path :d='part2'></path>
    </svg>
    <ul class="info float-left">
        <li><button @click='onFresh'>刷新</button></li>
        <li><span>路径A【灰色】</span><div>{{originPath}}</div></li>
        <li><span>路径B【多色】</span><div>{{part1}}<hr/>{{part2}}</div></li>
    </ul>
    <div class="code float-left">
        <pre>
            <code>
      var position = Math.random() * this.length
      var paths = jpathObj.cut(position)

      this.part1 = paths[0].toString('%n')
      this.part2 = paths[1].toString('%n')
            </code>
        </pre>
    </div>
  </div>
</template>

<script>
import jPaths from '@/assets/js/jpaths'
var jpathObj = null

export default {
  name: 'cutArc',
  data () {
    return {
      originPath: 'M250,150 a100,60 -30 1,0 30, 60',
      part1: 'M0,0L0,0',
      part2: 'M0,0L0,0',
    }
  },
  computed: {
    length() {
      return this.$refs.origin.getTotalLength()
    }
  },
  methods: {
    onFresh() {
      var position = Math.round(Math.random() * this.length)
      var paths = jpathObj.cut(position)

      this.part1 = paths[0].toString('%n')
      this.part2 = paths[1].toString('%n')
    }
  },
  mounted() {
    jpathObj = jPaths(this.originPath)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>

</style>
