<template>
  <div>
    <h4>ECG</h4>
    <div ref="ecgChart"></div>
  </div>
</template>

<script>
import log from '@/log'
import Plotly from 'plotly.js-dist-min'

export default {
  data() {
    return {
      ecgData: [],
      ecgTime: [],
      plotInitialized: false,
      maxPoints: 1000, // Maximum number of points to display
      samplingRate: 130, // ECG sampling rate in Hz
      updateInterval: 200, // Chart update interval in milliseconds
      buffer: [], // Buffer to store incoming samples
      bufferTime: [], // Buffer to store corresponding time values
      subscription: null,
      updateTimer: null // Timer for scheduled chart updates
    }
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler(newDevice, oldDevice) {
        // Unsubscribe from previous device's ECG observable
        if (this.subscription) {
          this.subscription.unsubscribe();
          this.subscription = null;
        }
        if (this.device) {
          // Subscribe to the new device's ECG data
          this.subscription = this.device.observeEcg().subscribe(ecg => this.handleEcgData(ecg));
        }
      }
    }
  },

  mounted() {
    this.initializePlot();
    // Start the timer to update the chart at regular intervals
    this.updateTimer = setInterval(this.updatePlot, this.updateInterval);
  },

  beforeDestroy() {
    // Clean up subscription and timer when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  },

  methods: {
    handleEcgData(ecg) {
      // 'ecg' is an array of ECG samples
      // Append new samples to buffer
      this.buffer.push(...ecg);

      // Generate corresponding time values for the new samples
      const timeStep = 1 / this.samplingRate; // Time between samples
      const lastTime = this.ecgTime.length > 0 ? this.ecgTime[this.ecgTime.length - 1] : 0;
      const bufferTimeStart = this.bufferTime.length > 0 ? this.bufferTime[this.bufferTime.length - 1] : lastTime;

      for (let i = 0; i < ecg.length; i++) {
        this.bufferTime.push(bufferTimeStart + timeStep * (i + 1));
      }
    },

    initializePlot() {
      const trace = {
        x: this.ecgTime,
        y: this.ecgData,
        type: 'scatter',
        mode: 'lines',
        name: 'ECG Signal',
        line: { color: 'red', width: 1 }
      };
      const layout = {
        title: 'ECG Waveform',
        xaxis: {
          title: 'Time (s)',
          range: [0, 5], // Initial range
          showgrid: true,
          zeroline: false
        },
        yaxis: {
          title: 'Amplitude (µV)',
          showgrid: true,
          zeroline: false
        }
      };
      Plotly.newPlot(this.$refs.ecgChart, [trace], layout, { responsive: true });
      this.plotInitialized = true;
    },

    updatePlot() {
      // Check if there is data in the buffer
      const numNewSamples = this.buffer.length;
      if (numNewSamples === 0) {
        return; // Nothing to update
      }

      // Append buffered data to main data arrays
      this.ecgData.push(...this.buffer);
      this.ecgTime.push(...this.bufferTime);

      // Clear the buffers
      this.buffer = [];
      this.bufferTime = [];

      // Limit the length of the data arrays to maxPoints
      if (this.ecgData.length > this.maxPoints) {
        const removeCount = this.ecgData.length - this.maxPoints;
        this.ecgData.splice(0, removeCount);
        this.ecgTime.splice(0, removeCount);
      }

      // Update the chart with new data
      const update = {
        x: [this.ecgTime],
        y: [this.ecgData]
      };

      // Update the x-axis range to keep the latest data in view
      const latestTime = this.ecgTime[this.ecgTime.length - 1];
      const xRangeStart = Math.max(0, latestTime - 5);
      const xRangeEnd = latestTime;

      try {
        Plotly.update(this.$refs.ecgChart, update, {
          xaxis: {
            range: [xRangeStart, xRangeEnd]
          }
        });
      } catch (error) {
        console.error('Error updating Plotly chart:', error);
      }
    }
  }
}
</script>

