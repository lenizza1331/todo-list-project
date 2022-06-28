let todos = [];
let users = [];

document.addEventListener('DOMContentLoaded', initApp);

function initApp (){
    Promise.all([getAllTodos(), getAllUsers()]).then( values => {
        [todos, users] = values;
        // отправить в разметку
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
