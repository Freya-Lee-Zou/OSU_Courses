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

Cypress.Commands.add("addTodo", function (text) {
    cy.findByPlaceholderText("Enter a To-Do").type(text)
    cy.findByRole("button", { name: "Add To-Do" }).click()
})

Cypress.Commands.add("toggleTodoCompleted", function (text) {
    cy.findByText(text)
        .parents("[data-testid*='todo']")
        .findByRole("checkbox")
        .click()
})

Cypress.Commands.add("archiveCompletedTodo", function (text) {
    cy.findByText(text)
        .parents("[data-testid*='todo']")
        .findByRole("button", { name: "Archive to-do" })
        .click()
})

Cypress.Commands.add("deleteArchivedTodo", function (text) {
    cy.findByText(text)
        .parents("[data-testid*='todo']")
        .findByRole("button", { name: "Delete to-do" })
        .click()
})
