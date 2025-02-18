const convertToOldRoman = require("./convertToOldRoman")

describe("Verify whether the function will convert numerical value to Old roman value",function(){
  
  test("Converts numerical value 1 to old roman number I ",function(){
    const input = 1
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("I")
  })

  test("Converts numerical number 4 to old roman number IIII ",function(){
    const input = 4
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("IIII")
  })
  
  test("Converts numerical number 5 to old roman number V ",function(){
    const input = 5
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("V")
  })
  
  test("Converts numerical number 9 to old roman number VIIII",function(){
    const input = 9
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("VIIII")
  })

  test("Converts numerical number 10 to old roman number X ",function(){
    const input = 10
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("X")
  })

  test("Converts numerical number 50 to old roman number L ",function(){
    const input = 50
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("L")
  })

  test("Converts numerical number 99 to old roman number LXXXXVIIII ",function(){
    const input = 99
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("LXXXXVIIII")
  })

  test("Converts numerical number 100 to old roman number C ",function(){
    const input = 100
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("C")
  })
  
  test("Converts numerical number 999 to old roman number CCCCCCCCCLXXXXVIIII",function(){
    const input =  999
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("CCCCCCCCCLXXXXVIIII")
  })
  
  test("Converts numerical number 1000 to old roman number M ",function(){
    const input = 1000
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("M")
  })
  
  test("Converts numerical number 2999 to old roman number MMCCCCCCCCCLXXXXVIIII ",function(){
    const input = 2999
    const recivedResult = convertToOldRoman(input)
    expect(recivedResult).toBe("MMCCCCCCCCCLXXXXVIIII")
  })
  

})


describe("Handle bounday cases and invalid inputs",function(){

  test("Returns false if input is undefined", function(){
    const input = undefined
    const result = convertToOldRoman(input)
    expect(result).toBe(false)
  })

  test("Returns false for empty input",function(){
    const input = ""
    const recivedResult = convertToOldRoman(input)
    expect(convertToOldRoman(recivedResult)).toBe(false)
  })
  
  test("Returns false if input is null",function(){
    const input = null
    const recivedResult = convertToOldRoman(input)
    expect(convertToOldRoman(recivedResult)).toBe(false)
  })
  
  test("Returns false if input is non-number type",function(){
    const input = "hfueho"
    const recivedResult = convertToOldRoman(input)
    expect(convertToOldRoman(recivedResult)).toBe(false)
  })
  
  test("Returns false if input is 0",function(){
    const input = 0
    const recivedResult = convertToOldRoman(input)
    expect(convertToOldRoman(recivedResult)).toBe(false)
  })
  
  test("Returns false if input is 4000",function(){
    const input = 4000
    const recivedResult = convertToOldRoman(input)
    expect(convertToOldRoman(recivedResult)).toBe(false)
  })

})


