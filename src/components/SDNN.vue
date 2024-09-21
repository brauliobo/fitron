<template>
  <div>
    <h4>SDNN Calculator</h4>
    <p>SDNN: {{ sdnnValue.toFixed(2) }} ms</p>
    <p>Number of R-R Intervals: {{ rrIntervalCount }}</p>
  </div>
</template>

<script>
import SdnnCalculator from '../services/SDNNCalculator.js';

export default {
  data() {
    return {
      sdnnCalculator: null,
      sdnnValue: 0,
      rrIntervalCount: 0,
      sdnnSubscription: null,
    };
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler(newDevice) {
        this.init()
        if (newDevice) {
          this.sdnnCalculator = new SdnnCalculator(newDevice, 60)

          // Subscribe to the SDNN value
          this.sdnnSubscription = this.sdnnCalculator.getSdnnObservable().subscribe(sdnn => {
            this.sdnnValue = sdnn;
            this.rrIntervalCount = this.sdnnCalculator.rrIntervals.length;
          })
        }
      },
    },
  },

  methods: {
    init() {
      this.sdnnCalculator   && (this.sdnnCalculator.destroy(), this.sdnnCalculator = null)
      this.sdnnSubscription && (this.sdnnSubscription.unsubscribe(), this.sdnnSubscription = null)
    }
  },

  beforeDestroy() {
    this.init()
  },
};
</script>

