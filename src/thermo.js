import {EventEmitter} from 'events';
import Analog from './analog';

class thermo extends EventEmitter {
    constructor  (analog, config) {
        super();
        this.analog = analog;
        this.fahrenheit = 0;

        this.whenLow = config.whenLow || [];
        this.target = config.target || 60;
        this.lowThreshold = config.lowThreshold || 4;
        this.lowKillThreshold = config.lowKillThreshold || 20;
        this.lowNeverKill = config.lowNeverKill;
        this.isLow = false;
        this.isLowKilled = false;

        this.highThreshold = config.highThreshold || 4;

        this.pinChangeHandler = this.pinChangeHandler.bind(this);
        this.analog.on('change', this.pinChangeHandler);
    }

    pinChangeHandler (mV) {
        let celsius = (mV - 500) / 10;
        let fahrenheit = ((celsius * 9 / 5) + 32).toFixed(2);

        if(fahrenheit != this. fahrenheit) {
            this.fahrenheit = fahrenheit;
            this.emit('change', fahrenheit);
        }
    }

    checkLow () {
        if(this.fahrenheit > this.target) {
            if(this.isLow) {
                this.isLow = false;
                this.whenLow.forEach(dig => dig.set(0));
            }
        }
    }


}

export default thermo;