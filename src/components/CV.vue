<template>
  <div>
    <p>
      <b>CV:</b>
      {{ value.toFixed(2) }}% - Mean: {{meanValue.toFixed(2)}}%
    </p>
  </div>
</template>

<script>
import CvCalculator from '../services/CVCalculator.js'
import MetricMixin from '../mixins/MetricMixin.js'

export default {
  mixins: [MetricMixin],
  data() {
    return {
      calculatorClass: CvCalculator
    }
  }
}
</script>

<style scoped>
</style>

