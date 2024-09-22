<template>
  <div>
    <p>
      <b>SDNN:</b>
      {{ value.toFixed(2) }}ms - Mean: {{meanValue.toFixed(2)}}ms
    </p>
  </div>
</template>

<script>
import SdnnCalculator from '../services/SDNNCalculator.js'
import MetricMixin from '../mixins/MetricMixin.js'

export default {
  mixins: [MetricMixin],
  data() {
    return {
      calculatorClass: SdnnCalculator
    }
  }
}
</script>

<style scoped>
</style>

