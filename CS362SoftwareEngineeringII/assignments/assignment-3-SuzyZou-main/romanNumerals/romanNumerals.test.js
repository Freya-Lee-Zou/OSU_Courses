/**
 * @jest-environment jsdom
 */

//Provide fetch as a global fucntion
require("whatwg-fetch")

//To provide Jest matchers for making assertions about the DOM.
require("@testing-library/jest-dom/extend-expect")
//For finding elements of the UI the way a user would.
const domTesting = require("@testing-library/dom")
//For emulating user interactions with the apps.
const userEvent = require("@testing-library/user-event").default
const fakeRomanConversionResults = require("./fakeRomanConversionResults.json")
//Import fcuntions like ducument.open()...
const fs = require("fs")
const { type } = require("os")
//The word rest references for restful API,
// Every restful API's format is a link
const rest = require("msw").rest
//Set up server
const setupServer = require("msw/node").setupServer


// Helper function to  set up for testing
function initDomFromFiles(htmlPath, jsPath){
  const html = fs.readFileSync(htmlPath,'utf-8')
  document.open()
  document.write(html)
  document.close()
  // this line of code load module, it won't load second time.
  // a solution in below 
  // ensure we can run this require (jsPath) every time
  jest.isolateModules(function(){
    require(jsPath);
  }) 
} 


//==========================Test Starts Here===================
// I:Live'conversion to 'old' Roman numerals
describe("'Live'conversion to 'old' Roman numerals",function(){
  test("user inserts a valid numerical(1,12,123,1234)and displays the correct Roman number", async function() {
    // render two files
    initDomFromFiles(
      __dirname+"/romanNumerals.html",
      __dirname +"/romanNumerals.js"
    )
  
    // Get the required elements from the DOM
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    
    const user = userEvent.setup()
    // Enter an Arabic number
    await user.type(arabicNumberInput, "1")
    const oldRomanResult = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(oldRomanResult).toBeVisible("I")
   
    await user.type(arabicNumberInput, "12")
    const newoldRomanResult = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(newoldRomanResult).toBeVisible("XII")

    await user.type(arabicNumberInput,"123")
    const updatedOldRomanResult = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(updatedOldRomanResult).toBeVisible("CXXIII")

    await user.type(arabicNumberInput,"1234")
    const updatedOldRomanResultFinal = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(updatedOldRomanResultFinal).toBeVisible("MCCXXXIIII")
  })
  

  test("user inserts a valid numerical(2,32,321,3210)and displays the correct Roman number",async function(){
    
    // Render two files
    initDomFromFiles(
      __dirname+"/romanNumerals.html",
      __dirname +"/romanNumerals.js"
    )
    
    // Get the required elements from the DOM
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    
    
    // Enter an Arabic number
    user = userEvent.setup()

    await user.type(arabicNumberInput, "3")
    const oldRomanResult = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(oldRomanResult).toBeVisible("III")

    await user.type(arabicNumberInput, "32")
    const newOldRomanResult = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(newOldRomanResult).toBeVisible("XXXII")
    
    await user.type(arabicNumberInput, "321")
    const updatedOldRomanResult = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(updatedOldRomanResult).toBeVisible("CCCXXI")
    
    await user.type(arabicNumberInput, "3210")
    const updatedOldRomanResultFinal = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(updatedOldRomanResultFinal).toBeVisible("MMMCCX")

  })

  test("user inserts a valid numerical(9,98,987)and displays the correct Roman number",async function(){
    
    // Render two files
    initDomFromFiles(
      __dirname+"/romanNumerals.html",
      __dirname +"/romanNumerals.js"
    )
    
    // Get the required elements from the DOM
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
   
    
    // Enter an Arabic number
    user = userEvent.setup()
    await user.type(arabicNumberInput, "9")
    const oldRomanResult = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(oldRomanResult).toBeVisible("VIIII")
    
    user = userEvent.setup()
    await user.type(arabicNumberInput, "98")
    const newOldRomanResult = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(oldRomanResult).toBeVisible("LXXXXVIII")
    
    user = userEvent.setup()
    await user.type(arabicNumberInput, "987")
    const newOldRomanResultfinal = domTesting.getByText(document,'"Old" Roman Numeral')
    expect(newOldRomanResultfinal).toBeVisible("CCCCCCCCCLXXXVII")
   
  })


  //========================= boundary  test cases ==========
  // 1: boundary cases: 0
  test ("If user input is 0, then no value is converted",async function(){
   
    initDomFromFiles(
      __dirname+"/romanNumerals.html",
      __dirname +"/romanNumerals.js"
    )
    
    // Get the required elements from the DOM
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    const oldRomanResult = domTesting.getByText(document, '"Old" Roman Numeral')
   
    // User enter numerical value 0
    user = userEvent.setup()
    await user.type(arabicNumberInput, "0")
    
    //Check if the OldRomanResult is displayed
    expect(oldRomanResult).not.toHaveValue()

  })
  
  // 2: boundary cases: 4000
  test ("If user input is 4000, then no value is converted",async function(){
   
    initDomFromFiles(
      __dirname+"/romanNumerals.html",
      __dirname +"/romanNumerals.js"
    )
    
    // Get the required elements from the DOM
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    const oldRomanResult = domTesting.getByText(document, '"Old" Roman Numeral')
    
    // User enter numerical value 4000
    user = userEvent.setup()
    await user.type(arabicNumberInput, "4000")
    
    //Check if the OldRomanResult is displayed
    expect(oldRomanResult).not.toHaveValue()
    
  })


  // Invalid Input: if user input is a string
  test("user input is a string: l",async function(){
    // render two files
    initDomFromFiles(
      __dirname+"/romanNumerals.html",
      __dirname +"/romanNumerals.js"
    )
    
    // Get the required elements from the DOM
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    const oldRomanResult = domTesting.getByText(document, '"Old" Roman Numeral')
    
    const  user = userEvent.setup()
    await user.type(arabicNumberInput,"l")
    
    expect(arabicNumberInput).not.toHaveValue()
    expect(oldRomanResult).not.toHaveValue()
  })
  

  test("Clearing the 'Old' Roman numeral after updating the Arabic number",async function(){
    // render two files
    initDomFromFiles(
      __dirname+"/romanNumerals.html",
      __dirname +"/romanNumerals.js"
    )
    
    // Get the required elements from the DOM
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
   
    
    const  user = userEvent.setup()
    await user.type(arabicNumberInput,"987")

    await user.clear(arabicNumberInput,"7")
    const newOldRomanResult = domTesting.getByText(document, '"Old" Roman Numeral')
    expect(newOldRomanResult).toBeVisible("LXXXXVIII")
    
    await user.clear(arabicNumberInput,"8")
    const updatednewOldRomanResult = domTesting.getByText(document, '"Old" Roman Numeral')
    expect(updatednewOldRomanResult).toBeVisible("VIIII")
    
    await user.clear(arabicNumberInput,"9")
    const updatednewOldRomanResultFinal = domTesting.getByText(document, '"Old" Roman Numeral')
    expect(updatednewOldRomanResultFinal).not.toHaveTextContent()
  })


})

// Set up a fake server we want to fake
const server = setupServer(
  // Faking API with http get() method which is default
  rest.get(
    "https://romans.justyy.workers.dev/api/romans",

    //This function provides fake fucntionality we want to use when a request to this API operation is intercepted.
    //req; fake a request, res: fake response back, ctx:collection of context 
    function(req,res,ctx){
        console.log("====fake API is called")
        //Fake a response back 
        return res(ctx.json(fakeRomanConversionResults))
    }
  )
   
)

// specify one time server 
beforeAll(function () {
  server.listen()
})

// close down the server
afterAll(function () {
  server.close()
})


//II:Conversion to "modern" Roman numerals
describe("Conversion to 'modern' Roman numerals",function(){

  test("correctly renders the results from json file", async function(){
    
      initDomFromFiles(
        __dirname + "/romanNumerals.html",
        __dirname + "/romanNumerals.js"
      )

        // Grab elements that need to be tested
      const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
      const convertButton = domTesting.getByRole(document, "button", { name: 'Convert to "modern" Roman' })
      const modernRomanResult = domTesting.getByText(document, '"Modern" Roman Numeral')

      // User type in the blank box and click,
      const user = userEvent.setup()
      await user.type(arabicNumberInput,"3999")
      await user.click(convertButton)
      
      expect(modernRomanResult).toHaveTextContent(fakeRomanConversionResults.result)
  })

  test("from arabic number(1-3999)field didn't clear the blank box after click the conversion button ",async function() {
    initDomFromFiles(
      __dirname + "/romanNumerals.html",
      __dirname + "/romanNumerals.js"
    )

      // Grab elements that need to be tested
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    const convertButton = domTesting.getByRole(document, "button", { name: 'Convert to "modern" Roman' })
    const modernRomanResult = domTesting.getByText(document, '"Modern" Roman Numeral')
    
    // User type numerical value 3999 and then click the button
    const user = userEvent.setup()
    await user.type(arabicNumberInput,"999")
    await user.click(convertButton)
  
    expect(arabicNumberInput).toHaveValue()
 })

  
})


//III: Clearing the "modern" Roman numeral after updating the Arabic number
describe("Clearing the 'modern' Roman numeral after updating the Arabic number",function(){

  test("Clearing the 'modern' Roman numeral after updating the Arabic number",async function(){
    initDomFromFiles(
      __dirname + "/romanNumerals.html",
      __dirname + "/romanNumerals.js"
    )

    // Grab elements that need to be tested
    const arabicNumberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    // const convertButton = domTesting.getByRole(document, "button", { name: 'Convert to "modern" Roman' })
    const modernRomanResult = domTesting.getByText(document, '"Modern" Roman Numeral')
    
    const user = userEvent.setup()
    await user.type(arabicNumberInput,'999')
    await user.clear(arabicNumberInput)
    expect(modernRomanResult).not.toHaveTextContent()
  })

})




