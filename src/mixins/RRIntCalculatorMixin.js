export default {
  data() {
    return {
      calculator: null,
      value: 0,
      subscription: null,
      opts: this.opts, // Assumes 'opts' is defined in the component's data
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
          this.subscription = this.calculator.getMetricObservable().subscribe(metric => this.value = metric)
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

