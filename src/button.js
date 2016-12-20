import gpio from 'gpio';
import EventEmitter from 'events';

class button extends EventEmitter {
    constructor (pin) {
        super();
        let self = this;
        let gpio = gpio.export(pin, {
            direction: 'in',
            ready: function() {
                gpio.on('change', val => {
                    if(val === 0) {
                        self.emit('click');
                    }
                })
            }
        });
        this.gpio = gpio;
    }
}

export default button;