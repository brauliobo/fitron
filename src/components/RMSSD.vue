<template>
  <div>
    <p>
      <b>RMSSD:</b>
      {{ value.toFixed(2) }}ms - Mean: {{meanValue.toFixed(2)}}ms
    </p>
  </div>
</template>

<script>
import RmssdCalculator from '../services/RMSSDCalculator.js'
import MetricMixin from '../mixins/MetricMixin.js'

export default {
  mixins: [MetricMixin],
  data() {
    return {
      calculatorClass: RmssdCalculator
    }
  }
}
</script>

<style scoped>
</style>

