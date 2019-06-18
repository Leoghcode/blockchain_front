<template>
  <el-row class="tac">
    <el-row style="margin-top: 20px;">
      <p>发送请求</p>
      <el-col :span="10">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="接收方">
            <el-select v-model="form.to" placeholder="请选择接收方">
              <el-option v-for="node in nodeList" :label="node.name" :value="node.name" :key="node.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.type" placeholder="请选择请求类型">
              <el-option v-for="type in types" :label="type" :value="type" :key="type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品">
            <el-select v-model="form.items" placeholder="请选择请求类型">
              <el-option v-for="item in itemList" :label="item.name" :value="item" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addRequest">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="10" :offset="4">
        <p style="margin-top: -10px">商品详情</p>
        <div v-if="jsonItems != ''" style="text-align: left;word-wrap: break-word;">
          <p>商品: {{jsonItems['商品']}}</p>
          <p>产地: {{jsonItems['产地']}}</p>
          <p>数量: {{jsonItems['数量']}}</p>
          <p>出产日期: {{jsonItems['出产日期']}}</p>
          <p>质检结果: {{jsonItems['质检结果']}}</p>
          <p>哈希: {{jsonItems['哈希']}}</p>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-divider></el-divider>
      <div style="text-align: right;">
        <el-button @click="getRequestList">刷新请求列表</el-button>
      </div>
      <p>请求列表</p>
      <el-col :span="24">
        <el-table
          :data="requestList"
          style="width: 100%"
          border>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div>
                {{JSON.stringify(JSON.parse(props.row.transaction), null, 2)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="fromShort"
            label="发送方"
            width="410">
          </el-table-column>
          <el-table-column
            prop="toShort"
            label="接收方"
            width="410">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80">
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>操作</span>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="acceptRequest(scope.$index, scope.row)">通过</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="cancelRequest(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </el-row>
</template>

<script type="text/javascript">
  export default {
    name: "nodelist",
    data() {
      return {
        server_address: localStorage[this.$route.params.nodename],
        itemList: [],
        nodeList: [],
        form: {
          to: '',
          type: '',
          items: ''
        },
        types: ['质检', '质检结果', '商品入库', '售出'],
        requestList: []
      }
    },
    created() {
      console.log(this.server_address);
      this.getNodeList();
      if(this.isManufacter) {
        this.getItemList();
      }
      this.getTransitItemList();
      this.getRequestList();
    },
    computed: {
      jsonItems() {
        var obj = this.form.items;
        if(obj == '') return '';

        console.log(obj);
        var jsonObj = {
          "商品": obj.name,
          "产地": obj.source,
          "数量": obj.volume,
          "出产日期": this.getDateStr(obj),
          "质检结果": obj.is_qualified ? "合格" : "不合格",
          "哈希": obj.hash,
        };
        return jsonObj;

      },
      isManufacter() {
        if(this.$route.params.nodename == 'node1') {
          return true;
        }
        return false;
      }
    },
    methods: {
      logItem() {

      },
      getNodeList() {
        var self = this;
        if(!this.server_address) {
          this.getServerAddress();
          return;
        }
        self.$http(self.server_address + "/node/list")
        .then(function(resp) {
          self.nodeList = resp.data;
          for(var node of self.nodeList) {
            node.address = node.host + ":" + node.port;
          }
        }).catch(function(err) {
          console.log("error");
        })
      },
      getItemList() {
        var self = this;
        if(!this.server_address) {
          this.getServerAddress();
          return;
        }
        self.$http(self.server_address + "/transaction/getItems")
        .then(function(resp) {
          for(var item of resp.data) {
            if(!item.is_sold) {
              self.itemList.push(item);
            }
          }
        }).catch(function(err) {
          console.log("error");
        })
      },
      getTransitItemList() {
        var self = this;
        if(!this.server_address) {
          this.getServerAddress();
          return;
        }
        self.$http(self.server_address + "/transaction/getRequests")
        .then(function(resp) {
          for(var request of resp.data) {
            if(request.status != 1) continue;
            var transaction = request.transaction;
            for(var _item of transaction.item) {
              _item['transaction'] = transaction.from;
              self.itemList.push(_item);
            }
          }
        }).catch(function(err) {
          console.log(err);
        })
      },
      getRequestList() {
        var self = this;
        if(!this.server_address) {
          this.getServerAddress();
          return;
        }
        self.$http(self.server_address + "/transaction/getRequests")
        .then(function(resp) {
          self.requestList = resp.data;
          var statusMap = ['待审核', '通过', '拒绝'];
          var reqList = [];
          var index = 0;
          for(var request of self.requestList) {
            request.index = index;
            index++;
            request.fromShort = request.from.substring(0, 85) + "...";
            request.toShort = request.to.substring(0, 85) + "...";
            request.transaction = JSON.stringify(request.transaction);
            if(request.status == 0) {
              request.status = '待审核';
              reqList.push(request);
            }
          }
          self.requestList = reqList;
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
      acceptRequest(index, row) {
        console.log(row);
        var self = this;
        self.$http(self.server_address + "/transaction/acceptRequest/" + row.index)
        .then(function(resp) {
          console.log(resp.data);
          self.$message({
            type: 'success',
            message: '操作成功'
          });
          window.setTimeout(function(){window.location.reload();}, 500);
        }).catch(function(err) {
          console.log("error");
        })
      },
      cancelRequest(index, row) {
        var self = this;
        self.$http(self.server_address + "/transaction/cancelRequest/" + row.index)
        .then(function(resp) {
          console.log(resp.data);
          self.$message({
            type: 'success',
            message: '操作成功'
          });
          window.setTimeout(function(){window.location.reload();}, 500);
        }).catch(function(err) {
          console.log("error");
        })
      },
      addRequest() {
        var self = this;
        self.$http({
          url: self.server_address + "/transaction/send",
          method: 'post',
          data: {
            to: self.form.to,
            type: self.form.type,
            items: [self.form.items]
          }
        })
        .then(function(resp) {
          console.log(resp.data);
          self.$message({
            type: 'success',
            message: '添加成功'
          });
        }).catch(function(err) {
          console.log("error");
        })
      }
    }
  }
</script>