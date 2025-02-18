
  it("Perform a simple calculation",function(){
    cy.visit('/')
    cy.findByText("1").click()
    cy.findByText("I").should("exist")
    cy.findByText("+").click()
    cy.findByText("2").click()
    cy.findByText("II").should("exist")
    cy.findByText("+").click()
    cy.findByText("3").click()
    cy.findByText("III").should("exist")
    cy.findByText("+").click()
    cy.findByText("4").click()
    cy.findByText("IIII").should("exist")
    cy.findByText("÷").click()
    cy.findByText("X").should("exist")
    cy.findByText("5").click()
    cy.findByText("V").should("exist")
    cy.findByRole("button",{name:"="}).click()
    cy.findByText("II").should("exist")
  })


  it('Perform a calculation and convert to "modern" Roman', function() {
    cy.visit('/')
    cy.findByText("3").click()
    cy.findByText("III").should("exist")
    cy.findByText("×").click()
    cy.findByText("3").click()
    cy.findByText("III").should("exist")
    cy.findByText("3").click()
    cy.findByText("XXXIII").should("exist")
    cy.findByRole("button",{name:"="}).click()
    cy.findByText("LXXXXVIIII").should("exist")
    cy.findByRole("button",{name:"mdrn"}).click()
    //Verify that conversion to "modern" Roman numerals works correctly
    cy.findByText("XCIX").should("exist")
  })
  
  //If registration is successful, the app will automatically redirect you back to the app's home page, where the navbar should be updated to contain a "Login" link instead of the "Register" link. In your test, assert that the redirect takes place and that the navbar is updated to verify that registration was successful.
  it("Register a user",function(){
    cy.visit('/')
    cy.findByText("Register").click()
    cy.url('register').should('include', 'http://localhost:3000/register')
    cy.insertAdressPaswd("test@oregonstate.edu","abc123ABC!!!")
   
    //this line of code verifies that the current URL, filtered by "login", matches the expected URL pattern of "http://localhost:3000/". It ensures that the user is redirected to the correct page after successful form submission.
    cy.findByText("Login").should("exist")
    cy.url("login").should("include","http://localhost:3000/")
  })
  

  // If login is successful, the app will automatically redirect you back to the app's home page, where the navbar should be updated to contain three links ("History", "Logout", and "Unregister")
  it("Successful login",function(){
    cy.visit('/')
    cy.findByText("Register").click()
    cy.insertAdressPaswd("test@oregonstate.edu","abc123ABC!!!")
    cy.loginPssAdree("test@oregonstate.edu","abc123ABC!!!")
    
    cy.findByText("History").should("exist")
    cy.findByText("Logout").should("exist")
    cy.findByText("Unegister").should("exist")
    cy.url('history').should("include","http://localhost:3000/")
    cy.url('logout').should("include","http://localhost:3000/")
    cy.url('unegister').should("include","http://localhost:3000/")
  })


  it("Calculation history",function(){
    cy.visit('/')
    cy.findByText("Register").click()
    cy.insertAdressPaswd("test@oregonstate.edu","abc123ABC!!!")
    cy.loginPssAdree("test@oregonstate.edu","abc123ABC!!!")
    cy.findByText("1").click()
    cy.findByText("I").should("exist")
    cy.findByText("+").click()
    cy.findByText("2").click()
    cy.findByText("II").should("exist")
    cy.findByRole("button",{name:"="}).click()
    cy.findByText("History").click()
    cy.url("history").should("include","http://localhost:3000/history")
    cy.findByText("I + II = III").should("exist")
  })

  
it("Successful logout",function(){
  cy.visit('/')
  cy.findByText("Register").click()
  cy.url('register').should('include', 'http://localhost:3000/register')
  cy.insertAdressPaswd("test@oregonstate.edu","abc123ABC!!!")
  cy.url("login").should("include","http://localhost:3000/")
  cy.loginPssAdree("test@oregonstate.edu","abc123ABC!!!")
  cy.url().should("include","http://localhost:3000/")
  cy.findByText("Logout").click()
  cy.url("login").should("include","http://localhost:3000/")
  cy.findByText("Login").should("exist")
})

