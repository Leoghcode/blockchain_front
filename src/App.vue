<template>
  <div id="app">
    <!-- <el-row class="header">
      <span>BlockChain</span>
      <el-col :span="6" :offset="4">
        <el-menu mode="horizontal">
          <el-menu-item index="1"><router-link to="node/node1">node1</router-link></el-menu-item>
          <el-menu-item index="2"><router-link to="node/node2">node2</router-link></el-menu-item>
          <el-menu-item index="3"><router-link to="node/validator">validator</router-link></el-menu-item>
        </el-menu>

      </el-col>
    </el-row> -->
    <el-menu
      default-active="this.$router.path"
      router
      class="header"
      mode="horizontal"
      background-color="#409EFF"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/" class="title">
        BlockChain
      </el-menu-item>
      <el-menu-item index="4" class="gap">
        <div></div>
      </el-menu-item>
      <el-menu-item v-for="(item, i) in routerList" :key="i" :index="item.path">
        {{item.name}}
      </el-menu-item>
    </el-menu>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      CA_ADDRESS: 'http://localhost:8080/CA',
      routerList: [
        {path: '/node/nodeA', name: 'nodeA'},
        {path: '/node/node2', name: 'node2'},
        {path: '/node/validator', name: 'validator'},
      ]
    }
  },
  created(){
    this.getNodesFromCA();
  },
  methods: {
    getNodesFromCA() {
      var self = this;
      self.$http(self.CA_ADDRESS + "/all")
      .then(function(resp) {
        self.routerList = [];
        for(var node of resp.data) {
          self.routerList.push({
            path: '/node/' + node.name,
            name: node.name
          });
        }
      }).catch(function(err) {
        console.log("error");
      })
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
.header {
  margin-bottom: 40px;
}
.header a {
  text-decoration: none!important;
}
.title {
  font-size: 30px;
  color: rgb(255, 255, 255)!important;
  border-bottom-color: transparent!important;
  background-color: rgb(64, 158, 255)!important;
}
.gap {
  width: 400px;
}
.gap:hover {
  background-color: rgb(64, 158, 255)!important;
  cursor: default;
}
</style>
