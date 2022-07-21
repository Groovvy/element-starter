<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input placeholder="支持搜索游戏名" v-model="keywords"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="paginationData" v-loading.body="tableLoading" highlight-current-row
                :header-cell-style="{'text-align':'center',background:'#f5f7fa'}"
                :cell-style="{'text-align':'center'}" style="width: 100%">
        <el-table-column
            label="游戏名"
            prop="nickname">
        </el-table-column>
        <el-table-column
            label="Steam账号"
            prop="steam">
          <template slot-scope="scope">
            {{ scope.row.steam }}
            <el-button icon="el-icon-document-copy" size="small" circle @click="copyValue(scope.row.steam)"></el-button>
          </template>
        </el-table-column>
        <el-table-column
            label="Email"
            prop="email">
          <template slot-scope="scope">
            {{ scope.row.email }}
            <el-button icon="el-icon-link" size="small" circle @click="toEmailLogin(scope.row.email)"></el-button>
          </template>
        </el-table-column>
        <el-table-column
            label="使用人"
            prop="owner">
        </el-table-column>
        <el-table-column
            label="通过训练"
            prop="hasTrained" width="100">
          <template slot-scope="scope">
            <i class="el-icon-error" :style="{'color':'red'}" v-if="scope.row.hasTrained === 0"></i>
            <i class="el-icon-success" :style="{'color':'#409EFF'}" v-if="scope.row.hasTrained === 1"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       @click="open(scope.$index, scope.row)">查看密码
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-bar">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keywords: '',
      tableLoading: true,
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      paginationData: []
    }
  },
  mounted() {
    //this.$axios.get('https://mock.apifox.cn/m1/989716-0-default/api/account').then(response => (this.tableData = response.data, this.tableLoading = false));
    this.tableList(1, null)
  },
  watch: { //监听搜索框内容
    keywords: {
      handler() {
        this.tableList(1, this.keywords)
      }

    }

  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.tableList(val, this.keywords)
    },
    tableList(val, keyword) {
      debugger
      let that = this
      this.$axios.get('https://mock.apifox.cn/m1/989716-0-default/api/account').then(function (response) {
        if (keyword != null && keyword !== '') {
          response.data = response.data.filter(item => {
            return item.nickname.toLowerCase().includes(keyword.toLowerCase())
          })
        }
        that.totalSize = response.data.length
        that.paginationData = response.data.slice((val - 1) * that.pageSize, val * that.pageSize)
        that.tableLoading = false
      });
    },
    copyValue(value){
      let oInput = document.createElement('input');
      oInput.value = value;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      });
      oInput.remove()
    },
    toEmailLogin(email) {
      let oInput = document.createElement('input');
      oInput.value = email;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: '复制成功,即将跳转至邮箱登录',
        type: 'success'
      });
      oInput.remove()
      setTimeout(() => {
        window.open('https://qiye.aliyun.com/', '_blank')
      }, 1000);

    },
    open(index, row) {
      this.$prompt('请输入口令', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        let that = this;
        this.$axios.get('https://mock.apifox.cn/m1/989716-0-default/api/auth')
            .then(function (res) {
              // 请求成功
              debugger
              if (value !== res.data.auth + '') {
                that.$message.error('口令错误');
                return;
              }
              that.$alert('steam密码为:' + row.steamPwd + '<br>' + '邮箱密码为:' + row.emailPwd, '提示', {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true
              });
            })
            .catch(function (err) {
              // 请求失败
              console.log(err);
            })
            .then(function () {
              // 不管成功失败都会执行
            });
      }).catch(() => {
        console.log("cancel callback")
      });
    }
  }
}
</script>

<style>
.pagination-bar {
  padding-top: 10px;
  text-align: center;
}
</style>