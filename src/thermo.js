import {EventEmitter} from 'events';
import Analog from './analog';

class thermo extends EventEmitter {
    constructor  (analog, config = {}) {
        super();
        this.analog = analog;
        this.fahrenheit = 0;
        this.celsius = 0;

        //onoff devices that will be toggled on when thermo is low
        this.whenLow = config.whenLow || [];
        this.target = config.target || 60;
        this.lowThreshold = config.lowThreshold || 4;
        this.lowKillThreshold = config.lowKillThreshold || 20;
        this.lowNeverKill = config.lowNeverKill || false;
        
        this.isLow = false;
        this.isLowKilled = false;

        //this.highThreshold = config.highThreshold || 4;

        this.toggleKill = this.toggleKill.bind(this);
        this.checkLow = this.checkLow.bind(this);
        this.pinChangeHandler = this.pinChangeHandler.bind(this);

        this.analog.on('change', this.pinChangeHandler);

        if(config.toggleKill) {
            config.toggleKill.on('click', this.toggleKill);
        }
    }

    setLowNeverKill (value) {
        this.lowNeverKill = value;
        this.emit('lowNeverKill', value);
    }

    setIsLowKilled (value) {
        this.isLowKilled = value;
        this.emit('isLowKilled', value);
    }

    setIsLow (value) {
        this.isLow = value;
        this.emit('isLow', value);
    }

    toggleKill () {
        if(!this.lowNeverKill && this.isLowKilled) {
           this.setIsLowKilled(false); 
        }
        this.setLowNeverKill(!this.lowNeverKill);

        this.checkLow();
    }

    pinChangeHandler (mV) {
        let celsius = (mV - 500) / 10;
        let fahrenheit = ((celsius * 9 / 5) + 32).toFixed(2);

        if(fahrenheit != this. fahrenheit) {
            this.celsius = celsius.toFixed(2);
            this.fahrenheit = fahrenheit;
            this.emit('celsius', this.celsius);
            this.emit('fahrenheit', fahrenheit);
            this.checkLow();
        }
    }

    checkLow () {
        console.log(`check low lowNeverKill: ${this.lowNeverKill}, isLow: ${this.isLow}, isLowKilled: ${this.isLowKilled}`);
        if(this.fahrenheit > this.target) {
            if(this.isLow) {
                this.setLowNeverKill(false);
                this.setIsLow(false);
                this.whenLow.forEach(dig => dig.off());
            }
        } else if(!this.lowNeverKill && this.isLowKilled ) {
            if(this.isLow) {
                this.setLowNeverKill(false);
                this.setIsLow(false);
                this.whenLow.forEach(dig => dig.off());
            }
            return;
        } else if(!this.lowNeverKill && this.fahrenheit <= this.target - this.lowKillThreshold) {
            this.setIsLowKilled(true);
            this.setIsLow(true);
        } else if(this.fahrenheit <= this.target - this.lowThreshold) {
            this.setIsLow(true);
            this.whenLow.forEach(dig => dig.on());
        }
    }


}

export default thermo;