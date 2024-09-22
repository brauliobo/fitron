<template>
  <div>
    <p><b>MxDMn:</b> {{ value.toFixed(2) }}ms</p>
  </div>
</template>

<script>
import { opts } from '../services/store'
import MxdmnCalculator from '../services/MxDMnCalculator.js'
import RRIntCalculatorMixin from '../mixins/RRIntCalculatorMixin.js'

export default {
  name: 'MxdmnComponent',
  mixins: [RRIntCalculatorMixin],
  data() {
    return {
      opts: opts,
      calculatorClass: MxdmnCalculator
    }
  }
}
</script>

<style scoped>
</style>

