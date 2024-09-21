// SdnnCalculator.js

import { Subject } from 'rxjs';
import { mean, std } from 'mathjs'; // Optional: Use mathjs for calculations

export default class SdnnCalculator {
  /**
   * Constructs the SdnnCalculator.
   * @param {Object} device - The device providing R-R intervals.
   * @param {number} [maxRRIntervals=60] - Maximum number of R-R intervals to store.
   * @param {number} [minRRIntervals=2] - Minimum number of R-R intervals required to calculate SDNN.
   */
  constructor(device, maxRRIntervals = 60, minRRIntervals = 2) {
    this.device = device;
    this.maxRRIntervals = maxRRIntervals;
    this.minRRIntervals = minRRIntervals;

    this.subscription = null;
    this.rrIntervals = []; // Store R-R intervals in milliseconds
    this.sdnnValue = 0;

    // RxJS Subject to emit SDNN values
    this.sdnnSubject = new Subject();

    this.init();
  }

  /**
   * Initializes the SdnnCalculator by subscribing to R-R interval data.
   */
  init() {
    if (this.device && this.device.observeRRInterval) {
      // Subscribe to the device's R-R interval observable
      this.subscription = this.device
        .observeRRInterval()
        .subscribe((rri) => this.handleRrInterval(rri));
    } else {
      console.error('Device does not support observeRRInterval().');
    }
  }

  /**
   * Handles incoming R-R intervals.
   * @param {number} rri - The R-R interval in milliseconds.
   */
  handleRrInterval(rri) {
    if (this.validateRrInterval(rri)) {
      this.addRrInterval(rri);
      this.calculateSdnn();
    } else {
      console.warn(`Discarded invalid R-R interval: ${rri} ms`);
    }
  }

  /**
   * Validates the R-R interval against physiological limits.
   * @param {number} rri - The R-R interval in milliseconds.
   * @returns {boolean} - True if valid, false otherwise.
   */
  validateRrInterval(rri) {
    // Define physiological limits for R-R intervals (e.g., 300 ms to 2000 ms)
    return rri >= 300 && rri <= 2000;
  }

  /**
   * Adds a valid R-R interval to the buffer.
   * @param {number} rri - The R-R interval in milliseconds.
   */
  addRrInterval(rri) {
    this.rrIntervals.push(rri);
    if (this.rrIntervals.length > this.maxRRIntervals) {
      this.rrIntervals.shift(); // Remove the oldest interval
    }
  }

  /**
   * Calculates SDNN from the current buffer of R-R intervals.
   * Allows calculation with a minimum number of intervals.
   */
  calculateSdnn() {
    if (this.rrIntervals.length >= this.minRRIntervals) {
      const meanRR = mean(this.rrIntervals);
      const sdnn = std(this.rrIntervals, 'uncorrected'); // 'uncorrected' for population SD
      this.sdnnValue = sdnn;

      // Emit the updated SDNN value
      this.sdnnSubject.next(this.sdnnValue);
    } else {
      this.sdnnValue = 0;
      // Optionally, emit a default or null value if insufficient data
      this.sdnnSubject.next(this.sdnnValue);
    }
  }

  /**
   * Provides an observable to subscribe to SDNN updates.
   * @returns {Observable<number>} - Observable emitting SDNN values in milliseconds.
   */
  getSdnnObservable() {
    return this.sdnnSubject.asObservable();
  }

  /**
   * Cleans up subscriptions and completes the observable.
   */
  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up internal subscription
      this.subscription = null;
    }
    this.sdnnSubject.complete(); // Complete the observable
  }
}

