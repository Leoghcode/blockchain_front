<template>
  <el-row class="tac">
    <div style="text-align: right;">
      <el-button @click="addNodeList">刷新节点列表</el-button>
    </div>
    <el-table
      :data="nodeList"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="节点"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="位置"
        width="180">
      </el-table-column>
      <el-table-column
        prop="key"
        label="公钥">
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script type="text/javascript">
  export default {
    name: "nodelist",
    data() {
      return {
        server_address: localStorage[this.$route.params.nodename],
        nodeList: []
      }
    },
    created() {
      // console.log(this.server_address);
      this.getNodeList();
    },
    beforeRouteUpdate(to, from, next) {
      this.server_address = localStorage[to.params.nodename];
      this.getNodeList();
      next();
    },
    methods: {
      getNodeList() {
        var self = this;
        self.$http(self.server_address + "/node/list")
        .then(function(resp) {
          self.nodeList = resp.data;
          if(self.nodeList.length == 0) {
            self.addNodeList();
            return;
          }
          for(var node of self.nodeList) {
            node.address = node.host + ":" + node.port;
          }
        }).catch(function(err) {
          console.log("error");
        })
      },
      addNodeList() {
        var self = this;
        self.$http(self.server_address + "/node/addFromCA")
        .then(function(resp) {
          self.nodeList = resp.data;
          for(var node of self.nodeList) {
            node.address = node.host + ":" + node.port;
          }
        }).catch(function(err) {
          console.log("error");
          console.log(err);
        })
      },
    }
  }
</script>