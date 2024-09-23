<template>
  <div>
    <div ref="accelChart" style="width: 100%; height: 600px;"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist-min'
import log from '@/log'

export default {
  data() {
    return {
      currentReading: { x: 0, y: 0, z: 0 },
      accDataBuffer: [],
      throttleTimeout: null,
    };
  },
  props: ['device'],
  watch: {
    device: {
      immediate: true,
      handler() {
        // Subscribe to accelerometer data
        this.device.observeAccelerometer().subscribe(accArray => {
          // 'accArray' is an array of accelerometer readings
          accArray.forEach(reading => {
            this.accDataBuffer.push(reading);
          });
          // Keep only the data from the last 1 second
          const maxBufferSize = this.device.accSamplingRate || 200; // Assuming 200Hz sampling rate
          if (this.accDataBuffer.length > maxBufferSize) {
            this.accDataBuffer.splice(0, this.accDataBuffer.length - maxBufferSize);
          }
          // Throttle the updates
          if (!this.throttleTimeout) {
            this.throttleTimeout = setTimeout(() => {
              this.updateChart();
              this.throttleTimeout = null;
            }, 1000); // Update once every second
          }
        });
      },
    },
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      // Initialize the Plotly 2D chart with arrows for each axis
      this.plotData = [];

      this.plotLayout = {
        title: 'Accelerometer Force Vectors (2D)',
        xaxis: { title: 'Axis', range: [-1.5, 1.5], showgrid: false, zeroline: false },
        yaxis: { title: 'Acceleration', range: [-1.5, 1.5], showgrid: false, zeroline: false },
        margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 50,
        },
        showlegend: false,
        shapes: [], // We will use shapes to draw arrows
      };

      Plotly.newPlot(this.$refs.accelChart, this.plotData, this.plotLayout);
    },
    updateChart() {
      // Calculate average acceleration over the last 1 second
      const dataLength = this.accDataBuffer.length;
      if (dataLength === 0) return;

      let sumX = 0, sumY = 0, sumZ = 0;
      this.accDataBuffer.forEach(reading => {
        sumX += reading.x;
        sumY += reading.y;
        sumZ += reading.z;
      });

      const avgReading = {
        x: sumX / dataLength,
        y: sumY / dataLength,
        z: sumZ / dataLength,
      };

      this.currentReading = avgReading;

      // Normalize the acceleration values for visualization
      const maxAcceleration = 2048; // Adjust based on your accelerometer's range
      const scale = 1; // Scaling factor to control arrow lengths in the plot

      // Calculate the scaled acceleration values
      const xAccel = avgReading.x * scale / maxAcceleration;
      const yAccel = avgReading.y * scale / maxAcceleration;
      const zAccel = avgReading.z * scale / maxAcceleration;

      // Clear previous shapes
      this.plotLayout.shapes = [];

      // Define arrow properties
      const arrowHeadSize = 0.1; // Size of the arrowhead
      const arrowProperties = [
        {
          axis: 'X',
          value: xAccel,
          color: 'red',
          start: { x: 0, y: 0 },
          end: { x: xAccel, y: 0 },
        },
        {
          axis: 'Y',
          value: yAccel,
          color: 'green',
          start: { x: 0, y: 0 },
          end: { x: 0, y: yAccel },
        },
        {
          axis: 'Z',
          value: zAccel,
          color: 'blue',
          start: { x: 0, y: 0 },
          end: { x: zAccel * Math.cos(Math.PI / 4), y: zAccel * Math.sin(Math.PI / 4) },
        },
      ];

      // Update shapes for each arrow
      arrowProperties.forEach(arrow => {
        // Draw the arrow line
        this.plotLayout.shapes.push({
          type: 'line',
          x0: arrow.start.x,
          y0: arrow.start.y,
          x1: arrow.end.x,
          y1: arrow.end.y,
          line: {
            color: arrow.color,
            width: 3,
          },
        });

        // Calculate arrowhead points
        const angle = Math.atan2(arrow.end.y - arrow.start.y, arrow.end.x - arrow.start.x);
        const arrowLength = Math.sqrt(
          Math.pow(arrow.end.x - arrow.start.x, 2) + Math.pow(arrow.end.y - arrow.start.y, 2)
        );

        // Only draw arrowhead if length is non-zero
        if (arrowLength > 0) {
          const arrowheadPoint1 = {
            x: arrow.end.x - arrowHeadSize * Math.cos(angle - Math.PI / 6),
            y: arrow.end.y - arrowHeadSize * Math.sin(angle - Math.PI / 6),
          };
          const arrowheadPoint2 = {
            x: arrow.end.x - arrowHeadSize * Math.cos(angle + Math.PI / 6),
            y: arrow.end.y - arrowHeadSize * Math.sin(angle + Math.PI / 6),
          };

          // Draw the arrowhead as a filled polygon
          this.plotLayout.shapes.push({
            type: 'path',
            path: `M ${arrow.end.x},${arrow.end.y} L ${arrowheadPoint1.x},${arrowheadPoint1.y} L ${arrowheadPoint2.x},${arrowheadPoint2.y} Z`,
            fillcolor: arrow.color,
            line: {
              color: arrow.color,
            },
          });
        }
      });

      // Update the layout with new shapes
      Plotly.update(this.$refs.accelChart, this.plotData, this.plotLayout);

      // Clear the buffer after updating
      this.accDataBuffer = [];
    },
  },
};
</script>

<style scoped>
/* Optional styling */
</style>

