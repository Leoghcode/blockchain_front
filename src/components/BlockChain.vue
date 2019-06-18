<template>
  <el-row class="tac">
    <div style="text-align: right;">
      <el-button @click="getBlockChain">刷新区块链</el-button>
    </div>
    <el-row :gutter="20">
      <el-col v-for="block in blockChain" :key="block.index" :span="8" style="margin-top: 10px;">
        <el-card style="height: 300px;">
          <div :title="block" style="text-align: left; word-wrap: break-word; word-break: normal;">
            <div style="text-align: right;">
              <el-button
                size="mini"
                @click="blockDetail(block)">详情</el-button>
            </div>
            <p>区块号： {{block.index}}</p>
            <p>哈希： {{block.hash}}</p>
            <p>前哈希： {{block.previousHash}}</p>
            <p>创建时间： {{getDateStr(block.timestamp)}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="60%">
      <div style="width: 80%;margin: 0 auto;">
        <div style="text-align: left;">
          <p>区块{{chosedBlock.index}}</p>
          <p>哈希: {{chosedBlock.hash}}</p>
          <p>前哈希: {{chosedBlock.previousHash}}</p>
          <p>时间: {{getDateStr(chosedBlock.timestamp)}}</p>
          <p>上笔交易: {{chosedBlock.lastTransaction ? chosedBlock.lastTransaction : 'null'}}</p>
        </div>
        <el-table
          :data="chosedBlock.transactions"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table border :data="props.row.item" size="mini">
                <el-table-column
                  prop="name"
                  label="商品名称"
                  width="80"
                  fixed>
                </el-table-column>
                <el-table-column
                  prop="source"
                  label="产地"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="volume"
                  label="数量"
                  width="80">
                </el-table-column>
                <el-table-column
                  label="创建时间"
                  width="120">
                  <template slot-scope="scope">
                    <span>{{ getDateStr(scope.row.create_date) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="hash"
                  label="哈希"
                  width="280">
                </el-table-column>
                <el-table-column
                  label="质检结果"
                  width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row.is_qualified ? '合格' : '不合格' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="商品状态"
                  width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row.is_sold ? '已卖出' : '未卖出' }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div>
                {{props.row.item}}
              </div> -->
            </template>
          </el-table-column>
          <el-table-column
            label="发送方"
            width="180">
            <template slot-scope="scope">
              <span style="" :title="scope.row.from">{{ scope.row.from.substring(0,55)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="接收方"
            width="180">
            <template slot-scope="scope">
              <span style="" :title="scope.row.to">{{ scope.row.to.substring(0,55) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="hash"
            label="哈希">
          </el-table-column>
          <el-table-column
            label="多签名"
            width="100">
            <template slot-scope="scope">
              <span style="">{{ scope.row.multiSign ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="值"
            width="80">
          </el-table-column>
        </el-table>
        <div style="margin-top: 30px; text-align: right;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script type="text/javascript">
  export default {
    name: "blockchain",
    data() {
      return {
        server_address: localStorage[this.$route.params.nodename],
        blockChain: [],
        dialogVisible: false,
        chosedBlock: {
          index: '',
          hash: '',
          previousHash: '',
          timestamp: '',
          lastTransaction: '',
          transactions: []
        }
      }
    },
    created() {
      console.log(this.server_address);
      this.getBlockChain();
    },
    methods: {
      getBlockChain() {
        var self = this;
        if(!this.server_address) {
          this.getServerAddress();
          return;
        }
        self.$http(self.server_address + "/blockchain/get")
        .then(function(resp) {
          self.blockChain = resp.data;
        }).catch(function(err) {
          console.log("error");
        })
      },
      getServerAddress() {
        var self = this;
        self.CA_address = "http://localhost:8080/CA";
        self.$http({
          url: this.CA_address + "/getByName",
          params: {
            name: self.$route.params.nodename
          }
        }).then(function(resp) {
          var nodename = self.$route.params.nodename;
          localStorage[nodename] = 'http://' + self.server_info.address;
          self.server_address = localStorage[nodename];
        }).catch(function(err) {
          console.log("error");
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
      blockDetail(block) {
        console.log(block);
        this.chosedBlock = block;
        this.dialogVisible = true;
      }
    }
  }
</script>