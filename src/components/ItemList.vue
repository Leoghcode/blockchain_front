<template>
  <el-row class="tac">
    <el-row>
      <div style="text-align: right;">
        <el-button @click="getTransitItemList">刷新中转商品列表</el-button>
      </div>
      <p>中转商品列表</p>
      <el-col :span="24">
        <el-table
          :data="transitItemList"
          style="width: 100%"
          border
          :span-method="objectSpanMethod">
          <el-table-column
            prop="transaction"
            label="请求号"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="商品"
            width="150">
          </el-table-column>
          <el-table-column
            prop="source"
            label="产地"
            width="150">
          </el-table-column>
          <el-table-column
            prop="volume"
            label="数量"
            width="100">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row v-show="isManufacter" style="margin-top: 20px;">
      <div style="text-align: right;">
        <el-button @click="getItemList">刷新商品列表</el-button>
      </div>
      <p>新建商品列表</p>
      <el-col :span="16" :offset="4">
        <el-table
          :data="itemList"
          style="width: 100%"
          border>
          <el-table-column
            prop="name"
            label="商品"
            width="240">
          </el-table-column>
          <el-table-column
            prop="source"
            label="产地"
            width="240">
          </el-table-column>
          <el-table-column
            prop="volume"
            label="数量">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;" v-show="isManufacter">
      <el-divider></el-divider>
      <p>添加商品</p>
      <el-col :span="12" :offset="6">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="产地">
            <el-input v-model="form.source"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="form.volume"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addItem">添加</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
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
        form: {
          name: '',
          source: '',
          volume: ''
        },
        transitItemList: [],
        colSpanIndexs: [],
        spanCol: [],
      }
    },
    created() {
      console.log(this.server_address);
      this.getItemList();
      this.getTransitItemList();
    },
    computed: {
      isManufacter() {
        if(this.$route.params.nodename == 'node1') {
          return true;
        }
        return false;
      }
    },
    methods: {
      getTransitItemList() {
        var self = this;
        if(!this.server_address) {
          this.getServerAddress();
          return;
        }
        self.$http(self.server_address + "/transaction/getRequests")
        .then(function(resp) {
          var index = 0;

          for(var request of resp.data) {
            if(request.status != 1) continue;
            var transaction = request.transaction;
            var length = transaction.item.length;
            self.colSpanIndexs.push(index);
            self.spanCol.push(length);
            index += length;
            for(var _item of transaction.item) {
              _item['transaction'] = transaction.from;
              self.transitItemList.push(_item);
            }
          }
          console.log(self.transitItemList);
        }).catch(function(err) {
          console.log(err);
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
          self.itemList = [];
          for(var item of resp.data) {
            if(!item.is_sold) {
              self.itemList.push(item);
            }
          }
        }).catch(function(err) {
          console.log("error");
        })
      },
      addItem() {
        var self = this;
        console.log(self.form);
        console.log([self.form]);
        self.$http({
          url: self.server_address + "/transaction/addItems",
          data: [{
            name: self.form.name,
            source: self.form.source,
            volume: self.form.volume,
          }],
          method: 'post'
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
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex == 0) {
          var id = this.colSpanIndexs.indexOf(rowIndex);
          if (id == -1) {
            return {
              rowspan: 0,
              colspan: 0
            }
          } else {
            return {
              rowspan: this.spanCol[id],
              colspan: 1
            }
          }
        }
      }
    }
  }
</script>