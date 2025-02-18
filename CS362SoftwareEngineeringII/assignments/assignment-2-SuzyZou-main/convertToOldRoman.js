module.exports = function convertToOldRoman(input){
  

  if(!input || typeof input !== "number"){
    return false
  }
  if(input < 1 || input > 3999){
    return false
  }
  //Code is referenced:https://www.freecodecamp.org/news/how-to-convert-arabic-numbers-to-roman-numerals-with-solidjs/
  const romanNumeralTable = {
    MMCCCCCCCCCLXXXXVIIII: 2999,
    M: 1000,
    CCCCCCCCCLXXXXVIIII:999,
    C: 100,
    LXXXXVIIII: 99,
    L: 50,
    X: 10,
    VIIII: 9,
    V: 5,
    IIII: 4,
    I: 1,
  }
  
  let result = "";
  const romans = Object.keys(romanNumeralTable);
  
  for(let i = 0; i < romans.length; i++) {
    const val = romanNumeralTable[romans[i]];
    while(input >= val){
      input -= val;
      result += romans[i];
    }
  } 
  return result;
}

  