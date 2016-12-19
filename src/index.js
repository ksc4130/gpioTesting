
//const exec = require('child_process').exec;
//exec('echo "hello"');
const fs = require('fs');
const exec = require('child_process').exec;
const child = exec(`echo 'BB-ADC' > /sys/devices/platform/bone_capemgr/slots`,
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
        console.log(fs.readFileSync('/sys/bus/iio/devices/iio\:device0/in_voltage0_raw') + '');
});
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