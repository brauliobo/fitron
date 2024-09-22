import RRIntCalculator from './RRIntCalculator'

export default class Pnn50Calculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    if (this.data.length >= 2) {
      const n = Math.min(this.pulsesNumber, this.data.length)
      const recentRrs = this.data.slice(-n)
      const differences = recentRrs.slice(1).map((val, i) => Math.abs(val - recentRrs[i]))
      const count = differences.filter(diff => diff > 50).length
      const pnn50 = (count / differences.length) * 100
      this.metricValue = pnn50
      this.metricSubject.next(this.metricValue)
    } else {
      this.metricValue = 0
      this.metricSubject.next(this.metricValue)
    }
  }
}

