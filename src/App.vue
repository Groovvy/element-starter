<template>
  <el-table
              :data="tableData"
              style="width: 100%">
          <el-table-column
                  label="游戏名"
                  prop="nickname">
          </el-table-column>
          <el-table-column
                  label="Steam账号"
                  prop="steam">
          </el-table-column>
          <el-table-column
                  label="Email"
                  prop="email">
          </el-table-column>
          <el-table-column
                  label="使用人"
                  prop="owner">
          </el-table-column>
          <el-table-column
                  label="通过训练"
                  prop="hasTrained">
              <template slot-scope="scope">{{ scope.row.hasTrained === 0 ? '否' : '是' }}</template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="primary"
                          size="mini"
                          @click="open(scope.$index, scope.row)">查看密码</el-button>

              </template>
          </el-table-column>
      </el-table>
</template>

<script>
export default {
  data(){
    return {
      tableData: []
    }
  },
  mounted() {
            axios.get('https://mock.apifox.cn/m1/989716-0-default/api/account').then(response=>(this.tableData=response.data));
        },
        methods: {
            open(index, row) {
                this.$prompt('请输入口令', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    let that = this;
                    axios.get('https://mock.apifox.cn/m1/989716-0-default/api/auth')
                        .then(function (res) {
                            // 请求成功
                            debugger
                            if(value !== res.data.auth+''){
                                that.$message.error('口令错误');
                                return;
                            }
                            that.$alert('steam密码为:'+row.steamPwd+'<br>'+'邮箱密码为:'+row.emailPwd, '提示', {
                                confirmButtonText: '确定',
                                dangerouslyUseHTMLString:true
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
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
