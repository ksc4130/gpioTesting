import {pins, analogPath} from './const';
import {EventEmitter} from 'events';
import fs from 'fs';

class analog extends EventEmitter {
    constructor (pin, config = {}) {
        super();
        this.pin = pin;
        this.millivolts = 0;
        this.readings = [];
        this.sampleSize = config.sampleSize || 10;
        this.sampleRate = config.sampeRate || 100;
        this.shouldStop = false;
        this.running = false;
        this.dropHighAndLow = true;

        this.start();
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
        let calc = (total / this.sampleSize).toFixed(2);
        if(this.millivolts != calc) {
            this.millivolts = calc;
            this.emit('change', this.millivolts);
        }
        this.readings.length = 0;
        this.readings = [];
        
  }

  read () {
      if(this.shouldStop) {
          this.running = false;
          this.shouldStop = false;
          this.emit('stopped');
          return;
      }

      fs.readFile(analogPath + 'in_voltage1_raw', 'UTf-8', (err, chunk) => {
            let adcVal = Number(chunk);
            let mV = adcVal / 4096 * 1800;
            this.addReading(mV);
            setTimeout(() => this.read(), this.sampleRate);
        });
        
      
  }

  addReading(millivolts) {
    this.readings.push(millivolts);
    let forDrops = this.dropHighAndLow ? 2 : 0;
    if(this.readings.length === this.sampleSize + forDrops) {
      if(this.dropHighAndLow) {
        this.readings = this.readings.sort((a, b) => a-b)
        .splice(1, this.sampleSize);
      }

      this.calcCurrentAverage();
    }
  }
}

export default analog;