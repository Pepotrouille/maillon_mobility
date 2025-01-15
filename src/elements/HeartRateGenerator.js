// Declaration
class heartRateGenerator {
    constructor() {
      this.heartrate = 80;
    }

    getHeartRate() {
      //Generate random value between -5 and 5
        const randomValue = Math.floor(Math.random() * 11) - 5;
        this.heartrate += randomValue;
        if(this.heartrate<60){
            this.heartrate = 60;
        }
        if(this.heartrate>200){
            this.heartrate = 200;
        }
      return this.heartrate;
    }
  }
  
export default heartRateGenerator;