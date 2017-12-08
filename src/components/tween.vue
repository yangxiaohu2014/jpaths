<template>
  <div class="clear-both">
    <svg class='float-left' ref='svg' xmlns="http://www.w3.org/2000/svg" version="1.1">
        <path class='origin' :d='originPath'/>
        <path class='des' :d='desPath'/>
        <path class='moving' ref='moving'/>
    </svg>
    <ul class="info float-left">
        <li><button @click='onTogglePlay'>{{play ? '暂停' : '播放'}}</button></li>
        <li><span>路径A【灰色】</span><div>{{originPath}}</div></li>
        <li><span>路径B【红色】</span><div>{{desPath}}</div></li>
        <li><span>过渡路径【绿色】</span><div>{{movingPath}}</div></li>
    </ul>
    <div class="code float-left">
        <pre>
            <code>
        var jpathObj = jPaths(this.originPath)
        var $moving = this.$refs.moving
        var t = 0
        var flag = 1
        var self = this

        function step() {
            flag = t >= 1 ? -1 : t <= 0 ? 1 : flag
            t += flag * 0.01

            var tweenJpathObj = jpathObj.tween(self.desPath, t)

            tweenJpathObj.render($moving)

            self.movingPath = tweenJpathObj.toString()
            window.requestAnimationFrame(step)
        }

        window.requestAnimationFrame(step) 
            </code>
        </pre>
    </div>
  </div>
</template>

<script>
import jPaths from '@/assets/js/jpaths'

var jpathObj = null

export default {
  name: 'tween',
  data () {
    return {
      originPath: 'M50,50l40 50a40,50, 0, 1, 0, 40, 40v50m20 30h100l40, -60c100,100 250, 100 150,-100',
      desPath: 'M250 250 l-75 200 l150 0 L250 250',
      movingPath: '',
      play: false,
      t: 0,
      flag: 1
    }
  },
  methods: {
    onTogglePlay() {
        if (this.play) {
            this.play = false
        } else {
            this.play = true
            this.run()
        }
    },

    run() {
        var $moving = this.$refs.moving
        var self = this

        function step() {
            self.flag = self.t >= 1 ? -1 : self.t <= 0 ? 1 : self.flag
            self.t += self.flag * 0.01

            var tweenJpathObj = jpathObj.tween(self.desPath, self.t)

            tweenJpathObj.render($moving)

            self.movingPath = tweenJpathObj.toString()

            if (self.play) {
                window.requestAnimationFrame(step)
            }
        }

        window.requestAnimationFrame(step)
    }
  },
  mounted() {
    jpathObj = jPaths(this.originPath)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.moving {
    stroke-width: 4px;
    stroke: green;
}
</style>
