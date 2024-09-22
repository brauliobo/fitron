<template>
  <div>
    <p>
      <b>pNN50:</b>
      {{ value.toFixed(2) }}% - Mean: {{meanValue.toFixed(2)}}%
    </p>
  </div>
</template>

<script>
import pNN50Calculator from '../services/pNN50Calculator.js'
import MetricMixin from '../mixins/MetricMixin.js'

export default {
  mixins: [MetricMixin],
  data() {
    return {
      calculatorClass: pNN50Calculator
    }
  }
}
</script>

<style scoped>
</style>

