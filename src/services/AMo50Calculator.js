import RRIntCalculator from './RRIntCalculator'

export default class AMo50Calculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    if (this.data.length === 0) {
      this.metricValue = 0
      this.metricSubject.next(this.metricValue)
      return
    }

    // Calculate the mean R-R interval
    const sum = this.data.reduce((acc, val) => acc + val, 0)
    const meanRR = sum / this.data.length

    // Count R-R intervals deviating from the mean by more than 50 ms
    const count = this.data.filter(rri => Math.abs(rri - meanRR) > 50).length

    // Calculate AMo50 percentage
    const amo50 = (count / this.data.length) * 100

    // Update and emit the metric value
    this.metricValue = amo50
    this.metricSubject.next(this.metricValue)
  }
}

