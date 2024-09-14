<template>
  <div>
    <p v-if=heartRate >Current Heart Rate: {{ heartRate }} BPM</p>
    <p v-else >No heart rate data available</p>
  </div>
</template>

<script>
import log from '@/log'

export default {
  data() {
    return {
      heartRate: null
    }
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler() {
        this.device.serviceHeartRate().subscribe(hr => this.heartRate = hr)
      }
    }
  },

  methods: {
  }
}
</script>

