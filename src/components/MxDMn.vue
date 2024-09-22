<template>
  <div>
    <p><b>MxDMn:</b> {{ value.toFixed(2) }} ms - Mean: {{meanValue.toFixed(2)}}</p>
  </div>
</template>

<script>
import MxdmnCalculator from '../services/MxDMnCalculator.js'
import MetricMixin from '../mixins/MetricMixin.js'

export default {
  mixins: [MetricMixin],
  data() {
    return {
      calculatorClass: MxdmnCalculator
    }
  }
}
</script>

<style scoped>
</style>

