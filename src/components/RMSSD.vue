<template>
  <div>
    <p><b>RMSSD:</b> {{ value.toFixed(2) }} ms</p>
  </div>
</template>

<script>
import { opts } from '../services/store'
import RMSSDCalculator from '../services/RMSSDCalculator.js'

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
          this.calculator = new RMSSDCalculator(newDevice, this.opts)

          this.subscription = this.calculator.getRmssdObservable().subscribe(rmssd => this.value = rmssd)
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

