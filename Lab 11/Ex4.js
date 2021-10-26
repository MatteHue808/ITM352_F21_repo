var attributes = "Matthew;20;20.5;-19.5";
var parts = attributes.split(';');

/* for(part of parts) {
    console.log(`${part} isNonNegInt: ${isStringNonNegInt(part,)}`);    
}
 */

function checkIt(item, index) {
    // Inputs in the console whether an index is a string or not 
    console.log(`part ${index} is ${(isStringNonNegInt(item)?'a':'not a')} quantity`);
}

checkIt.forEach(parts) // Exercise 6a

parts.forEach((item, index) => {console.log(`part ${index} is ${(isStringNonNegInt(item)?'a':'not a')} quantity`);});

function isStringNonNegInt(q, returnErrors = false) {
    // Checks if a string q is a non-neg integer. If returnErrors is true, the array of errors is returned, otherwise, returns true if q is a non-neg int. 
    errors = []; // assume no errors at first
    if(q == '') q = 0
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value 
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative 
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer 
    
    return returnErrors ? errors : (errors.length == 0);
}

