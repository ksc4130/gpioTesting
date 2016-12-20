import gpio from 'gpio';
import EventEmitter from 'events';

class onoff extends EventEmitter {
    constructor (pin, config = {}) {
        super();
        this.value = typeof config.value === 'undefined' ? 0 : config.value;
        let self = this;
        let gpioLoc = gpio.export(pin, {
            direction: 'out',
            ready: function() {
                gpioLoc.set(self.value);
            }
        });
        this.gpio = gpioLoc;

        this.set = this.set.bind(this);
        this.toggle = this.toggle.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
    }
    set (value) {
        if(typeof value !== 'undefined') {
            value = value ? 1 : 0;
        }
        if(this.value !== value) {
            this.gpio.set(value);
        }
    }

    toggle () {
        this.value = 1 - this.value;
        this.set();
    }

    on () {
        if(this.value === 0) {
            this.value = 1;
            this.set();
        }
    }

    off () {
        if(this.value === 1) {
            this.value = 0;
            this.set();
        }
    }

}

export default onoff;