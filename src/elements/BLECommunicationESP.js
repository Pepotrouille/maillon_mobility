class BLECommunicationESP {
    constructor() {
        this.SERVICE_TO_ESP_UUID = "5e441ce0-1234-1234-1234-70e590000000";
        this.CHARACTERISTIC_UUID_HEART_RATE = "4ea47000-0000-0000-0000-4a7e00000000";
        this.CHARACTERISTIC_UUID_LEVEL_EFFORT = "7e4e7000-0f00-0f00-0f00-eff047000000";
        this.device = null;
        this.server = null;
        this.current_heart_rate = 0;
    }
    
    setDevice(device) {
        this.device = device;
    }

    setServer(server) { 
        this.server = server;
    }
    //--------------------Connection--------------------------
    connectToDevice = async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: "ESP32-S3" }],
                optionalServices: [this.SERVICE_TO_ESP_UUID]
            });
            this.setDevice(device);
            this.server = await device.gatt.connect();
            const heartRateCharacteristic = await this.getCharacteristicHeartRate();
            heartRateCharacteristic.addEventListener('characteristicvaluechanged', this.handleHeartRateValueChanged);
            await heartRateCharacteristic.startNotifications();
            console.log('Notifications have been started.');
        } catch (err) {
            console.error('Error during connection:', err);
            if (err.name === 'NotSupportedError') {
                console.error('The requested GATT operation is not supported by the device.');
            }
        }
    }

    //--------------------Disconnection--------------------------
    disconnectDevice = async () => {
        try {
            if (this.device && this.device.gatt && this.device.gatt.connected) {
                this.device.gatt.disconnect();
                console.log('Device disconnected successfully.');
            } else {
                console.log('No device is connected.');
            }
        } catch (err) {
            console.error('Error during disconnection:', err);
        }
    }

    //--------------------Check Connection Status--------------------------
    checkConnectionStatus = async () => {
        return this.server;
    }
        
    //--------------------Get Characteristics--------------------------
    getCharacteristicGeneric = async (server_id, characteristic_id) => {
        try{
            if (!this.server) {
                throw new Error("Server is not connected");
            }
            if (this.device && this.device.gatt.connected) {
                const service = await this.server.getPrimaryService(server_id); // Replace with your service UUID
                let characteristic = await service.getCharacteristic(characteristic_id); 
                return characteristic;
            } else {
                console.warn('No device connected');
            }
        } catch (err) {
        console.error(err);
        }
    }
    
    getCharacteristicHeartRate = async () => {
    const characteristic = await this.getCharacteristicGeneric(this.SERVICE_TO_ESP_UUID, this.CHARACTERISTIC_UUID_HEART_RATE);
    return characteristic;
    }

    getCharacteristicLevelEffort = async () => {
    const characteristic = await this.getCharacteristicGeneric(this.SERVICE_TO_ESP_UUID, this.CHARACTERISTIC_UUID_LEVEL_EFFORT);
    return characteristic;
    }

    handleHeartRateValueChanged = async (value) => {
        const heartRateCharacteristic = this.getCharacteristicHeartRate();
        if (!heartRateCharacteristic) {
            throw new Error("Heart Rate Characteristic is not available");
        }
        this.current_heart_rate = value
        //console.log("New heart rate: " + this.current_heart_rate)
        console.log(this.current_heart_rate.currentTarget.value.getInt32(0, true))
    }
    handleHeartRateValueChanged = async (event) => {
        const heartRateCharacteristic = await this.getCharacteristicHeartRate();
        if (!heartRateCharacteristic) {
            throw new Error("Heart Rate Characteristic is not available");
        }
        try {
            this.current_heart_rate = new TextDecoder().decode(event.target.value);
        } catch (error) {
            console.error('Failed to convert heart rate value:', error);
        }
    }
    
    sendData = async (characteristic, data) => {
        if (this.device && this.device.gatt.connected) {
            const encoder = new TextEncoder(); // For text data encoding
            const encodedData = encoder.encode(data);
            await characteristic.writeValue(encodedData);
            console.log('Data sent:', data);
        } else {
            console.warn('No device connected');
        }
    }
    
    sendGenericData = async (getCharacteristicFunction, data) => {
        console.log(data + " to send");
        try {
            if (this.server) {
                const characteristic = await getCharacteristicFunction.call(this); // Ensure correct context
                await this.sendData(characteristic, data);
                console.log(data + " sent");
            }
        } catch (error) {
            console.error('Error sending data:', error);
        }
    }
    
    sendBluetoothDataHeartRate = async (value) => {
        await this.sendGenericData(this.getCharacteristicHeartRate.bind(this), value); // Bind correct context
    };

    sendBluetoothDataLevelOfEffort = async (value) => {
        await this.sendGenericData(this.getCharacteristicLevelEffort.bind(this), value); // Bind correct context
    };
    
}
export default BLECommunicationESP;