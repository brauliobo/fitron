<template>
  <div>
    <p><b>pNN50:</b> {{ value.toFixed(2) }}%</p>
  </div>
</template>

<script>
import { opts } from '../services/store'
import pNN50Calculator from '../services/pNN50Calculator.js'
import RRIntCalculatorMixin from '../mixins/RRIntCalculatorMixin.js'

export default {
  mixins: [RRIntCalculatorMixin],
  data() {
    return {
      opts: opts,
      calculatorClass: pNN50Calculator
    }
  }
}
</script>

<style scoped>
</style>

