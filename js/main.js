let storage = window.localStorage
let todos = storage.getItem('data') ? JSON.parse(storage.getItem('data')) : []

let saveData = (inputData, storage) => {

  if (storage.getItem('data')) {
    let todosArr = JSON.parse(storage.getItem('data'))

    inputData.concat(todosArr)
  }

  storage.setItem('data', JSON.stringify(inputData))
}

let renderTodos = arr => {
  todoList.innerHtml = null
  arr.forEach(e => {
    // create li
    let LI = document.createElement('li')
    LI.setAttribute('class', 'list-group-item d-flex align-items-center')

    // create checkbox
    let INPUT = document.createElement('input')
    INPUT.setAttribute("class", "form-check-input")
    INPUT.setAttribute("type", "checkbox")
    if (e.isDone) INPUT.setAttribute("checked", "true")
    INPUT.dataset.todoid = e.id
    LI.appendChild(INPUT)

    // create span
    let SPAN = document.createElement('SPAN')
    e.isDone ? SPAN.setAttribute("class", "mx-3 w-100 text-decoration-line-through") : SPAN.setAttribute("class", "mx-3 w-100")
    SPAN.textContent = e.todo
    LI.appendChild(SPAN)

    // create edit button
    let EDITBUTTON = document.createElement('BUTTON')
    EDITBUTTON.setAttribute("class", "btn btn-warning text-nowrap me-2")
    EDITBUTTON.dataset.method = e.id
    EDITBUTTON.textContent = 'Edit'
    EDITBUTTON.addEventListener("click", (e) => {
      console.log(todos)
      let editid = e.target.dataset.method
      let findelem = todos.find(item => item.id == editid)
      let newtext = prompt("edit")
      findelem.todo = newtext

      saveData(todos, storage)
      window.location.reload()
    })
    LI.appendChild(EDITBUTTON)

    // create delete button
    let DELETEBUTTON = document.createElement('BUTTON')
    DELETEBUTTON.setAttribute("class", "btn btn-danger text-nowrap")
    DELETEBUTTON.dataset.method = 'delete'
    DELETEBUTTON.dataset.todoid = e.id
    DELETEBUTTON.textContent = 'Delete'
    LI.appendChild(DELETEBUTTON)

    todoList.prepend(LI)
  })
}

form.addEventListener('submit', e => {
  e.preventDefault()

  let todo = todoInput.value.trim()
  let currentId = Date.now()
  let currentTime = String((new Date()).getDate()).padStart(2, '0') + '-' + String((new Date()).getMonth() + 1).padStart(2, '0') + '-' + (new Date()).getFullYear() + ' ' + (new Date()).getHours() + ':' + (new Date()).getMinutes()


  if (todo.length > 3) {
    todos.push({
      id: currentId,
      todo: todo,
      isDone: false,
      time: currentTime
    })

    // save new todos
    saveData(todos, storage)

    // create li
    let LI = document.createElement('li')
    LI.setAttribute('class', 'list-group-item d-flex align-items-center')

    // create checkbox
    let INPUT = document.createElement('input')
    INPUT.setAttribute("class", "form-check-input")
    INPUT.setAttribute("type", "checkbox")
    INPUT.dataset.todoid = currentId
    LI.appendChild(INPUT)

    // create span
    let SPAN = document.createElement('SPAN')
    SPAN.setAttribute("class", "mx-3 w-100")
    SPAN.textContent = todo
    LI.appendChild(SPAN)

    // create edit button
    let EDITBUTTON = document.createElement('BUTTON')
    EDITBUTTON.setAttribute("class", "btn btn-warning text-nowrap me-2")
    EDITBUTTON.dataset.method = 'edit'
    EDITBUTTON.textContent = 'Edit'
    LI.appendChild(EDITBUTTON)

    // create delete button
    let DELETEBUTTON = document.createElement('BUTTON')
    DELETEBUTTON.setAttribute("class", "btn btn-danger text-nowrap")
    DELETEBUTTON.dataset.method = 'delete'
    DELETEBUTTON.textContent = 'Delete'
    LI.appendChild(DELETEBUTTON)

    todoList.prepend(LI)

    todoInput.value = ''
    todoInput.focus()
  }
})

// check va edit va delete || eventDelegation
todoList.addEventListener('click', e => {

  // checkbox uchun
  if (e.target.type == 'checkbox') {
    e.target.nextElementSibling.classList.toggle('text-decoration-line-through')

    let todoId = e.target.dataset.todoid

    let selectedTodoIndex = todos.findIndex(item => item.id == todoId)
    todos[selectedTodoIndex].isDone = !todos[selectedTodoIndex].isDone

    // save edited todos
    saveData(todos, storage)
  }

  // delete uchun
  if (e.target.dataset.method == 'delete') {
    let currentTarget = e.target
    currentTarget.parentElement.remove()
    todos.splice(todos.findIndex(e => e.id = currentTarget.dataset.todoid), 1)
    saveData(todos, storage)
  }
})

// render todos
renderTodos(todos)
