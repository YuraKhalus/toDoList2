const API_URL = "/api/tasks";

let currentEditId = null;
let currentFilter = 'all';
let currentSort = '';

const taskForm = document.querySelector('#taskForm');
const taskTitle = document.querySelector('#taskTitle');
const taskDescription = document.querySelector('#taskDescription');
const taskPriority = document.querySelector('#taskPriority');
const taskDate = document.querySelector('#taskDate');
const submitBtnTask = document.querySelector('#submitBtnTask');
const cancelEditBtn = document.querySelector('#cancelEdit')
const taskList = document.querySelector('#taskList');
const emptyState = document.querySelector('#emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.querySelector('#sortBy');

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
})


function setupEventListeners(){
    taskForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const taskData = {
        title: taskTitle.value,
        description: taskDescription.value.trim(),
        priority: taskPriority.value,
        data: taskDate.value 
    };

    if(currentEditId){
        // await updateTask(currentEditId, taskData);
    } else{
        await createTask(taskData)
    }
    
}

async function createTask(taskData) {
    try{
        console.log(taskData);
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        const result = await response.json();


    } catch(err){
        console.error('Помилка стоврення', err);
    }
}

