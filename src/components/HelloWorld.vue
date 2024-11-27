<template>
  <v-btn>
  Button
</v-btn>
  <v-btn @click="requestDevice()">
    Request Bluetooth Device
  </v-btn>
<a>ESP: Connected</a>
<a>Watch: Connected</a>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>



<script setup lang="ts">
import { pausableWatch, useBluetooth } from '@vueuse/core'
import { ref } from 'vue';

const {
  isSupported,
  isConnected,
  device,
  requestDevice,
  server,
} = useBluetooth({
  acceptAllDevices: true,
  optionalServices: [
    'battery_service',
  ],
})

const batteryPercent = ref<undefined | number>()

const isGettingBatteryLevels = ref(false)

async function getBatteryLevels() {
  isGettingBatteryLevels.value = true

  // Get the battery service:
  const batteryService = await server.value

  // Get the current battery level
  const batteryLevelCharacteristic = await batteryService.getCharacteristic(
    'battery_level',
  )

  // Listen to when characteristic value changes on `characteristicvaluechanged` event:
  batteryLevelCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
    batteryPercent.value = event.target.value.getUint8(0)
  })

  // Convert received buffer to number:
  const batteryLevel = await batteryLevelCharacteristic.readValue()

  batteryPercent.value = await batteryLevel.getUint8(0)
}

const { stop } = pausableWatch(isConnected, (newIsConnected) => {
  if (!newIsConnected || !server.value || isGettingBatteryLevels.value)
    return
  // Attempt to get the battery levels of the device:
  getBatteryLevels()
  // We only want to run this on the initial connection, as we will use an event listener to handle updates:
  stop()
})
</script>