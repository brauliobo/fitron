<template>
  <div id=app >
    <button @click=pair >Pair & Connect</button>

    <Battery v-if=device :device=device />
    <HeartRateMonitor v-if=device :device=device />

  </div>
</template>

<script>
import log from '@/log.js'
import Battery from '../components/Battery.vue'
import HeartRateMonitor from '../components/HeartRateMonitor.vue'
import {PairService, ConnectService} from '../web_bluetooth.js'

export default {
  data() {
    return {
      pairedDevice: null,
      device:       null,
    }
  },
  name: 'WebApp',
  components: { Battery, HeartRateMonitor },

  async mounted() {
  },

  methods: {

    async pair() {
      this.pairedDevice = await (new PairService).pair()
      await this.connect()
    },

    async connect() {
      this.device = await (new ConnectService).connect(this.pairedDevice)
      log.debug('App: got device', this.device)
    },
  }
}
</script>

