startTodosApp()

function startTodosApp() {
    /*
     * Set up the arrays where data for the app will be stored.
     */
    const incompleteTodos = []
    const completedTodos = []
    const archivedTodos = []
    let currentTodoId = 1

    /*
     * Grab the important elements from the DOM.
     */
    const todoForm = document.getElementById("todo-form")
    const todoInput = document.getElementById("todo")
    const incompleteTodosList = document.getElementById("incomplete-todos")
    const completedTodosList = document.getElementById("completed-todos")
    const archivedTodosList = document.getElementById("archived-todos")

    /*
     * Load any stored to-dos and render them.
     */
    loadTodos()
    rerenderTodos()

    /*
     * If we're on the home page and the todo entry form is present, attach
     * a submit listener to the form that adds a new incomplete todo.
     */
    todoForm && todoForm.addEventListener("submit", function (event) {
        event.preventDefault()
        const todoText = todoInput.value.trim()
        if (todoText) {
            addNewTodo(todoText)
            rerenderTodos()
            storeTodos()
        }
        todoInput.value = ""
    })

    /*
     * If we're on the home page and the list of incomplete todos is present,
     * attach a listener that will listen for changes to the checkboxes of all
     * the todos in the list.  When the checkbox is changed, move the
     * corresponding todo from the incomplete todos list to the completed todos
     * list.
     */
    incompleteTodosList && incompleteTodosList.addEventListener("change", function (event) {
        if (event.target.type === "checkbox") {
            const todoElem = event.target.parentNode
            moveTodoAndToggle(todoElem.dataset.id, incompleteTodos, completedTodos)
            rerenderTodos()
            storeTodos()
        }
    })

    /*
     * If we're on the home page and the list of completed todos is present,
     * attach a listener that will listen for changes to the checkboxes of all
     * the todos in the list.  When a checkbox is changed, move the
     * corresponding todo from the completed todos list to the incomplete todos
     * list.
     */
    completedTodosList && completedTodosList.addEventListener("change", function (event) {
        if (event.target.type === "checkbox") {
            const todoElem = event.target.parentNode
            moveTodoAndToggle(todoElem.dataset.id, completedTodos, incompleteTodos)
            rerenderTodos()
            storeTodos()
        }
    })

    /*
     * If we're on the home page and the list of completed todos is present,
     * attach a listener that will listen for clicks on the archive buttons
     * of all the todos in the list.  When an archive button is clicked,
     * archive the corresponding todo.
     */
    completedTodosList && completedTodosList.addEventListener("click", function (event) {
        let archiveButton = null
        if (event.target.classList.contains("archive")) {
            archiveButton = event.target
        } else if (event.target.parentNode.classList.contains("archive")) {
            archiveButton = event.target.parentNode
        }

        if (archiveButton) {
            const todoElem = archiveButton.parentNode
            archiveTodo(todoElem.dataset.id)
            rerenderTodos()
            storeTodos()
        }
    })

    /*
     * If we're on the archive page and the list of archived todos is present,
     * attach a listener that will listen for clicks on the unarchive buttons
     * of all the todos in the list.  When an unarchive button is clicked,
     * unarchive the corresponding todo (moving it back to the list of
     * completed todos).
     */
    archivedTodosList && archivedTodosList.addEventListener("click", function (event) {
        let unarchiveButton = null
        if (event.target.classList.contains("unarchive")) {
            unarchiveButton = event.target
        } else if (event.target.parentNode.classList.contains("unarchive")) {
            unarchiveButton = event.target.parentNode
        }

        if (unarchiveButton) {
            const todoElem = unarchiveButton.parentNode
            unarchiveTodo(todoElem.dataset.id)
            rerenderTodos()
            storeTodos()
        }
    })

    /*
     * If we're on the archive page and the list of archived todos is present,
     * attach a listener that will listen for clicks on the delete buttons of
     * all the todos in the list.  When a delete button is clicked, delete the
     * corresponding todo.
     */
    archivedTodosList && archivedTodosList.addEventListener("click", function (event) {
        let deleteButton = null
        if (event.target.classList.contains("delete")) {
            deleteButton = event.target
        } else if (event.target.parentNode.classList.contains("delete")) {
            deleteButton = event.target.parentNode
        }

        if (deleteButton) {
            const todoElem = deleteButton.parentNode
            deleteTodo(todoElem.dataset.id)
            rerenderTodos()
            storeTodos()
        }
    })

    /*
     * This function creates a new todo data object and adds it to the list
     * of incomplete todos.
     */
    function addNewTodo(text) {
        const newTodo = {
            text: text,
            completed: false,
            archived: false,
            id: currentTodoId++
        }
        incompleteTodos.unshift(newTodo)
    }

    /*
     * This function removes a todo from one data array and appends it to
     * another.  The todo is located in the source array based on its `id`.
     * If `destArray` is falsy, the todo is simply removed from `sourceArray`.
     */
    function moveTodoAndToggle(todoId, sourceArray, destArray) {
        const idx = sourceArray.findIndex(t => t.id == todoId)
        let todo = null
        if (idx !== -1) {
            todo = sourceArray.splice(idx, 1)[0]
            if (destArray) {
                todo.completed = !todo.completed
                destArray.push(todo)
            }
        }
        return todo
    }

    /*
     * This function archives a todo by moving it from the array of completed
     * todos to the array of archived todos.  The todo to be archived is
     * specified by its `id`.  The todo that is moved is marked as archived.
     */
    function archiveTodo(todoId) {
        const todo = moveTodoAndToggle(todoId, completedTodos, archivedTodos)
        if (todo) {
            /*
             * moveTodoAndToggle() will toggle the todo's `completed` state,
             * which we don't want to do in this situation.  Make sure the
             * todo is still marked as completed.
             */
            todo.completed = true
            todo.archived = true
        }
    }

    /*
     * This function unarchives a todo by moving it from the array of archived
     * todos to the array of completed todos.  The todo to be unarchived is
     * specified by its `id`.  The todo that is moved is marked as unarchived.
     */
    function unarchiveTodo(todoId) {
        const todo = moveTodoAndToggle(todoId, archivedTodos, completedTodos)
        if (todo) {
            /*
             * moveTodoAndToggle() will toggle the todo's `completed` state,
             * which we don't want to do in this situation.  Make sure the
             * todo is still marked as completed.
             */
            todo.completed = true
            todo.archived = false
        }
    }

    /*
     * This function deletes a todo by removing it from the array of archived
     * todos.
     */
    function deleteTodo(todoId) {
        moveTodoAndToggle(todoId, archivedTodos, null)
    }

    /*
     * This function re-renders all the todo lists on the current page by
     * first clearing each todo list that is present and then looping through
     * the corresponding array of todo data, generating a new todo element
     * to represent each todo, and inserting each of those elements into the
     * corresponding list in the DOM.
     */
    function rerenderTodos() {
        if (incompleteTodosList) {
            incompleteTodosList.innerHTML = ""
            for (let i = 0; i < incompleteTodos.length; i++) {
                const todoElem = generateTodoElem(incompleteTodos[i])
                incompleteTodosList.append(todoElem)
            }
        }

        if (completedTodosList) {
            completedTodosList.innerHTML = ""
            for (let i = 0; i < completedTodos.length; i++) {
                const todoElem = generateTodoElem(completedTodos[i])
                completedTodosList.append(todoElem)
            }
        }

        if (archivedTodosList) {
            archivedTodosList.innerHTML = ""
            for (let i = 0; i < archivedTodos.length; i++) {
                const todoElem = generateTodoElem(archivedTodos[i])
                archivedTodosList.append(todoElem)
            }
        }
    }

    /*
     * This function generates a new todo element to be inserted into the DOM.
     */
    function generateTodoElem(todo) {
        const todoElem = document.createElement("li")
        todoElem.classList.add("todo")
        todoElem.dataset.id = todo.id
        todoElem.dataset.testid = `todo-${todo.id}`

        /*
         * If the todo is an archived todo, add "delete" and "unarchive"
         * buttons.
         */
        if (todo.archived) {
            todoElem.innerHTML += "<button class='action delete' title='Delete to-do'><i class='fa-regular fa-trash-can'></i></button>"
            todoElem.innerHTML += "<button class='action unarchive' title='Unarchive to-do'><i class='fa-solid fa-arrow-up-from-bracket'></i></button>"
        }

        /*
         * If the todo is completed but not archived, add an "archive" button.
         */
        if (todo.completed && !todo.archived) {
            todoElem.innerHTML += "<button class='action archive' title='Archive to-do'><i class='fa-solid fa-box-archive'></i></button>"
        }

        todoElem.innerHTML += "<input type='checkbox' /><p class='todo-text'></p>"

        const todoCheckbox = todoElem.getElementsByTagName("input")[0]
        todoCheckbox.checked = todo.completed
        if (todo.archived) {
            todoCheckbox.disabled = true
        }

        const todoTextElem = todoElem.getElementsByClassName("todo-text")[0]
        todoTextElem.textContent = todo.text

        return todoElem
    }

    /*
     * This function writes all todo data out to local storage.
     */
    function storeTodos() {
        window.localStorage.setItem("incompleteTodos", JSON.stringify(incompleteTodos))
        window.localStorage.setItem("completedTodos", JSON.stringify(completedTodos))
        window.localStorage.setItem("archivedTodos", JSON.stringify(archivedTodos))
        window.localStorage.setItem("currentTodoId", JSON.stringify(currentTodoId))
    }

    /*
     * This function loads all todo data from local storage.
     */
    function loadTodos() {
        const incompleteTodosJson = window.localStorage.getItem("incompleteTodos") || "[]"
        incompleteTodos.splice(0, 0, ...JSON.parse(incompleteTodosJson))

        const completedTodosJson = window.localStorage.getItem("completedTodos") || "[]"
        completedTodos.splice(0, 0, ...JSON.parse(completedTodosJson))

        const archivedTodosJson = window.localStorage.getItem("archivedTodos") || "[]"
        archivedTodos.splice(0, 0, ...JSON.parse(archivedTodosJson))

        const currentTodoIdJson = window.localStorage.getItem("currentTodoId") || "1"
        currentTodoId = JSON.parse(currentTodoIdJson)
    }
}
