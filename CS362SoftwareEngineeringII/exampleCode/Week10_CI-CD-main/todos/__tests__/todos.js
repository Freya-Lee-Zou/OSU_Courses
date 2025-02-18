/**
 * @jest-environment jsdom
 */

require("whatwg-fetch")
require("@testing-library/jest-dom/extend-expect")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

const initDomFromFiles = require("../../test-utils/init-dom-from-files")

test("correctly creates a to-do", async function () {
    initDomFromFiles(
        __dirname + "/../index.html",
        __dirname + "/../todos.js"
    )

    const todoInput = domTesting.getByPlaceholderText(document, "Enter a To-Do")
    const addTodoButton = domTesting.getByRole(
        document,
        "button",
        { name: "Add To-Do" }
    )
    const incompleteTodos = domTesting.getByTestId(document, "incomplete-todos")

    const user = userEvent.setup()
    await user.type(todoInput, "Find this to-do in the DOM")
    await user.click(addTodoButton)

    expect(incompleteTodos).toHaveTextContent("Find this to-do in the DOM")
})
