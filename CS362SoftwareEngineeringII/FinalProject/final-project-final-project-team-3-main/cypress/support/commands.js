// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
require("@testing-library/cypress/add-commands")

Cypress.Commands.add("generateChart", function () {
    cy.findByLabelText("Chart title").type("Cats vs. Dogs")

    cy.findByLabelText("X label").type("Cats")
    cy.findByLabelText("Y label").type("Dogs")

    cy.findByLabelText("X").type("1")
    cy.findByLabelText("Y").type("3")
    cy.findByRole("button", {name: "+"}).click()

    cy.get(".x-value").eq(1).type("2")
    cy.get(".y-value").eq(1).type("7")
    cy.findByRole("button", {name: "+"}).click()

    cy.get(".x-value").eq(2).type("3")
    cy.get(".y-value").eq(2).type("15")
    cy.findByRole("button", {name: "+"}).click()

    cy.get(".x-value").eq(3).type("4")
    cy.get(".y-value").eq(3).type("25")
    cy.findByRole("button", {name: "+"}).click()


    cy.get(".x-value").eq(4).type("5")
    cy.get(".y-value").eq(4).type("40")
    cy.findByRole("button", {name: "Generate chart"}).click()
})

Cypress.Commands.add("checkData", function(){
    cy.findByLabelText("Chart title").get("#chart-title-input").should('have.value', 'Cats vs. Dogs')

    cy.findByLabelText("X label").get("#x-label-input").should('have.value', 'Cats')
    cy.findByLabelText("Y label").get("#y-label-input").should('have.value', 'Dogs')

    cy.get(".x-value").get(".x-value-input").eq(0).should('have.value', '1')
    cy.get(".y-value").get(".y-value-input").eq(0).should('have.value', '3')

    cy.get(".x-value").get(".x-value-input").eq(1).should('have.value', '2')
    cy.get(".y-value").get(".y-value-input").eq(1).should('have.value', '7')

    cy.get(".x-value").get(".x-value-input").eq(2).should('have.value', '3')
    cy.get(".y-value").get(".y-value-input").eq(2).should('have.value', '15')


    cy.get(".x-value").get(".x-value-input").eq(3).should('have.value', '4')
    cy.get(".y-value").get(".y-value-input").eq(3).should('have.value', '25')


    cy.get(".x-value").get(".x-value-input").eq(4).should('have.value', '5')
    cy.get(".y-value").get(".y-value-input").eq(4).should('have.value', '40')
})