<template>
  <div>
    <p><b>CV:</b> {{ value.toFixed(2) }}%</p>
  </div>
</template>

<script>
import { opts } from '../services/store'
import CvCalculator from '../services/CVCalculator.js'
import RRIntCalculatorMixin from '../mixins/RRIntCalculatorMixin.js'

export default {
  name: 'CvComponent',
  mixins: [RRIntCalculatorMixin],
  data() {
    return {
      opts: opts, // Ensure 'opts' is properly imported or defined
      calculatorClass: CvCalculator
    }
  }
}
</script>

<style scoped>
</style>

