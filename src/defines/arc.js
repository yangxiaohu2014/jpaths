import Vue from 'vue'
import {isString, isPlainObject} from 'lodash'
import jPaths from '@/assets/js/jpaths'
import {getArcCenter} from '@/assets/js/geometry'

const template = `
  <g>
	<path fill="none" stroke="#000000" :d="path" stroke-width="3" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path>
	<circle fill="red" stroke="none" :cx="circle.cx" :cy="circle.cy" :r="circle.r" v-if='circle.show'/>
  </g>
`
Vue.component('Arc', {
  props: ['path', 'center', 'style'],
  template: template,
  // 严格来看 data 是一个函数，
  // 因此 Vue 不会警告，但是我们为每个组件实例
  // 返回同一个对象的引用
  data: function () {
    return {
    	arr: []
    }
  },
  computed: {
  	arr: function() {
  		if (!this.path) return []

  		let arr = this.path || ''
  			.replace(/[MmAa\s]/g, ',')
  			.replace(/^,/, '')
  			.split(',')
  			.map(function(val) {return +val})
  	
  		if (/a/.test(this.path)) {
  			arr[arr.length - 2] += arr[0]
  			arr[arr.length - 1] += arr[1]
  		}

  		return arr
  	},

  	circle: function() {
  		if (!this.arr.length) return { cx: 0, cy: 0, r: 4, show: false }

  		let path = jPaths(this.path)
  		let midPoint = path.at(0.5 * path.length()).point
  		let threePoints = this.arr.slice(0, 2).concat(midPoint, this.arr.slice(-2))
  		let centerPoint = getArcCenter(threePoints, this.arr[2], this.arr[3], this.arr[4] * Math.PI / 180)

  		return {cx: centerPoint[0], cy: centerPoint[1], r: 4, show: true}
  	}
  }
})