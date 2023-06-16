<template>
  <el-row type="flex" justify="center">
    <el-form ref="ruleForm" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="汇率">
        <el-input-number v-model="form.huilv" :precision="2" :step="0.05" :max="6.5" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="使用折扣码">
        <el-switch
            v-model="form.showPromo"
            active-color="#13ce66">
        </el-switch>
      </el-form-item>
      <el-form-item label="选择网站" v-show="form.showPromo">
        <el-select v-model="form.promo" placeholder="选择网站">
          <el-option label="champs/kids" value="6.5"></el-option>
          <el-option label="footlocker" value="26"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="一单几双" v-show="form.showPromo">
        <el-select v-model="form.count" placeholder="">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转运费" prop="carriage">
        <el-input v-model.number="form.carriage"></el-input>
      </el-form-item>
      <el-form-item label="快递费" prop="delivery">
        <el-input v-model.number="form.delivery"></el-input>
      </el-form-item>
      <el-form-item label="网站原价" prop="dollar">
        <el-input v-model.number="form.dollar"></el-input>
      </el-form-item>
      <el-form-item label="得物到手价" prop="sales">
        <el-input v-model.number="form.sales"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">计算</el-button>
        <el-button @click="resetForm('ruleForm')">清空</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>

export default {
  data() {
    let checkValue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        callback();
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback();
        }
      }, 200)
    }
    return {
      form: {
        huilv: 5.8,
        showPromo: false,
        promo: '6.5',
        count: 2,
        dollar: '',
        sales: '',
        carriage: 100,
        delivery: 10
      },
      rules: {
        dollar: [{required: true, validator: checkValue, trigger: "blur"}],
        sales: [{required: true, validator: checkValue, trigger: "blur"}],
        carriage: [{required: true, validator: checkValue, trigger: "blur"}],
        delivery: [{required: true, validator: checkValue, trigger: "blur"}]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
      });
      let profit = 0;
      if (!this.form.showPromo) {
        profit = this.form.sales - (this.form.huilv * this.form.dollar) - this.form.carriage - this.form.delivery;
        this.$alert('利润预计:' + profit, '计算结果', {
          confirmButtonText: '确定',
        });
        return;
      }

      let lastDollar = this.form.dollar * 0.75;
      let promoPrice = this.form.promo / this.form.count;
      profit = this.form.sales - (this.form.huilv * lastDollar) - this.form.carriage - this.form.delivery - promoPrice;
      this.$alert('利润预计:' + profit, '计算结果', {
        confirmButtonText: '确定',
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
