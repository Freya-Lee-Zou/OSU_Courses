/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom/extend-expect") //To import new matchers 
const domTesting = require("@testing-library/dom") // To be able to use getBy() fucntions
const userEvent = require("@testing-library/user-event").default 

//To be able to use Fucntions such as open(),write(),close()
const fs = require("fs")

// Helper function to set up for testing
function initDomFromFiles(htmlPath, jsPath){
  const html = fs.readFileSync(htmlPath,'utf-8')
  document.open()
  document.write(html)
  document.close()
  // this line of code load module, it wont load second time.
  // a solution in below 
  // ensure we can run this require (jsPath) every time
  jest.isolateModules(function(){
    require(jsPath);
  }) 
} 

//==========================Test Starts Here==================
describe("Successful registration",function(){
 
  test("User type correct password and email address then registered sucessfully",async function(){
     // render Js script and HTMl file
     initDomFromFiles(
        __dirname+"/registerUser.html",
        __dirname +"/registerUser.js"
     )
     //Arrange
     // Grab elements I want to test
     const userEmailInput = domTesting.getByLabelText(document,"Email")
     const userPaswordInput = domTesting.getByLabelText(document,"Password")
     const register = domTesting.getByRole(document,"button")
     
     // Action
     // User type c valid email address and password in blank boxes
     const user = userEvent.setup()
     await user.type(userEmailInput,"test@oregonstate.edu")
     await user.type(userPaswordInput,"abc123ABC!!!")
     await user.click(register)
     
     //Assertion
     const successDiv = domTesting.getByRole(document, 'status')
     expect(successDiv).toBeInTheDocument();
     expect(successDiv).toHaveAttribute("role", "status")
     expect(successDiv).toHaveTextContent("✅ Success")
     expect(successDiv).toHaveTextContent("You have successfully registered.")
  })

  test("from fields are cleared when successfully registered",async function(){
    // render Js script and HTMl file
    initDomFromFiles(
       __dirname+"/registerUser.html",
       __dirname +"/registerUser.js"
    )
    
    // Grab elements I want to test
    const userEmailInput = domTesting.getByLabelText(document,"Email")
    const userPaswordInput = domTesting.getByLabelText(document,"Password")
    const register = domTesting.getByRole(document,"button")
    
    // User type in  blank boxes
    const user = userEvent.setup()
    //type will also return a promise object
    await user.type(userEmailInput,"test@oregonstate.edu")
    await user.type(userPaswordInput,"abc123ABC!!!")
    await user.click(register)
    
    // Use not modifier to test after insertion, blank boxes are clearned 
    expect(userEmailInput).not.toHaveValue
    expect(userPaswordInput).not.toHaveValue

  })
  
})

//====================================Faild to register======================
// if failed to register
describe("Failed registration",function(){
  
  test("if user didn't type password",async function(){
    initDomFromFiles(
      __dirname+"/registerUser.html",
      __dirname +"/registerUser.js"
    )
    
    // Grab elements I want to test
    const userEmailInput = domTesting.getByLabelText(document,"Email")
    const userPaswordInput = domTesting.getByLabelText(document,"Password")
    const register = domTesting.getByRole(document,"button")
    
    //User only enter valid email address
    const user = userEvent.setup()
    await user.type(userEmailInput,"test@oregonstate.edu")
    await user.click(register)
    
    // Check if correct error messages are displyed
    const errorDiv = domTesting.getByRole(document, 'alert')
    expect(errorDiv).not.toBeEmptyDOMElement()
    expect(errorDiv).toHaveAttribute("role", "alert")

    expect(errorDiv).toHaveTextContent("❌ Error")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    
    expect(errorDiv).toHaveTextContent("Password needs to be at least 8 characters")
    expect(errorDiv).toHaveTextContent("Password needs an upper case letter")
    expect(errorDiv).toHaveTextContent("Password needs a lower case letter")
    expect(errorDiv).toHaveTextContent("Password needs a numeric digit (0-9)")
    expect(errorDiv).toHaveTextContent("Password needs a symbol (!@#$%^&*)")
    expect(errorDiv).toHaveTextContent("Password contains an invalid character (only letters, numbers, and the symbols !@#$%^&* are allowed)")
  })


  test("didn't clear the email field, when user only typed password",async function(){
    
      initDomFromFiles(
        __dirname+"/registerUser.html",
        __dirname +"/registerUser.js"
      )
      
      // Grab elements I want to test
      const userEmailInput = domTesting.getByLabelText(document,"Email")
      const userPaswordInput = domTesting.getByLabelText(document,"Password")
      const register = domTesting.getByRole(document,"button")
      
      // user Only enter email address
      const user = userEvent.setup()
      await user.type(userEmailInput,"test@oregonstate.edu")
      await user.click(register)
      
      expect(userEmailInput).toHaveValue("test@oregonstate.edu")
      expect (userPaswordInput).not.toHaveValue()
  })
  



  test("if user didn't type email address ",async function(){
    // render two files
    initDomFromFiles(
      __dirname+"/registerUser.html",
      __dirname +"/registerUser.js"
    )
    // Grab elements I want to test
    const userEmailInput = domTesting.getByLabelText(document,"Email")
    const userPaswordInput = domTesting.getByLabelText(document,"Password")
    const register = domTesting.getByRole(document,"button")
    

    //When user enter only valid password
    const user = userEvent.setup()
    await user.type(userPaswordInput,"abc123ABC!!!")
    await user.click(register)
    
    // Check if displayed the correct error message
    const errorDiv = domTesting.getByRole(document, 'alert')
    expect(errorDiv).not.toBeEmptyDOMElement()
    expect(errorDiv).toHaveAttribute("role", "alert")
  
    expect(errorDiv).toHaveTextContent("❌ Error")
    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")

  })


  test("didnt clear the password field, when user only typed email address",async function(){
    
    initDomFromFiles(
      __dirname+"/registerUser.html",
      __dirname +"/registerUser.js"
    )
    
    // Grab elements I want to test
    const userEmailInput = domTesting.getByLabelText(document,"Email")
    const userPaswordInput = domTesting.getByLabelText(document,"Password")
    const register = domTesting.getByRole(document,"button")
   
    
    const user = userEvent.setup()
    await user.type(userPaswordInput,"abc123ABC!!!")
    await user.click(register)
    
    expect(userEmailInput).not.toHaveValue()
    expect(userPaswordInput).toHaveValue("abc123ABC!!!")
    

})

  test("if user leave Email and password blanks box empty",async function(){
    // render two files
    initDomFromFiles(
      __dirname+"/registerUser.html",
      __dirname +"/registerUser.js"
    )
    // Grab elements I want to test
    // const userEmailInput = domTesting.getByLabelText(document,"Email")
    // const userPaswordInput = domTesting.getByLabelText(document,"Password")
    const register = domTesting.getByRole(document,"button")
    
    // User didnt enter anything and click register button
    const user = userEvent.setup()
    await user.click(register)
    
    // Assertion
    const errorDiv = domTesting.getByRole(document, 'alert')
    expect(errorDiv).not.toBeEmptyDOMElement()
    expect(errorDiv).toHaveAttribute("role", "alert")
  
    expect(errorDiv).toHaveTextContent("❌ Error")
    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")
    
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs to be at least 8 characters")
    expect(errorDiv).toHaveTextContent("Password needs an upper case letter")
    expect(errorDiv).toHaveTextContent("Password needs a lower case letter")
    expect(errorDiv).toHaveTextContent("Password needs a numeric digit (0-9)")
    expect(errorDiv).toHaveTextContent("Password needs a symbol (!@#$%^&*)")
    expect(errorDiv).toHaveTextContent("Password contains an invalid character (only letters, numbers, and the symbols !@#$%^&* are allowed)")

  })

  test("if user type invalid password:abc123",async function(){
    // render two files
    initDomFromFiles(
     __dirname+"/registerUser.html",
     __dirname +"/registerUser.js"
   )
   // Grab elements I want to test
   const userEmailInput = domTesting.getByLabelText(document,"Email")
   const userPaswordInput = domTesting.getByLabelText(document,"Password")
   const register = domTesting.getByRole(document,"button")
   
   const user = userEvent.setup()
   await user.type(userEmailInput,"test@oregonstate.edu")
   await user.type(userPaswordInput,"abc123")
   await user.click(register)

   const errorDiv = domTesting.getByRole(document, 'alert')
   expect(errorDiv).not.toBeEmptyDOMElement()
   expect(errorDiv).toHaveAttribute("role", "alert")
 
 
   expect(errorDiv).toHaveTextContent("❌ Error")
   expect(errorDiv).toHaveTextContent("The password you entered is invalid.")

   expect(errorDiv).toHaveTextContent("Password needs to be at least 8 characters")
   expect(errorDiv).toHaveTextContent("Password needs an upper case letter")
   expect(errorDiv).toHaveTextContent("Password needs a symbol (!@#$%^&*)")
 })
 

  test ("if user type the invalid password with: ABC1234a",async function(){
    // render two files
    initDomFromFiles(
      __dirname+"/registerUser.html",
      __dirname +"/registerUser.js"
    )

    // Grab elements I want to test
    const userEmailInput = domTesting.getByLabelText(document,"Email")
    const userPaswordInput = domTesting.getByLabelText(document,"Password")
    const register = domTesting.getByRole(document,"button")
    

    // mimic user 
    const user = userEvent.setup()
    //type will also return a promise object
    await user.type(userEmailInput,"test@oregonstate.edu")
    await user.type(userPaswordInput,"ABC1234a")
    await user.click(register)
  
    const errorDiv = domTesting.getByRole(document, 'alert')
    expect(errorDiv).not.toBeEmptyDOMElement()
    expect(errorDiv).toHaveAttribute("role", "alert")

    expect(errorDiv).toHaveTextContent("❌ Error")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent('Password needs a symbol (!@#$%^&*)')

  })

  test("if user type invalid email address:invalidEmail",async function(){
    // render two files
    initDomFromFiles(
     __dirname+"/registerUser.html",
     __dirname +"/registerUser.js"
   )
   // Grab elements I want to test
   const userEmailInput = domTesting.getByLabelText(document,"Email")
   const userPaswordInput = domTesting.getByLabelText(document,"Password")
   const register = domTesting.getByRole(document,"button")
   
   const user = userEvent.setup()
   await user.type(userEmailInput,"invalidEmail")
   await user.type(userPaswordInput,"password12!")
   await user.click(register)

   const errorDiv = domTesting.getByRole(document, 'alert')
   expect(errorDiv).not.toBeEmptyDOMElement()
   expect(errorDiv).toHaveAttribute("role", "alert")
   expect(errorDiv).toHaveTextContent("❌ Error")
   expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")

 })


  test("form fields are not cleared when unsuccessful(email and password balnks)", async function () {
     // render two files
     initDomFromFiles(
      __dirname+"/registerUser.html",
      __dirname +"/registerUser.js"
    )
    // Grab elements I want to test
    const userEmailInput = domTesting.getByLabelText(document,"Email")
    const userPaswordInput = domTesting.getByLabelText(document,"Password")
    const register = domTesting.getByRole(document,"button")


    // User type in  blank boxes
    const user = userEvent.setup()
    //type will also return a promise object
    await user.type(userEmailInput,"test@oregonstate.edu")
    await user.type(userPaswordInput,"abc123")
    await user.click(register)
    
    expect(userEmailInput).toHaveValue()
    expect(userPaswordInput).toHaveValue()
  })
  

})





