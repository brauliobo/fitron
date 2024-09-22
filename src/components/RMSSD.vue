<template>
  <div>
    <p><b>RMSSD:</b> {{ value.toFixed(2) }} ms</p>
  </div>
</template>

<script>
import { opts } from '../services/store'
import RmssdCalculator from '../services/RMSSDCalculator.js'
import RRIntCalculatorMixin from '../mixins/RRIntCalculatorMixin.js'

export default {
  mixins: [RRIntCalculatorMixin],
  data() {
    return {
      opts: opts,
      calculatorClass: RmssdCalculator
    }
  }
}
</script>

<style scoped>
</style>

