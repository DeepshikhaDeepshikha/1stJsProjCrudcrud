const amount = document.getElementById('amount');
const description = document.getElementById('description');
const table = document.getElementById('table');
const table1 = document.getElementById('table1');
const table2 = document.getElementById('table2');
const table3 = document.getElementById('table3');
const endpointId = '7ddf714d9ea142c8a19780850be1a6d4';
const serverLink = `https://crudcrud.com/api/494f100aed464d02ba654a262b78d4da/expense`;
let id = null;

addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.option');
    for(let i=0; i<options.length; i++) {
        options[i].addEventListener('click', (e) => {
            table.textContent = options[i].textContent;
        });
    }

    const getData = async () => {
        try{
            const res = await axios.get(serverLink);
            const expenses = res.data;
            for(let i=0; i<expenses.length; i++){
                addOnScreen(expenses[i]);
            }
        }catch(err){
            console.log(err);
        }
    };
    getData();
});

document.getElementById('form').addEventListener('submit', addExpense);

function addExpense(e){
    e.preventDefault();
    let expense = {
        amount: amount.value,
        description: description.value,
        table: table.textContent
    }
    if(isInputsMissing(expense)){
        return;
    }    
    
    const postData = async () => {
        try{
            let res = await axios.post(serverLink, expense);
            expense = res.data;
            console.log(res);
            addOnScreen(expense);
        }catch(err){
            console.log(err);
        }
    }
    postData();

    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    table.textContent = 'Tables';
}

function addOnScreen(expense){
    switch(expense.table){
        case 'Table 1': table1.appendChild(createLi(expense)); break;
        case 'Table 2': table2.appendChild(createLi(expense)); break;
        case 'Table 3': table3.appendChild(createLi(expense)); break;
    }
}

function createLi(expense) {
    const li = document.createElement('li');
    li.textContent = `${expense.amount}-${expense.table}-${expense.description}`;  
    li.id = expense._id;
    li.appendChild(createDeleteButton());
    return li;
}

function createDeleteButton(){
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Expense';
    deleteButton.className = 'del btn btn-danger';
    deleteButton.addEventListener('click', deleteLi);
    return deleteButton;
}

function deleteLi(e) {
    const deleteData = async () => {
        try{
            const res = await axios.delete(`${serverLink}/${e.path[1].id}`);
            console.log(res);
        }catch(err){
            console.log(err);
        }
    };
    deleteData();
    e.path[1].remove();
}

function editLi(e) {
    const contents = e.path[1].textContent.slice(0, -26).split('-');
    amount.value = contents[0];
    description.value = contents[2];
    table.textContent = contents[1];
    id = e.path[1].id;
    e.path[1].remove();
}

function isInputsMissing(expense){
    let missingInputs = document.getElementById('missing-inputs');
    missingInputs.textContent = '';
    if(expense.amount === ''){
        missingInputs.textContent += 'Amount is missing.';
    }
    if(expense.description === ''){
        missingInputs.textContent += ' Description is missing.';
    }
    if(expense.table === 'Tables'){
        missingInputs.textContent += ' Choose a table.';
    }
    if(missingInputs.textContent == ''){
        return false;
    }
    return true;
}