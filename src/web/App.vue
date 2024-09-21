<template>
  <div id=app >
    <button v-if=!device @click=pair >Pair & Connect</button>
    <div v-else >
      Connected to {{device.name()}}
      <button @click=disconnect >Disconnect</button>
    </div>

    <Battery v-if=device :device=device />
    <HeartRateMonitor v-if=device :device=device />
    <RRInterval v-if=device :device=device />
    <SDDN v-if=device :device=device />
    <Ecg v-if=device :device=device />
    <Accelerometer v-if=device :device=device />

  </div>
</template>

<script>
import log from '@/log.js'
import Battery from '../components/Battery.vue'
import HeartRateMonitor from '../components/HeartRateMonitor.vue'
import RRInterval from '../components/RRInterval.vue'
import Ecg from '../components/Ecg.vue'
import Accelerometer from '../components/Accelerometer.vue'
import SDDN from '../components/SDDN.vue'
import {PairService, ConnectService} from '../web_bluetooth.js'

export default {
  data() {
    return {
      pairedDevice: null,
      device:       null,
    }
  },
  name: 'WebApp',
  components: { Battery, SDDN, HeartRateMonitor, RRInterval, Ecg, Accelerometer },

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
      this.device.onDisconnect(_ => this.device = null)
    },

    disconnect() {
      this.device.disconnect()
    },

    
  }
}
</script>

