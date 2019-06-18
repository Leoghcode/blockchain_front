import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Node from '@/components/Node'
import NodeList from '@/components/NodeList'
import ItemList from '@/components/ItemList'
import RequestList from '@/components/RequestList'
import BlockChain from '@/components/BlockChain'
import Trace from '@/components/Trace'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/node/:nodename',
      name: 'Node',
      redirect: '/node/:nodename/nodelist',
      component: Node,
      children: [
        {
          path: 'nodelist',
          name: 'NodeList',
          component: NodeList
        },
        {
          path: 'itemlist',
          name: 'ItemList',
          component: ItemList
        },
        {
          path: 'requestlist',
          name: 'RequestList',
          component: RequestList
        },
        {
          path: 'blockchain',
          name: 'BlockChain',
          component: BlockChain
        },
        {
          path: 'trace',
          name: 'Trace',
          component: Trace
        },
      ]
    }
  ]
})
