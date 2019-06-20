<template>
  <el-row class="tac">
    <el-form :inline="true" class="demo-form-inline" style="margin-top: 30px;">
      <el-form-item label="商品哈希" style="margin-right: 70px;">
        <el-input v-model="itemHash" style="width: 600px;" placeholder="请输入商品哈希值"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryBlockChain">查询</el-button>
      </el-form-item>
    </el-form>

    <el-row style="margin-top: 40px; text-align: left;" v-if="descriptions.length != 0">
      <el-col :span="14" :offset="4">
        <div style="text-align: left; margin-bottom: 40px; margin-left: 40px;">
          <!-- <p><el-tag>商品信息</el-tag></p> -->
          <el-card :body-style="{padding: '0', paddingLeft: '20px'}">
            <div slot="header" class="clearfix">
              <span>商品信息</span>
            </div>
            <div v-for="(item, index2) in descriptions[descriptions.length - 1].item" :key="'item'+(index2+1)">
              <p> <el-tag>商品名： {{item.name}} </el-tag>
                  <el-tag>产地： {{item.source}} </el-tag>
                  <el-tag>出产时间： {{item.create_date}} </el-tag>
                  <el-tag>质检结果： {{item.is_qualified}} </el-tag>
              </p>
              <p> <el-tag>哈希： {{item.hash}} </el-tag></p>
            </div>
          </el-card>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(description, index) in descriptions"
            :key="'transaction-' + (index+1)"
            :timestamp="'交易'+(index+1)" placement="top">
            <el-card style="text-align: left;" :body-style="{padding: '0', paddingLeft: '20px'}">
              <p>
                <el-tag type="success">哈希： {{description.hash}}</el-tag>
              </p>
              <p>
                <el-tag type="success">交易类型： {{description.type}}</el-tag>
                <el-tag type="success">发送方： {{description.from}}</el-tag>
                <el-tag type="success">接收方： {{description.to}}</el-tag>
              </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
  </el-row>
</template>

<script type="text/javascript">
  export default {
    name: "trace",
    data() {
      return {
        server_address: localStorage[this.$route.params.nodename],
        nodes: [],
        transactions: [],
        descriptions: [],
        itemHash: ''
      }
    },
    created() {
    },
    beforeRouteUpdate(to, from, next) {
      this.server_address = localStorage[to.params.nodename];
      this.getNodeList();
      next();
    },
    methods: {
      queryBlockChain() {
        var self = this;
        self.$http({
          url: self.server_address + "/blockchain/trace",
          method: 'post',
          data: {
            hash: self.itemHash
          }
        })
        .then(function(resp) {
          self.nodes = resp.data.nodes;
          self.transactions = resp.data.transactions;
          if(self.transactions.length == 0) {
            self.$message({
              message: "抱歉，没有该商品信息！",
              type: "error"
            });
            return;
          }

          if(self.nodes.length >= 2) {
            // 考虑交易有售出的情况
            if(self.nodes.length == self.transactions.length){
              self.nodes.push({name: "消费者"});
            }
            console.log("in");
            var fIndex = 0;
            var tIndex = fIndex + 1;
            for(var transaction of self.transactions) {
              var description = {
                'from': self.nodes[fIndex].name,
                'to': self.nodes[tIndex].name,
                'hash': transaction['hash'],
                "type": transaction["type"],
                'item': []
              };
              for(var item of transaction.item) {
                description.item.push({
                  'name': item.name,
                  'source': item.source,
                  'volume': item.volume,
                  'create_date': self.getDateStr(item.create_date),
                  'hash': item.hash,
                  'is_qualified': item.is_qualified ? '合格' : '不合格'
                })
              }
              fIndex += 1;
              tIndex += 1;
              self.descriptions.push(description);
            }

          }
        }).catch(function(err) {
          console.log(err);
        })
      },
      getDateStr(timestamp) {
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = this.bit2(date.getMonth() + 1);
        var day = this.bit2(date.getDate());
        var hour = this.bit2(date.getHours());
        var minute = this.bit2(date.getMinutes());
        var second = this.bit2(date.getSeconds());

        return year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second;
      },
      bit2(num) {
        return num >= 10 ? num : '0' + num;
      },
    }
  }
</script>