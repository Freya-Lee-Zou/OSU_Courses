it("Chart is correctly generated ", function(){
    cy.visit("/")
    
    cy.findByText("Line").click()
    cy.generateChart()

    cy.findByRole("img").should("exist")
})

it("Chart is correctly generated ", function(){
    cy.visit("/")
    
    cy.findByText("Line").click()
    cy.generateChart()

    cy.findByText("Scatter").click()
    
    cy.findByText("Scatter Plot Builder").should("exist") //assert redirection

    cy.checkData()

    cy.findByText("Bar").click()

    cy.findByText("Bar Chart Builder").should("exist") //assert redirection

    cy.checkData()
})

it("Saving a chart to the \“gallery\”", function(){
    cy.visit("/")
    cy.findByText("Line").click()
    cy.generateChart()

    cy.findByRole("button", {name: "Save chart"}).click()
    cy.findByText("Chart saved ✔").should("exist") //assert chart saved

    cy.findByText("Gallery").click()
    cy.get("h1").contains("Gallery") //confirm redirection 

    cy.findByText("Cats vs. Dogs").should("exist") //confirm that chart exists
})

it("Re-opening a saved chart", function(){
    cy.visit("/")
    cy.findByText("Line").click()
    cy.generateChart()

    cy.findByRole("button", {name: "Save chart"}).click()

    cy.findByText("Gallery").click()
    cy.get("h1").contains("Gallery") //confirm redirection 

    cy.findByText("Cats vs. Dogs").click()

    cy.location('pathname').should('eq', '/line.html') //confirm redirection
    cy.checkData() //check all data
    cy.findByRole("img").should("exist") //check image exists
})