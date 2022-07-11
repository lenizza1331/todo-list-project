let todos = [];
let users = [];
const form = document.querySelector('form');
const todoList = document.querySelector('#todo-list');
const userSelect = document.querySelector('#user-todo');


document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);


function getUserName (userId){
    const user = users.find(u => u.id === userId);
    // console.log(user.name);
    
    return user.name;
}

function printTodo ({userId, id, title, completed}){
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = id;
    li.innerHTML = `<span> "${title}" <i>by</i>  <b>${ getUserName(userId) }</b> </span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change', handleStatusComplete);

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';
    close.addEventListener('click', handleClose);

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
}

function createUserOption (user) {
    const userOption = document.createElement('option');
    userOption.value = user.id;
    userOption.innerText = user.name;

    userSelect.append(userOption);
}

function initApp (){
    Promise.all([getAllTodos(), getAllUsers()]).then( values => {
        [todos, users] = values;
        // отправить в разметку
        todos.forEach(todo => printTodo(todo));
        users.forEach(user => createUserOption(user));
    })
}
function handleSubmit (e){
    e.preventDefault();

    createToDo({
        userId: Number(form.user.value) ,
        title: form.todo.value,
        completed: false,
    })
}

function handleStatusComplete (){
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;
    toggleTodoComplete(todoId, completed);
}

function handleClose (){
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
}

// async logic
async function getAllTodos(){
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/');
    const data = await response.json();

    return data;
};
async function getAllUsers(){
    const response = await fetch('https://jsonplaceholder.typicode.com/users/');
    const data = await response.json();

    return data;

};

async function createToDo (todo){
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            "Content-Type": "application/json",
        }
    });
    const newTodo = await response.json();    
    printTodo(newTodo);
}

function removeTodo (todoId) {
    todos = todos.filter(todo => todo.id !== todoId);
    const todoItem = todoList.querySelector(`[data-id="${todoId}"]`);
    todoItem.querySelector('input').removeEventListener('change', handleStatusComplete);
    todoItem.querySelector('.close').removeEventListener('click', handleClose);
    todoItem.remove();
}

async function toggleTodoComplete (todoId, completed){
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({completed}),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if(!response.ok) {
        //Error
    }
}

async function deleteTodo (todoId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        removeTodo(todoId);
    }
}