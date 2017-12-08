<template>
  <div>
    <svg ref='svg' xmlns="http://www.w3.org/2000/svg" version="1.1">
      <path class='origin' ref='origin' :d='originPath'></path>
      <path :d='part1'></path>
      <path :d='part2'></path>
    </svg>
  </div>
</template>

<script>
import jPaths from '@/assets/js/jpaths'

export default {
  name: 'cutArc',
  data () {
    return {
      originPath: 'M250,150 a100,60 -30 1,0 30, 60',
      part1: 'M0,0L0,0',
      part2: 'M0,0L0,0'
    }
  },
  methods: {
    test() {
      var jpathObj = jPaths(this.originPath)
      var length = this.$refs.origin.getTotalLength()
      var step = length * .2
      var position = step
      var flag = 1
      var self = this

      function cut() {
        flag = position >= length ? -1 : position <= 0 ? 1 : flag

        position += flag * step

        var paths = jpathObj.cut(position)

        self.part1 = paths[0].toString('%n')
        self.part2 = paths[1].toString('%n')
      }

      setInterval(cut, 2000)
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
