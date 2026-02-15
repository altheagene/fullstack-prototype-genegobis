window.location.hash = '#/'
const STORAGE_KEY = 'ipt_demo_v1'
window.db = {
    accounts:[],
    departments: [],
    employees: [],
    requests: []
}
let currentUser = null;
const body = document.querySelector('body');
let editing = false;
let editingEmail;

let items = [];

const accountsForm = document.getElementById('accounts-form');
const employeesForm = document.getElementById('employees-form');

loadFromStorage();

function loadFromStorage(){
    console.log(localStorage[STORAGE_KEY]);
    
    if (localStorage[STORAGE_KEY] == undefined){
        window.db.departments.push(
            {
                id: 1,
                name: 'Engineering',
                description: 'Department of Engineering'
            }, 
            {
                id: 2,
                name: 'HR',
                description: 'Department of Human Resources'
            })
        window.db.accounts.push({
            id: 1,
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'Password123!',
            verified: true,
            role: 'admin'
        })
        saveToStorage();
    }else{
        const data = JSON.parse(localStorage[STORAGE_KEY])
        console.log('HELLO')
        window.db.accounts = data.accounts;
        window.db.departments = data.departments;
        window.db.employees = data.employees;
        window.db.requests = data.requests;
    }

    if(localStorage.auth_token !=undefined){
        currentUser = window.db.accounts.find(account => account.email == localStorage.auth_token);
        body.classList.remove('not-authenticated')
        body.classList.add('authenticated')
        console.log(currentUser)

        if(currentUser.role == 'admin'){
            body.classList.add('is-admin')
        }
        navigateTo('#/profile')
    }

    
    //render departments
    for(let department of window.db.departments){
        const element = `
            <option value=${department.name}>${department.name}</option>
        `

        employeesForm.elements['department'].innerHTML += element;
    }
    console.log(localStorage[STORAGE_KEY])
}

function saveToStorage(){
    localStorage[STORAGE_KEY]  = JSON.stringify(window.db)
}


//SECTION COMPONENTS
const homePage = document.getElementById('home-page');
const registerPage = document.getElementById('register-page')
const verifyEmailPage = document.getElementById('verify-email-page');
const loginPage = document.getElementById('login-page');
const profilePage = document.getElementById('profile-page');
const employeesPage = document.getElementById('employees-page');
const departmentsPage = document.getElementById('departments-page')
const accountsPage = document.getElementById('accounts-page');
const requestsPage = document.getElementById('requests-page');
console.log('hi')

let currentPage = homePage;
//OTHER ELEMENTS




document.getElementById('registration-form')
    .addEventListener('submit', function(e){
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        handleRegistration(data);
});

document.getElementById('login-form').addEventListener('submit', function(e){
    e.preventDefault()
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    handleLogin(data);
})


function navigateTo(hash){
    window.location.hash = hash
}

function handleRouting(){
    const hash = window.location.hash;
    currentPage.classList.remove('active');
    console.log('HIE HOW ARE YA')

    switch (hash){
        case '#/home': currentPage = homePage;break;
        case '#/login': currentPage = loginPage; break;
        case '#/register' : currentPage = registerPage; break;
        case '#/verify-email' : currentPage = verifyEmailPage; 
                                document.getElementById('unverified-email').innerText = localStorage.getItem('unverified_email')
                                break;
        case '#/profile' : 
                        currentPage = profilePage; 
                        renderProfile();
                        break;
        case '#/requests' : currentPage = requestsPage; break;
        case '#/employees' : 
                            if(currentUser.role != 'admin')
                                return;
                            currentPage = employeesPage; 
                            renderEmployees();
                            break;
        case '#/accounts' : 
                            if(currentUser.role != 'admin')
                                return;
                            currentPage = accountsPage; 
                            renderAccounts();
                            break;
        case '#/departments' : 
                            if(currentUser.role != 'admin')
                                return;
                            currentPage = departmentsPage; break;
    }

    currentPage.classList.add('active')
}

function handleRegistration(data){
    const password = data.password;
    const email = data.email;

    //check password length
    if(password.length < 6){
        //show error message the password must be 6 characters long
        document.getElementById('pass-error-msg').classList.remove('hide-msg');
        return;
    }else{
         document.getElementById('pass-error-msg').classList.add('hide-msg');
    }

    //check validity and uniqueness of email
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const match = emailRegEx.test(email);

    if(!match)
        return;

    data.verified = false;
    data.role = 'user'
    const length = window.db.accounts.length;

    //userid will be length of current accounts array plus one
    data.id = length + 1;

    localStorage.setItem('unverified_email', email);
    console.log(window.db.accounts)
    window.db.accounts.push(data);
    console.log(window.db.accounts)
    saveToStorage()
    navigateTo('#/verify-email');
}

function handleVerification(){
    const unverifiedEmail = localStorage.getItem('unverified_email');
    console.log(window.db.accounts)
    let index = window.db.accounts.findIndex((account) => account.email == unverifiedEmail)
    window.db.accounts[index].verified = true
    saveToStorage();
    navigateTo('#/login')
}

function handleLogin(data){
    console.log(data)
    console.log(window.db.accounts)
    const user = window.db.accounts.find(account => account.email == data.email 
                                                        && account.password == data.password
                                                        && account.verified)
    console.log(user)
    if(user){
        localStorage.auth_token = user.email;
        setAuthState(true, user)
        document.getElementById('login-invalid').classList.add('hide-msg')
    }else{
        document.getElementById('login-invalid').classList.remove('hide-msg');
    }
    
}

function handleLogout(){
    localStorage.removeItem("auth_token")
    setAuthState(false)
    navigateTo('#/home');
}

function renderProfile(){
    console.log('HELLO!')
    document.getElementById('first-name').innerText = currentUser.firstName;
    document.getElementById('last-name').innerText = currentUser.lastName
    document.getElementById('profile-email').innerText = currentUser.email;
    document.getElementById('profile-role').innerText = currentUser.role;
}

function renderEmployees(){
    const tbody = document.getElementById('employees-tbody');
    tbody.innerHTML =''
    if(window.db.employees.length == 0){
        const element = `
            <tr>
              <td>No employees found</td>  
            </tr>
        `;

        tbody.innerHTML = element;

    }
    for(let employee of window.db.employees){
        const element = `
            <tr>
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.position}</td?>
            <tr>
        `

        tbody.innerHTML += element
    }
}

function saveAccount(){
    console.log(accountsForm)
    const formData = new FormData(accountsForm)
    const data = Object.fromEntries(formData);
    const verifiedField = document.getElementById('verified-field');
    console.log(data)
    for (let key of Object.keys(data)){
        if(data[key] === ''){
            console.log('WOW')
            document.getElementById('form-message-div').classList.remove('hide-msg')
            return;
        }
    }

    if(verifiedField.checked){
        data.verified = true
        console.log(data)
       
    }else{
        data.verified = false;
        console.log(data)
    }
    
    document.getElementById('form-message-div').classList.add('hide-msg');

    if(editing){
        const emailExists = window.db.accounts.some(account => account.email == editingEmail)

        if(emailExists && data.email != editingEmail){
            const element = document.getElementById('form-message-div')
            element.innerText =  'Email already exists!';
            element.classList.remove('hide-msg')
            return;
        }
        const index = window.db.accounts.findIndex(account => account.email == editingEmail);
        window.db.accounts[index].firstName = data.firstName;
        window.db.accounts[index].lastName = data.lastName;
        window.db.accounts[index].email = data.email;
        window.db.accounts[index].password = data.password;
        window.db.accounts[index].role = data.role;
        window.db.accounts[index].verified = data.verified;
        saveToStorage()
    }else{
        window.db.accounts.push(data);
    }
    document.getElementById('accounts-cancel-btn').click();
    saveToStorage();
    renderAccounts();
    resetAccountModal();
}

function renderAccounts(){
    const tbody = document.getElementById('accounts-tbody');
    tbody.innerHTML = ''
    console.log(window.db.accounts)
    for (let account of window.db.accounts){
        console.log(account)
        const element = `
            <tr>
                <td>${account.firstName} ${account.lastName}</td>
                <td>${account.email}</td>
                <td>${account.role == 'admin' ? 'Admin' : 'User'}</td>
                <td>${account.verified ? '✅' : ' ❌'}</td>
                <td>
                    <button onclick="editAccount('${account.email}')">Edit</button>
                    <button onclick="resetPassword('${account.email}')">Reset Password</button>
                    <button onclick="deleteAccount('${account.email}')">Delete</button>
                </td>
            <tr>
        `

        tbody.innerHTML += element;
    }
}

function renderRequests(){
    
    for (let request in window.db.requests){
        const element = `
            <tr>

            <tr>
        `
    }
}

function setAuthState(isAuth, user){
    currentUser = user;
    if(isAuth){
        body.classList.remove('not-authenticated');
        body.classList.add('authenticated')
        navigateTo('#/profile')
    }else{
        body.classList.remove('authenticated');
        body.classList.add('not-authenticated');
        return;
    }
    
    if(user.role == 'admin'){
        body.classList.add('is-admin');
        document.getElementById('role').innerText = 'Admin'
    }else{
        document.getElementById('role').innerText = 'User'
        body.classList.remove('is-admin');
    }  
}

function editAccount(email){
    editing = true;
    editingEmail = email;
    console.log(editingEmail)
    const user = window.db.accounts.find(account => account.email == email);
    accountsForm.elements['firstName'].value = user.firstName;
    accountsForm.elements['lastName'].value = user.lastName;
    accountsForm.elements['email'].value = user.email;
    accountsForm.elements['password'].value = user.password;
    accountsForm.elements['role'].value = user.role;
    accountsForm.elements['verified-field'].checked = user.verified;
    document.getElementById('accounts-modal-btn').click();
}

function resetPassword(email){
    const newPassword = prompt("Enter this account's new password. Password length must be minimum of six characters")

    if(password.length < 6){
        resetPassword(email);
    }else{
        const index = window.db.accounts.findIndex(account => account.email == email)
        window.db.accounts[index].password = newPassword;
        saveToStorage();
    }
}

function deleteAccount(email){
    if (email === currentUser.email){
        alert('You cannot delete your own account!')
        return;
    }else{
        
        if(confirm(`Are you sure you want to delete this acccount?`)){
            const accounts = window.db.accounts.filter(account => account.email != email);
            window.db.accounts = accounts;
            saveToStorage();
            renderAccounts();
        }
    }
}

function addDepartment(){
    alert('Not implemented.')
}

function resetAccountModal(){
    accountsForm.elements['firstName'].value = '';
    accountsForm.elements['lastName'].value = '';
    accountsForm.elements['email'].value = '';
    accountsForm.elements['password'].value = '';
    accountsForm.elements['role'].value = '';
    accountsForm.elements['verified-field'].checked = false;
}

function saveEmployee(){
    const formData = new FormData(employeesForm);
    const data = Object.fromEntries(formData);
     const element = document.getElementById('employee-form-msg-div')
    console.log(data)
    for(let key of Object.keys(data)){
        if(data[key].trim() === ''){
           
            element.innerHTML = 'Please fill out all fields!';
            element.classList.remove('hide-msg')
            return;
        }
    }
    const employeeExists = window.db.employees.find(employee => employee.email == data.email)
    if(employeeExists){
        element.innerHTML = 'This email is already associated with an existing employee!';
        element.classList.remove('hide-msg');
        return;
    }
    const index = window.db.accounts.findIndex(account => account.email == data.email);

    if(index == -1){
        element.innerHTML = 'This email does not have an account!';
        element.classList.remove('hide-msg')
        return;
    }else{
        data.name = window.db.accounts[index].firstName + ' ' + window.db.accounts[index].lastName;
        
    }

    element.classList.add('hide-msg');
    window.db.employees.push(data);
    saveToStorage();
    document.getElementById('employee-cancel-btn').click();
    renderEmployees();
}

function addNewItem(){
    const itemRequestsDiv = document.getElementById('item-requests-div');
    const id = items.length;
    const element = `
            <div class="item-div" id="${id}">
                <input type="text" name="itemName">
                <input type="number" name="itemQty">
                <button type="button" onclick="deleteItem(${id})">x</button>
            </div>
    `

    itemRequestsDiv.innerHTML += element;
    items.push({})
    
}

function renderItems(){
    const itemRequestsDiv = document.getElementById('item-requests-div');
    itemRequestsDiv.innerHTML = '';
    for (let i = 0; i < items.length; i++){
        let element;
        if(i == 0){
            element = `
                <div class="item-div">
                    <input type="text" name="itemName">
                    <input type="number" name="itemQty">
                    <button type="button" onclick="addNewItem()">+</button>
                </div>
            `
        }else{
            element = `
                <div class="item-div">
                    <input type="text" name="itemName">
                    <input type="number" name="itemQty">
                    <button type="button" onclick="deleteItem(${i})">x</button>
                </div>
            `
        }

         itemRequestsDiv.innerHTML += element
    }
}

function deleteItem(id){
    //remove item element at place of id. if id is 2, remove element at index 2-1 = 1
    items.splice(id, 1)
    renderItems();
}

function saveItems(){
    const itemDivs = document.querySelector('.item-divs');
}

function openRequestModal(){
    items = [
        {
            itemName: '',
            itemQty: 1,
        }
    ]

    renderItems()
}


window.addEventListener("hashchange", handleRouting);