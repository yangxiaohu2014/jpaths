import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import GetArcCenter from '@/components/getArcCenter'
import Tween from '@/components/tween'
import ToCurve from '@/components/toCurve'
import CutArc from '@/components/cutArc'
import CutBezier from '@/components/cutBezier'

// import HelloWorld from '@/components/HelloWorld'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/getArcCenter',
      name: 'getArcCenter',
      component: GetArcCenter
    },
    {
      path: '/tween',
      name: 'tween',
      component: Tween
    },
    {
      path: '/toCurve',
      name: 'toCurve',
      component: ToCurve	
    },
    {
      path: '/cutArc',
      name: 'cutArc',
      component: CutArc	
    },
    {
      path: '/cutBezier',
      name: 'cutBezier',
      component: CutBezier
    }
  ]
})
