let todos = [];
let users = [];
const todoList = document.querySelector('#todo-list');

document.addEventListener('DOMContentLoaded', initApp);

function getUserName (userId){
    const user = users.find(u => u.id === userId);
    return user.name;
}

function printTodo ({userId, id, title, completed}){
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = id;
    li.innerHTML = `<span> "${title}" <i>by</i>  <b>${getUserName (userId)}</b> </span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
}

function initApp (){
    Promise.all([getAllTodos(), getAllUsers()]).then( values => {
        [todos, users] = values;
        // отправить в разметку
        todos.forEach(todo => printTodo(todo));
    })
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
