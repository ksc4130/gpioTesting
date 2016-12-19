import {EventEmitter} from 'events';
import Analog from './analog';

class thermo extends EventEmitter {
    constructor  (analog, config = {}) {
        super();
        this.analog = analog;
        this.fahrenheit = 0;
        console.log(config.whenLow);
        this.whenLow = config.whenLow || [];
        console.log(this.whenLow)
        this.target = config.target || 60;
        this.lowThreshold = config.lowThreshold || 4;
        this.lowKillThreshold = config.lowKillThreshold || 20;
        this.lowNeverKill = config.lowNeverKill;
        this.isLow = false;
        this.isLowKilled = false;

        this.highThreshold = config.highThreshold || 4;

        this.checkLow = this.checkLow.bind(this);
        this.pinChangeHandler = this.pinChangeHandler.bind(this);
        this.analog.on('change', this.pinChangeHandler);
    }

    pinChangeHandler (mV) {
        let celsius = (mV - 500) / 10;
        let fahrenheit = ((celsius * 9 / 5) + 32).toFixed(2);

        if(fahrenheit != this. fahrenheit) {
            this.fahrenheit = fahrenheit;
            this.emit('change', fahrenheit);
            this.checkLow();
        }
    }

    checkLow () {
        if(this.fahrenheit > this.target) {
            if(this.isLow) {
                this.isLow = false;
                this.whenLow.forEach(dig => dig.set(0));
            }
        } else if (this.fahrenheit <= this.target - this.lowThreshold) {
            this.isLow = true;
            console.log(this.whenLow);
            this.whenLow.forEach(dig => dig.set(1));
        }
    }


}

export default thermo;