const verifyPassword = require('../verifyPassword');

describe("Verify input password wheather satisfy the following 6 properties:",function(){
  
  test("Return false if the password contains less than 8 characters", function(){
    const password = "P4sswrd"
    const recivedResult = verifyPassword(password)
    expect(recivedResult).toEqual({
      pass: false,
      length: false,
      lowercase: true,
      uppercase: true,
      digit: true,
      symbol: false,
      noInvalid: true 
    })
  })
  
  test('Return false if the password does not contain at least one lowercase letter', () => {
    const password = "PASSWORD123!"
    const recivedResult = verifyPassword(password)
    expect(recivedResult).toEqual({
      pass: false,
      length: true,
      lowercase: false,
      uppercase: true,
      digit: true,
      symbol: true,
      noInvalid: true, 
    })

  })
  
  test('Return false if the password does not contain at least one uppercase letter', () => {
    const password = "password123!"
    const recivedResult = verifyPassword(password)
    expect(recivedResult).toEqual({
      pass: false,
      length: true,
      lowercase: true,
      uppercase: false,
      digit: true,
      symbol: true,
      noInvalid: true,
    })
  })
  
  test('Return false if the password does not contain at least one numerical digit', () => {
    const password = "Password!"
    const reciveResult= verifyPassword(password)
    expect(reciveResult).toEqual({
      pass: false,
      length: true,
      lowercase: true,
      uppercase: true,
      digit: false,
      symbol: true,
      noInvalid: true, 
    })
  })
  
  // This fucntion needs to be debuged
  test('Return false if the password does not contain at least one of the following symbols: !@#$%^&* or ', () => {
    const password = "Password1"
    const reciveResult = verifyPassword(password)
    expect(reciveResult).toEqual({
      pass: false,
      length: true,
      lowercase: true,
      uppercase: true,
      digit: true,
      symbol: false,
      noInvalid: true
    })
  })
  

  test('Return false if the password contains invalid characters', () => {
    const password = "Invalid12 !"
    const recivedResult = verifyPassword(password)
    expect(recivedResult).toEqual({
      pass: false,
      length: true,
      lowercase: true,
      uppercase: true,
      digit: true,
      symbol: true,
      noInvalid: false
      
    })
  })
  test ("Return true if passwords satisfies 6 properties",function(){
    const password = "Test8123!"
    recivedResult = verifyPassword(password)
    expect(recivedResult).toEqual({
      pass: true,
      length: true,
      lowercase: true,
      uppercase: true,
      digit: true,
      symbol: true,
      noInvalid: true,
  
    })

  })

})

// ================boundary cases=========================
describe("Handle boundary cases",function(){
  test('Return false if input is empty', () => {
    const password = ""
    reciveResult = verifyPassword(password)
    expect(reciveResult).toEqual({
      pass: false 
    })
  })

  test("Return false if password is null",function(){
    const password = null
    const result = verifyPassword(password)
    expect(result).toEqual({pass:false})

  })
  test("Return false if password is undefind",function(){
    const password = undefined
    const  result = verifyPassword(password)
    expect(result).toEqual({pass:false})
  })

  test("Return false if passwrd is NaN",function(){
    const password = NaN
    const result  = verifyPassword(password)
    expect(result).toEqual({pass:false})
  })
  
  test("Return false if password is non-string", () => {
    const password = 123;
    const result = verifyPassword(password);
    expect(result).toEqual({
      pass: false
    })
  })



})