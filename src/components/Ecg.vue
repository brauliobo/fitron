<template>
  <div>
    <h4>ECG</h4>
    <div ref="ecgChart"></div>
  </div>
</template>

<script>
import log from '@/log'
import Plotly from 'plotly.js-dist'

export default {
  data() {
    return {
      ecgData: [],
      ecgTime: [],
      plotInitialized: false,
      maxPoints: 1000, // Maximum number of points to display
      samplingRate: 130, // ECG sampling rate in Hz
      subscription: null
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

  beforeDestroy() {
    // Clean up subscription when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  },

  methods: {
    handleEcgData(ecg) {
      // 'ecg' is an array of ECG samples
      // Append new samples to ecgData
      this.ecgData.push(...ecg);

      // Generate corresponding time values for the new samples
      const timeStep = 1 / this.samplingRate; // Time between samples
      const lastTime = this.ecgTime.length > 0 ? this.ecgTime[this.ecgTime.length - 1] : 0;

      for (let i = 0; i < ecg.length; i++) {
        this.ecgTime.push(lastTime + timeStep * (i + 1));
      }

      // Limit the length of the data arrays to maxPoints
      if (this.ecgData.length > this.maxPoints) {
        const removeCount = this.ecgData.length - this.maxPoints;
        this.ecgData.splice(0, removeCount);
        this.ecgTime.splice(0, removeCount);
        // Update the x-axis range to reflect removed data
        Plotly.relayout(this.$refs.ecgChart, {
          xaxis: {
            range: [this.ecgTime[0], this.ecgTime[this.ecgTime.length - 1]],
          }
        });
      }

      // Initialize or update the plot
      if (!this.plotInitialized) {
        this.initializePlot();
        this.plotInitialized = true;
      } else {
        this.updatePlot(ecg.length);
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
          range: [Math.max(0, this.ecgTime[this.ecgTime.length - 1] - 5), this.ecgTime[this.ecgTime.length - 1]],
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
    },
    updatePlot(numNewSamples) {
      // Ensure numNewSamples is valid
      if (!numNewSamples || numNewSamples <= 0) {
        return; // Nothing to update
      }

      // Ensure we have enough data
      const totalSamples = this.ecgTime.length;
      if (totalSamples < numNewSamples) {
        numNewSamples = totalSamples;
      }

      const updateX = this.ecgTime.slice(-numNewSamples);
      const updateY = this.ecgData.slice(-numNewSamples);

      // Ensure update arrays are not empty
      if (updateX.length === 0 || updateY.length === 0) {
        return; // No data to update
      }

      const update = {
        x: [updateX],
        y: [updateY]
      };

      try {
        Plotly.extendTraces(this.$refs.ecgChart, update, [0], this.maxPoints);
      } catch (error) {
        console.error('Error updating Plotly chart:', error);
      }
    }
  }
}
</script>

