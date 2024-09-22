import { opts } from '../services/store'

export default {
  data() {
    return {
      opts:  opts,
      value: 0,
      calculator:   null,
      subscription: null,
    }
  },
  props: ['device'],
  watch: {
    device: {
      immediate: true,
      handler(newDevice) {
        this.reset()
        if (newDevice && this.calculatorClass) {
          this.calculator = new this.calculatorClass(newDevice, this.opts)
          this.subscription = this.calculator.getMetricObservable().subscribe(metric => {
            this.value = metric
            this.addMetricValue(metric) // for MetricHistoryMixin
          })
        }
      },
    },
  },
  methods: {
    reset() {
      this.calculator && (this.calculator.destroy(), this.calculator = null)
      this.subscription && (this.subscription.unsubscribe(), this.subscription = null)
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    if (!this.calculatorClass) {
      console.error('RRIntCalculatorMixin requires "calculatorClass" to be defined in the component.')
    }
  },
}

