<template>
  <div>
    <p>
      <b>AMo50:</b>
      {{ value.toFixed(2) }}% - Mean: {{meanValue.toFixed(2)}}%
    </p>
  </div>
</template>

<script>
import AMo50Calculator from '../services/AMo50Calculator.js'
import MetricMixin from '../mixins/MetricMixin.js'

export default {
  mixins: [MetricMixin],
  data() {
    return {
      calculatorClass: AMo50Calculator
    }
  }
}
</script>

<style scoped>
</style>

