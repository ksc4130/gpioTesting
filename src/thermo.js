import {EventEmitter} from 'events';
import Analog from './analog';

class thermo extends EventEmitter {
    constructor  (analog, config = {}) {
        super();
        this.analog = analog;
        this.fahrenheit = 0;

        this.whenLow = config.whenLow || [];
        this.target = config.target || 60;
        this.lowThreshold = config.lowThreshold || 4;
        this.lowKillThreshold = config.lowKillThreshold || 20;
        this.lowNeverKill = config.lowNeverKill || false;
        this.isLow = false;
        this.isLowKilled = false;

        this.highThreshold = config.highThreshold || 4;

        this.unkill = this.unkill.bind(this);
        this.neverKill = this.neverKill.bind(this);
        this.checkLow = this.checkLow.bind(this);
        this.pinChangeHandler = this.pinChangeHandler.bind(this);

        this.analog.on('change', this.pinChangeHandler);

        if(config.unkill) {
            console.log('has unkill');
            config.unkill.on('click', this.unkill);
        }
    }

    unkill () {
        console.log('unkill', this.lowNeverKill);
        this.lowNeverKill = true;
        console.log('unkill', this.lowNeverKill);
        this.isLowKilled = false;
        this.checkLow();
    }

    neverKill () {
        this.lowNeverKill = true;
        this.isLowKilled = false;
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
        console.log(`check low lowNeverKill: ${this.lowNeverKill}, isLow: ${this.isLow}, isLowKilled: ${this.isLowKilled}`);
        if(this.fahrenheit > this.target) {
            console.log('not low');
            if(this.isLow) {
                this.isLow = false;
                this.whenLow.forEach(dig => dig.set(0));
            }
        } else if(!this.lowNeverKill && this.isLowKilled ) {
            console.log('killed');
            return;
        } else if(!this.lowNeverKill && this.fahrenheit <= this.target - this.lowKillThreshold) {
            console.log('set killed');
            this.isLowKilled = true;
            this.isLow = true;
        } else if(this.fahrenheit <= this.target - this.lowThreshold) {
            console.log('set low');
            this.isLow = true;
            this.whenLow.forEach(dig => dig.set(1));
        }
    }


}

export default thermo;