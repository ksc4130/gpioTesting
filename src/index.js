
//const exec = require('child_process').exec;
//exec('echo "hello"');
const fs = require('fs');
const loadAnalogTreeCmd = 'echo "BB-ADC" > /sys/devices/platform/bone_capemgr/slots';
const analogPath = '/sys/bus/iio/devices/iio\:device0/';
const gpioPath = '/sys/class/gpio/';//54
import Analog from './analog';
import Thermo from './thermo';
import {pins} from './const';
import Button from './button';

var gpio = require("gpio"),
    led = 0;

var gpio67 = gpio.export(67, {
   direction: 'out',
   interval: 200,
   ready: function() {
    //    gpio68.on('change', function (val) {
    //        console.log('btn changed', val);
    //        if(val === 0) {
    //            led = 1 - led;
    //            gpio4.set(led);
    //        }
    //    });
       
   }
});


var unkillBtn = new Button(68);

if(!fs.existsSync(analogPath + 'in_voltage1_raw')) {
    require('child_process').exec(loadAnalogTreeCmd, function () {
        init();
    });
} else {
    init();
}

function init () {
    let a = new Analog(pins.ain1);
    let t = new Thermo(a, {
        whenLow: [gpio67],
        target: 78,
        lowThreshold: 1,
        lowKillThreshold: 1,
        unkill: unkillBtn
    });
    t.on('change', fahrenheit => {
        console.log(`fahrenheit: ${fahrenheit}`);
    });
}

// var gpio68 = gpio.export(68, {
//     direction: 'in',
//     ready: function() {
        
//     }
// });



// fs.exists(gpioPath + 'gpio54', exists => {
//     if(exists) {
//         fs.writeFile(gpioPath + 'unexport', '54', err => {
//             if(err)
//                 return console.log(err);
//              exportGpio(54);   
//         });
//     } else {
//         exportGpio(54); 
//     }
// });



// function exportGpio (n) {
//     fs.writeFile(gpioPath + 'export', '54', err => {
//         if(err)
//             return console.log('export error', err);
//         fs.writeFile(gpioPath + 'gpio' + n + '/direction', 'out', err => {
//             if(err)
//                 return console.log('direction eroor', err);
//             fs.writeFile(gpioPath + 'gpio' + n + '/value', '1', err => {
//                 if(err)
//                     return console.log('write failed', err);
//         });
//         });
//     });
// }

// function init () {
//     console.log('watching');
    
//     function pullVal () {
//         fs.readFile(analogPath + 'in_voltage1_raw', (err, chunk) => {
//             let adcVal = Number(chunk);
//             let mV = adcVal / 4096 * 1800;
//             let celsius = (mV - 500) / 10;
//             let fahrenheit = (celsius * 9 / 5) + 32;
//             console.log(adcVal, fahrenheit);
//             setTimeout(pullVal, 1000);
//         });
//     }
//     pullVal();
// }



// const exec = require('child_process').exec;
// const child = exec(`echo 'BB-ADC' > /sys/devices/platform/bone_capemgr/slots`,
//     (error, stdout, stderr) => {
//         console.log(`stdout: ${stdout}`);
//         console.log(`stderr: ${stderr}`);
//         if (error !== null) {
//             console.log(`exec error: ${error}`);
//         }
        //console.log(fs.readFileSync('/sys/bus/iio/devices/iio\:device0/in_voltage1_raw') + '');
// });
// var gpio = require('gpio');

// var gpio22, gpio21, intervalTimer;
 
// // Flashing lights if LED connected to GPIO22 
// gpio22 = gpio.export(22, {
//    ready: function() {
//       intervalTimer = setInterval(function() {
//          gpio22.set();
//          setTimeout(function() { gpio22.reset(); }, 500);
//       }, 1000);
//    }
// });

// gpio21 = gpio.export(21, {
//    ready: function() {
//       // bind to gpio22's change event 
//       gpio22.on("change", function(val) {
//          gpio21.set(1 - val); // set gpio4 to the opposite value 
//       });
//    }
// });

// setTimeout(function() {
//    clearInterval(intervalTimer);          // stops the voltage cycling 
//    gpio22.removeAllListeners('change');   // unbinds change event 
//    gpio22.reset();                        // sets header to low 
//    gpio22.unexport();                     // unexport the header 
   
//    gpio21.unexport(function() {
//       // unexport takes a callback which gets fired as soon as unexporting is done 
//       process.exit(); // exits your node program 
//    });
// }, 120000);

// console.log('started');