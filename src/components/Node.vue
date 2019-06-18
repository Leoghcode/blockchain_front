<template>
  <el-row class="tac" :gutter="20">
    <el-col :span="4" :offset="2">
      <h5>功能导航</h5>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @select="switchPage"
      >
        <el-menu-item index="NodeList">
          <i class="el-icon-menu"></i>
          <span slot="title">节点列表</span>
        </el-menu-item>
        <el-menu-item index="ItemList">
          <i class="el-icon-document"></i>
          <span slot="title">商品列表</span>
        </el-menu-item>
        <el-menu-item index="RequestList">
          <i class="el-icon-setting"></i>
          <span slot="title">请求列表</span>
        </el-menu-item>
        <el-menu-item index="BlockChain">
          <i class="el-icon-setting"></i>
          <span slot="title">区块链</span>
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
        }
      }
    },
    created() {
      console.log(this.$route.params.nodename);
      this.getServerAddress();
    },
    methods: {
      getServerAddress() {
        var self = this;
        self.$http({
          url: this.CA_address + "/getByName",
          params: {
            name: self.$route.params.nodename
          }
        }).then(function(resp) {
          self.server_info = resp.data;
          var nodename = self.$route.params.nodename;
          localStorage[nodename] = 'http://' + self.server_info.address;
        }).catch(function(err) {
          console.log("error");
        })
      },
      switchPage(index) {
        console.log(index);
        this.$router.push({name: index});
      }
    }
  }
</script>