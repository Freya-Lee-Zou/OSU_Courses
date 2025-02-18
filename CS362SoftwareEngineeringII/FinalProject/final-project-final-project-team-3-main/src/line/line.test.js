/**
 * @jest-environment jsdom
 */
 require("@testing-library/jest-dom/extend-expect")
 require("whatwg-fetch")
 const domTesting = require("@testing-library/dom")
 const userEvent = require("@testing-library/user-event").default
 const responseCharBuilder = require("../chartBuilder/chartBuilder")
 const generateChartImg = require("../lib/generateChartImg")
 const fs = require("fs")
 const { type } = require("os")
 
 beforeEach(function(){

  window.localStorage.clear()
 })



 // Helper function to render HTML and JS files
 function initDomFromFiles(htmlPath, jsPath){
  const html = fs.readFileSync(htmlPath, 'utf8')
  document.open()
  document.write(html)
  document.close()
  jest.isolateModules(function () {
      require(jsPath)
  })
 }


 describe ("• Adding values in the chart builder:",function(){
  
  test("add a new pair of input fields in the Dom",async function(){
    //Render files
    initDomFromFiles(
      __dirname + "/line.html",
      __dirname + "/line.js"
    )

    // Arrange 
    const addbtn = domTesting.getByText(document,"+")
    const inputXVal = domTesting.getByLabelText(document,"X")
    const inputYVal= domTesting.getByLabelText(document,"Y")
    
    // Action
    const user = userEvent.setup()
    await user.click(addbtn)
    
    //Assertion
    //toBeInTheDocument() checks whether a given element is present in in the DOM. 
    // It verifys if a component or element has been rendered correctly.
    expect(inputXVal).toBeInTheDocument()
    expect(inputYVal).toBeInTheDocument()
    // Verify that a new pair of input fields is added
    const newInputXFields = domTesting.getAllByLabelText(document, "X");
    expect(newInputXFields).toHaveLength(2); 
    const newInputYFields = domTesting.getAllByLabelText(document, "Y");
    expect(newInputYFields).toHaveLength(2); 
  })
  

  test("Non-Impacting Button Click",async function(){
    //Render files
    initDomFromFiles(
      __dirname + "/line.html",
      __dirname + "/line.js"
    )

    // Arrange 
    const addbtn = domTesting.getByText(document,"+")
    const inputXVal = domTesting.getByLabelText(document,"X")
    const inputYVal= domTesting.getByLabelText(document,"Y")
    
    // Assuming there is one initial pair of input fields
  
    // Action
    const user = userEvent.setup()
    await user.type(inputXVal,"1")
    await user.type(inputYVal,"2")
    // Store the values just type in the blank to the variabls:XInputBeforeClick,YInputBeforeClick
    const XInputBeforeClick = inputXVal.value;
    const YInputBeforeClick = inputYVal.value;
    await user.click(addbtn)
   

    //Assertion
    //Verify that the existing data is not impacted
    expect(XInputBeforeClick).toEqual("1")
    expect(YInputBeforeClick).toEqual("2")
  })

 })


 describe("• Alerts displayed for missing or wrong chart data", function(){
  
  
  test("Chart data absence alert - Missing X&Y labels", async function(){
    
    // Spy on the alert method
    const alertSpy = jest.spyOn(window, "alert")
    alertSpy.mockImplementation(function () {
      console.log("== Stubbed called...")
    })
    
    //Render files
    initDomFromFiles(
      __dirname + "/line.html",
      __dirname + "/line.js"
    )
    
    //Arrange
    const generateChartBtn = domTesting.getByText(document,"Generate chart")
    const XInput = domTesting.getAllByText(document,"X")
    const YInput = domTesting.getAllByText(document,"Y")
   
    //Action
    const user = userEvent.setup()
    await user.type(XInput[0],"1")
    await user.type(YInput[0],"2")

    //Click Generate chart button
    await user.click(generateChartBtn)
  
    // Assertion 
    expect(alertSpy).toHaveBeenCalledTimes(1)
    expect(alertSpy).toHaveBeenCalledWith("Error: Must specify a label for both X and Y!")
    
    //Restore the alert method
    alertSpy.mockRestore()
  })

  
  test("Incorrect chart data alert - missing data points", async function () {
    // Spy on the alert method
    const alertSpy = jest.spyOn(window, "alert")
    alertSpy.mockImplementation(function () {
      console.log("== Stubbed called...")
    })
   
    // Render files
    initDomFromFiles(
      __dirname + "/line.html",
      __dirname + "/line.js"
    );
  
    // Arrange
    const generateChartBtn = domTesting.getByText(document, "Generate chart")
    const XLabelInput = domTesting.getByText(document, "X label")
    const YLabelInput = domTesting.getByText(document, "Y label")
  
    // Action
    const user = userEvent.setup()
    await user.type(XLabelInput, "Cats")
    await user.type(YLabelInput, "Dogs")
    await user.click(generateChartBtn)
    

    // Assertion
    expect(alertSpy).toHaveBeenCalledTimes(1)
    expect(alertSpy).toHaveBeenCalledWith("Error: No data specified!")
    
    // Restore the alert method and fetch property
    alertSpy.mockRestore();
  })
  
 })



 describe("•Clearing chart data",function(){
  
  test("Clear the title, color,X&Y labels,and data points the user entered,", async function(){
    //Render files
    initDomFromFiles(
      __dirname + "/line.html",
      __dirname + "/line.js"
    )

    // Arrange 
    const addbtn = domTesting.getByText(document,"+")
    const charTitle = domTesting.getByText(document,"Chart title")
    const charColor = domTesting.getByText(document,"Chart color")
    const clearBtn = domTesting.getByText(document,"Clear chart data")
    const XLabelInput = domTesting.getByText(document,"X label")
    const YLabelInput = domTesting.getByText(document,"Y label")
    
    
    // Action
    const user = userEvent.setup()
    await user.type(charTitle,"Cats VS Dogs")
    await user.type(XLabelInput,"Cats")
    await user.type(YLabelInput,"Dogs")
    await user.click(charColor)
    await user.click()
    
    
    await user.click(addbtn)
    const XinputVal = domTesting.getAllByLabelText(document,"X")
    const YinputVal= domTesting.getAllByLabelText(document,"Y")
    await user.type(XinputVal[0],"1")
    await user.type(YinputVal[0],"2")
    
    await user.type(XinputVal[1],"3")
    await user.type(YinputVal[1],"4")
    // click clear button
    await user.click(clearBtn)
    
    // Assertion 
    expect(charTitle).not.toHaveValue()
    expect(XLabelInput).not.toHaveValue()
    expect(YLabelInput).not.toHaveValue()
    expect(charColor).not.toHaveValue()
    // Verify that only one pair of input fields remains
    const newInputXFields = domTesting.getAllByLabelText(document, "X");
    expect(newInputXFields).toHaveLength(1);
    const newInputYFields = domTesting.getAllByLabelText(document, "Y");
    expect(newInputYFields).toHaveLength(1);
  })

 })



// Setup stub for spy
 jest.mock("../lib/generateChartImg", function () {
  return jest.fn().mockResolvedValue("http://placekitten.com/480/480");
});

describe("•Data correctly sent to chart generation function", function(){
  
  test("Chart data is correctly sent to generateChartImg()", async function () {
    //Render files
    initDomFromFiles(
      __dirname + "/line.html",
      __dirname + "/line.js"
    )


    // Arrange buttons
    const addbtn = domTesting.getByText(document,"+")
    const charTitle = domTesting.getByText(document,"Chart title")
    const charColor = domTesting.getByText(document,"Chart color")
    const generateChartBtn = domTesting.getByText(document,"Generate chart")
    const XLabelInput = domTesting.getByText(document,"X label")
    const YLabelInput = domTesting.getByText(document,"Y label")
    
    // Action
    const user = userEvent.setup()
    await user.type(charTitle,"Cats VS Dogs")
    await user.type(XLabelInput,"Cats")
    await user.type(YLabelInput,"Dogs")
    await user.click(charColor)
    await user.click()
    
    // Generate boxes to input {X, Y} data
    for (let i = 0; i < 4; i++) {
      await user.click(addbtn);
    }

    // Generate arrays of input
    const XinputVal = domTesting.getAllByLabelText(document,"X")
    const YinputVal= domTesting.getAllByLabelText(document,"Y")

    //Typing user data input
    await user.type(XinputVal[0],"1")
    await user.type(YinputVal[0],"3")
    
    await user.type(XinputVal[1],"2")
    await user.type(YinputVal[1],"7")

    await user.type(XinputVal[2],"3")
    await user.type(YinputVal[2],"15")

    await user.type(XinputVal[3],"4")
    await user.type(YinputVal[3],"25")

    await user.type(XinputVal[4],"5")
    await user.type(YinputVal[4],"40")
    
    // Click generate chart
    await user.click(generateChartBtn)
    

    // Verify function parameters
  expect(generateChartImg).toHaveBeenCalledWith(
    'line',
    [
      { x: '1', y: '3' },
      { x: '2', y: '7' },
      { x: '3', y: '15' },
      { x: '4', y: '25' },
      { x: '5', y: '40' }
    ],
    'Cats',
    'Dogs',
    'Cats VS Dogs',
    '#ff4500'
  )

  })
  
})