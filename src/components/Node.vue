<template>
  <el-row class="tac" :gutter="20">
    <el-col :span="4" :offset="2">
      <h5>功能导航</h5>
      <el-menu
        default-active="NodeList"
        class="el-menu-vertical-demo"
        @select="switchPage"
      >
        <el-menu-item index="NodeList"
        :class="{active: curName == 'NodeList', inactive: curName != 'NodeList'}">
          <i class="el-icon-menu"></i>
          <span slot="title">节点列表</span>
        </el-menu-item>
        <el-menu-item index="ItemList"
        :class="{active: curName == 'ItemList', inactive: curName != 'ItemList'}">
          <i class="el-icon-document"></i>
          <span slot="title">商品列表</span>
        </el-menu-item>
        <el-menu-item index="RequestList"
        :class="{active: curName == 'RequestList', inactive: curName != 'RequestList'}">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">请求列表</span>
        </el-menu-item>
        <el-menu-item index="BlockChain"
        :class="{active: curName == 'BlockChain', inactive: curName != 'BlockChain'}">
          <i class="el-icon-link"></i>
          <span slot="title">区块链&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </el-menu-item>
        <el-menu-item index="Trace"
        :class="{active: curName == 'Trace', inactive: curName != 'Trace'}">
          <i class="el-icon-search"></i>
          <span slot="title">商品溯源</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="16" :offset="1">
      <router-view/>
    </el-col>
  </el-row>
</template>

<script type="text/javascript">
  export default {
    name: "node",
    data() {
      return {
        CA_address: "http://localhost:8080/CA",
        server_info: {
          address: ""
        },
        curName: ''
      }
    },
    created() {
      this.curName = this.$route.name;
      console.log(this.$route.params.nodename);
    },
    watch: {
      '$route' (to, from) {
        this.curName = to.name;
      }
    },
    methods: {
      switchPage(index) {
        // console.log(index);
        this.$router.push({name: index});
      }
    }
  }
</script>

<style type="text/css" scoped>
  .active {
    color: #409EFF!important;
  }
  .inactive {
    color: #303133!important;
  }
</style>