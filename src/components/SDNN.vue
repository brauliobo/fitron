<template>
  <div>
    <p><b>SDNN:</b> {{ value.toFixed(2) }} ms</p>
  </div>
</template>

<script>
import { opts } from '../services/store'
import SDNNCalculator from '../services/SDNNCalculator.js'

export default {
  data() {
    return {
      calculator: null,
      value: 0,
      subscription: null,
      opts: opts,
    };
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler(newDevice) {
        this.reset()
        if (newDevice) {
          this.calculator = new SDNNCalculator(newDevice, this.opts)

          this.subscription = this.calculator.getMetricObservable().subscribe(sddn => this.value = sddn)
        }
      },
    },
  },

  methods: {
    reset() {
      this.calculator   && (this.calculator.destroy(), this.calculator = null)
      this.subscription && (this.subscription.unsubscribe(), this.subscription = null)
    }
  },

  beforeDestroy() {
    this.reset()
  },
};
</script>

