<template>
  <div>
    <router-link to="/">Go to index</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keywords: '',
      tableLoading: true,
      currentPage: 1,
      pageSize: 8,
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