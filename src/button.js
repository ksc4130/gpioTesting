import gpio from 'gpio';
import EventEmitter from 'events';

class button extends EventEmitter {
    constructor (pin) {
        super();
        let self = this;
        let gpioLoc = gpio.export(pin, {
            direction: 'in',
            ready: function() {
                gpioLoc.on('change', val => {
                    console.log('button', val);
                    if(val === 0) {
                        console.log('val 0');
                        self.emit('click');
                    }
                })
            }
        });
        this.gpio = gpioLoc;
    }
}

export default button;