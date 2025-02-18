
const verifyEmail = require("../verifyEmail")
describe("Verify wheather an email address is valid or invalid",()=>{
 
  //====================Valid Inputs Return True==================================
  test("Return false if email address is: invalidemail ",function(){
     //Arrange-objects or variables are set up to get ready to run the code being tested.
    const email = "invalidemail"
    // Act- behavior being validated is actually executed.
    const recivedResult = verifyEmail(email)
    // Assert-actual behavior of the code being tested matches its expected behavior.
    expect(recivedResult).toBe (false)
  })

  test("Return false if email address is: test@example",function(){
    //Arrange-objects or variables are set up to get ready to run the code being tested.
   const email = "test@example"
   // Act- behavior being validated is actually executed.
   const recivedResult = verifyEmail(email)
   // Assert-actual behavior of the code being tested matches its expected behavior.
   expect(recivedResult).toBe (false)
 })

  test("Return false if email address is: testexample.com ",function(){
    //Arrange-objects or variables are set up to get ready to run the code being tested.
  const email = "testexample.com"
  // Act- behavior being validated is actually executed.
  const recivedResult = verifyEmail(email)
  // Assert-actual behavior of the code being tested matches its expected behavior.
  expect(recivedResult).toBe (false)
  })

  test("Return false if email address is: test@example..com",function(){
    //Arrange-objects or variables are set up to get ready to run the code being tested.
  const email = "test@example..com"
  // Act- behavior being validated is actually executed.
  const recivedResult = verifyEmail(email)
  // Assert-actual behavior of the code being tested matches its expected behavior.
  expect(recivedResult).toBe (false)
  })

  test("Return false if email address is: test.example.com",function(){
    //Arrange-objects or variables are set up to get ready to run the code being tested.
  const email = "test.example.com"
  // Act- behavior being validated is actually executed.
  const recivedResult = verifyEmail(email)
  // Assert-actual behavior of the code being tested matches its expected behavior.
  expect(recivedResult).toBe (false)
  })
  

  //==============================================================================
  //====================Valid Inputs Return True==================================
  test("Return true if email adress is: test@example.com",function(){
    //Arrange: 
    const email = "test@example.com"
    //Act
    const expectResult = verifyEmail(email)
    //Assert
    expect(expectResult).toBe(true)
  })
 
  test("Return true if email adress is: test.email@example.com",function(){
    //Arrange: 
    const email = "test.email@example.com"
    //Act
    const expectResult = verifyEmail(email)
    //Assert
    expect(expectResult).toBe(true)
  })
  
  test("Return true if email adress is: test_email@example.com",function(){
    //Arrange: 
    const email = "test_email@example.com"
    //Act
    const expectResult = verifyEmail(email)
    //Assert
    expect(expectResult).toBe(true)
  })
   
 
})


//===========================================================
//==================== NON-String Cases or Empty String ===========================
describe("Handle non-string or empty string inputs",function(){
  test("Return false if input is empty",function(){
    //Arrange
   const email = " "
   //Act
   const expectResult = verifyEmail(email)
   // Assert-actual behavior of the code being tested matches its expected behavior.
   expect(expectResult).toBe(false)
 })
 
 test("Return false if  input is undefined",function(){
    //Arrange
   const email = undefined
   //Act
   const expectResult = verifyEmail(email)
   // Assert-actual behavior of the code being tested matches its expected behavior.
   expect(expectResult).toBe(false)
 })
 
 test("Return false if input is null",function(){
   //Arrange
   const email = null
   // Act
   const expectResult = verifyEmail(email)
   // Assert-actual behavior of the code being tested matches its expected behavior.
   expect(expectResult).toBe(false)
 })

 test("Return false if input is not string",function(){
   //Arrange
   const email = 123
   // Act
   const expectResult = verifyEmail(email)
   // Assert-actual behavior of the code being tested matches its expected behavior.
   expect(expectResult).toBe(false)
 })

})

//=======================Boundary cases===========
describe("Handle boundary cases",function(){
  
  test("Return true if email is: a@b.123",function(){
    const email = "a@b.123"
    const recivedResult = verifyEmail(email)
    expect(recivedResult).toBe(false)
  })

  test("Return true if email is: a@b.",function(){
    const email = "a@b."
    const recivedResult = verifyEmail(email)
    expect(recivedResult).toBe(false)
  })
  
  test("Return true if email is: a@b.ccc",function(){
    const email = "a@b.ccc"
    const recivedResult = verifyEmail(email)
    expect(recivedResult).toBe(true)
  })

})
