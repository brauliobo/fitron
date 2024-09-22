import RRIntCalculator from './RRIntCalculator'

export default class MxdmnCalculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    const recentRrs = this.recentRrs

    if (recentRrs.length >= 2) {
      const sum = recentRrs.reduce((acc, val) => acc + val, 0)
      const mean = sum / recentRrs.length
      const deviations = recentRrs.map(rri => Math.abs(rri - mean))
      const mxdmn = deviations.reduce((acc, val) => acc + val, 0) / deviations.length

      this.metricValue = mxdmn
      this.metricSubject.next(this.metricValue)
    } else {
      this.metricValue = 0
      this.metricSubject.next(this.metricValue)
    }
  }
}

