
//const exec = require('child_process').exec;
//exec('echo "hello"');
const fs = require('fs');
const loadAnalogTreeCmd = 'echo "BB-ADC" > /sys/devices/platform/bone_capemgr/slots';
const analogPath = '/sys/bus/iio/devices/iio\:device0/';
const gpioPath = '/sys/class/gpio/';//54
import Analog from './analog';
import Thermo from './thermo';
import {pins} from './const';

if(!fs.existsSync(analogPath + 'in_voltage1_raw')) {
    require('child_process').exec(loadAnalogTreeCmd, function () {
        init();
    });
} else {
    init();
}

function init () {
    let a = new Analog(pins.ain1);
    let t = new Thermo(a);
    t.on('change', fahrenheit => {
        
        console.log(`fahrenheit: ${fahrenheit}`);
    });
}

var gpio = require("gpio");

// Calling export with a pin number will export that header and return a gpio header instance
var gpio4 = gpio.export(54, {
   // When you export a pin, the default direction is out. This allows you to set
   // the pin value to either LOW or HIGH (3.3V) from your program.
   direction: 'out',

   // set the time interval (ms) between each read when watching for value changes
   // note: this is default to 100, setting value too low will cause high CPU usage
   interval: 200,

   // Due to the asynchronous nature of exporting a header, you may not be able to
   // read or write to the header right away. Place your logic in this ready
   // function to guarantee everything will get fired properly
   ready: function() {
       gpio4.set(1);
   }
});

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