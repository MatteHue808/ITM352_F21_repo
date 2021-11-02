const { KeyObject } = require("crypto");

var month = 4;
var day = 13;
var year = 2001;

step1 = 01;
step2 = parseInt(step1/4);
step3 = step1 + step2;
step4 = 1; // Refer to table 
step6 = step4 + step3;
step7 = 13 + step6;
step8 = step7;
step9 = step8 - 1; // not a leap year
step10= step9 % 7;

console.log(step10);



