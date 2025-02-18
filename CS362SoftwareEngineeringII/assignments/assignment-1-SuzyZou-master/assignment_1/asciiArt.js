// Use process.argv to grab the string provided as a command line argument
const inputString = process.argv[2];

// Print the ASCII art to the terminal
console.log("The input string is: " +inputString);
console.log("Turning the input string to ASCII Art as fillwoing: ")
var figlet = require('figlet');

// The following function is referenced:https://www.npmjs.com/package/figlet
figlet(inputString, function(err, data) {
    if(err){ // if error then print an error message on terminal otherwirse print ascii airt
        console.log('Opps!An error occured.');
        console.dir(err);
        return;
    }
    console.log(data)
});