<template>
  <div>
    <p><b>AMo50:</b> {{ value.toFixed(2) }}%</p>
  </div>
</template>

<script>
import { opts } from '../services/store'
import AMo50Calculator from '../services/AMo50Calculator.js'
import RRIntCalculatorMixin from '../mixins/RRIntCalculatorMixin.js'

export default {
  name: 'AMo50Component',
  mixins: [RRIntCalculatorMixin],
  data() {
    return {
      opts: opts, // Ensure 'opts' is properly imported or defined
      calculatorClass: AMo50Calculator
    }
  }
}
</script>

<style scoped>
</style>

