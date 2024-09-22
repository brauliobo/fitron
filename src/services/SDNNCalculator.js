// src/services/SdnnCalculator.js

import { watch } from 'vue'
import { Subject } from 'rxjs'
import { std } from 'mathjs'

export default class SdnnCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    this.device = device
    this.opts = opts // Reactive opts object
    this.pulsesNumber = opts.rrIntervals // Number of intervals for SDNN calculation
    this.maxRRIntervals = maxRRIntervals

    this.subscription = null
    this.data = [] // Renamed from rrIntervals to data
    this.sdnnValue = 0

    this.sdnnSubject = new Subject()

    this.init()

    // Correctly invoke updatePulsesNumber with newVal
    watch(
      () => this.opts.rrIntervals,
      (newVal) => this.updatePulsesNumber(newVal),
      { immediate: true }
    )
  }

  init() {
    if (this.device && this.device.observeRRInterval) {
      this.subscription = this.device
        .observeRRInterval()
        .subscribe((rri) => this.handleRrInterval(rri))
    } else {
      console.error('Device does not support observeRRInterval().')
    }
  }

  handleRrInterval(rri) {
    if (this.validateRrInterval(rri)) {
      this.addRrInterval(rri)
      this.calculateSdnn()
    } else {
      console.warn(`Discarded invalid R-R interval: ${rri} ms`)
    }
  }

  validateRrInterval(rri) {
    return rri >= 300 && rri <= 2000
  }

  addRrInterval(rri) {
    this.data.push(rri)
    if (this.data.length > this.maxRRIntervals) {
      this.data.shift()
    }
  }

  calculateSdnn() {
    if (this.data.length >= 2) {
      const n = Math.min(this.pulsesNumber, this.data.length)
      const recentRrs = this.data.slice(-n)
      const sdnn = std(recentRrs, 'uncorrected')
      this.sdnnValue = sdnn
      this.sdnnSubject.next(this.sdnnValue)
    } else {
      this.sdnnValue = 0
      this.sdnnSubject.next(this.sdnnValue)
    }
  }

  updatePulsesNumber(newPulsesNumber) {
    const clampedNumber = Math.max(2, Math.min(newPulsesNumber, this.maxRRIntervals))
    this.pulsesNumber = clampedNumber
    this.calculateSdnn()
  }

  getSdnnObservable() {
    return this.sdnnSubject.asObservable()
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
    this.sdnnSubject.complete()
  }
}

