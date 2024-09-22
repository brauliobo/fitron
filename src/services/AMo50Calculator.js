import RRIntCalculator from './RRIntCalculator'

export default class AMo50Calculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    const recentRrs = this.recentRrs

    if (recentRrs.length === 0) {
      this.metricValue = 0
      this.metricSubject.next(this.metricValue)
      return
    }

    const sum = recentRrs.reduce((acc, val) => acc + val, 0)
    const meanRR = sum / recentRrs.length

    const count = recentRrs.filter(rri => Math.abs(rri - meanRR) > 50).length

    const amo50 = (count / recentRrs.length) * 100

    this.metricValue = amo50
    this.metricSubject.next(this.metricValue)
  }
}

