import {pins, analogPath} from './const';
import {EventEmitter} from 'events';

class analog extends EventEmitter {
    constructor (pin, config = {}) {
        super();
        this.pin = pin;
        this.curVal = 0;
        this.samples = [];
        this.sampleSize = config.sampleSize || 10;
        this.sampleRate = config.sampeRate || 100;

        this.start();
    }


     init () {
        console.log('watching');
        
        function pullVal () {
            fs.readFile(analogPath + 'in_voltage1_raw', (err, chunk) => {
                let adcVal = Number(chunk);
                let mV = adcVal / 4096 * 1800;
                let celsius = (mV - 500) / 10;
                let fahrenheit = (celsius * 9 / 5) + 32;
                console.log(adcVal, fahrenheit);
                setTimeout(pullVal, 1000);
            });
        }
        pullVal();
    }

    start () {
        this.running = true;
        this.shouldStop = false;
        this.read();
        this.emit('started');
    }

    stop () {
        this.shouldStop = true;
    }

    calcCurrentAverage () {
        let total = this.readings.reduce((a, b) => a+b, 0);
        this.millivolts = total / this.sampleSize;
        this.readings.length = 0;
        this.readings = [];
        this.emit('change', this);
  }

  read () {
      if(this.shouldStop) {
          this.running = false;
          this.shouldStop = false;
          this.emit('stopped');
          return;
      }

      fs.readFile(analogPath + 'in_voltage1_raw', (err, chunk) => {
            let adcVal = Number(chunk);
            let mV = adcVal / 4096 * 1800;
            this.addReading(mV);
            setTimeout(() => this.read(), this.sampleRate);
        });
        
      
  }

  addReading(millivolts) {
    this.readings.push(millivolts);
    let forDrops = this.dropHighAndLow ? 2 : 0
    if(this.readings.length === this.sampleSize + forDrops) {
      if(this.dropHighAndLow) {
        this.readings = this.readings.sort((a, b) => a-b)
        .splice(1, this.sampleSize);
      }

      this.calcCurrentAverage();
    }
  }
}