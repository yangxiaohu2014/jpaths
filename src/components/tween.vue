<template>
  <div>
    <svg ref='svg' xmlns="http://www.w3.org/2000/svg" version="1.1">
        <path class='origin' :d='originPath'/>
        <path class='des' :d='desPath'/>
        <path class='moving' ref='moving'/>
    </svg>
  </div>
</template>

<script>
import jPaths from '@/assets/js/jpaths'

export default {
  name: 'tween',
  data () {
    return {
      originPath: 'M50,50l40 50a40,50, 0, 1, 0, 40, 40v50m20 30h100l40, 60c100,100 250,100 150,100',
      desPath: 'M200 350 l-75 200 l150 0 L200 350',
    }
  },
  methods: {
    run() {
        var jpathObj = jPaths(this.originPath)
        var $moving = this.$refs.moving
        var t = 0
        var flag = 1

        function step() {
            flag = t >= 1 ? -1 : t <= 0 ? 1 : flag
            t += flag * 0.01
            jpathObj.tween("M200 350 l-75 200 l150 0 L200 350", t).render($moving)
            window.requestAnimationFrame(step)
        }

        window.requestAnimationFrame(step)
    }
  },
  mounted() {
    this.run()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
svg {
    width: 502px;
    height: 600px;
    border: 1px solid #ccc;

    path {
        fill: none;

        &.origin, &.des {
            stroke-width: 8px;
            stroke: #ccc;
        }

        &.moving {
            stroke-width: 2px;
            stroke: green;
        }
    }
}
</style>
