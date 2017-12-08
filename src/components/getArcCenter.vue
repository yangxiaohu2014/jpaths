<template>
  <div>
    <svg ref='svg' xmlns="http://www.w3.org/2000/svg" version="1.1" >
    </svg>
  </div>
</template>

<script>
import jPaths from '@/assets/js/jpaths'
import {getArcCenter} from '@/assets/js/geometry'

export default {
  name: 'getArcCenter',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    test(arcpathdata) {//用数组的形式测试
    	var $svg = this.$refs.svg
        var $path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        var path = jPaths(arcpathdata)//创建jpaths对象
        var length = path.length()
        var p = path.at(0.5 * length)
        var p0 = arcpathdata[0].slice(1)
        var p1 = p.point
        var p2 = arcpathdata[1].slice(-2)
        var ap = arcpathdata[1].slice(1)
        var arcPointArray = p0.concat(p1, p2)
        var cent = getArcCenter(arcPointArray, ap[0], ap[1], ap[2] * Math.PI / 180)
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

        while ($svg.lastChild) {
            $svg.removeChild($svg.lastChild)
        }

        $path.setAttribute('d', path.toString())
        $svg.appendChild($path)//测试初始时的path数据

        circle.setAttribute('cx', cent[0])
        circle.setAttribute('cy', cent[1])
        circle.setAttribute('r', '4')
        circle.setAttribute('fill', 'red')

        $svg.appendChild(circle)

        console.log('椭圆弧的路径为: \n' + path.toString('%n'))
        console.log('椭圆弧的圆心为：\n(' + cent[0] + ',' + cent[1] + ')\n\n')
        console.log('================')
        console.log('================')
    }
  },
  mounted() {
    this.test([['M', 100, 100], ['A', 120, 60, 60,  1, 0, 350, 325]]);

    setTimeout(() => {
        this.test([['M', 100, 100], ['A', 120, 60, 60,  1, 1, 350, 325]]);
    }, 1000);
    setTimeout(() => {
        this.test([['M', 100, 100], ['A', 120, 60, -60,  0, 1, 150, 325]]);
    }, 2000);
    setTimeout(() => {
        this.test([['M', 100, 100], ['A', 120, 60, -60,  0, 0, 150, 325]]);
    }, 3000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
svg {
    width: 500px;
    height: 500px;
    border: 1px solid #ccc;

    path {
	    position: relative;
	    fill: none;
	    stroke-width: 2px;

	    &:first-child {
		    stroke: #ccc;
		    stroke-width: 6px;
		}
		&:nth-child(2) {
		    stroke: blue;
		}
		&:nth-child(3){
		    stroke: red;
		}
	}
}

</style>
