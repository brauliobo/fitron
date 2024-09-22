import RRIntCalculator from './RRIntCalculator'

export default class MxdmnCalculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    if (this.data.length >= 2) {
      const n = Math.min(this.pulsesNumber, this.data.length)
      const recentRrs = this.data.slice(-n)
      
      // Placeholder Calculation Logic
      // Example: Calculate the mean of absolute differences from the mean R-R interval
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

