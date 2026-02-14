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

loadFromStorage();

function loadFromStorage(){
    console.log(localStorage[STORAGE_KEY]);
    
    if (localStorage[STORAGE_KEY] == undefined){
        window.db.departments.push('Engineering', 'HR')
        window.db.accounts.push({
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

const accountsForm = document.getElementById('accounts-form');

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
                            currentPage = accountsPage; break;
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
    
    if(window.db.employees.length == 0){
        const element = `
            <tr>
              <td>No employees found</td>  
            </tr>
        `;

        tbody.innerHTML = element;

    }
    for(employee in window.db.employees){
        
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
    window.db.accounts.push(data);
    saveToStorage();
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
        }

    
}

window.addEventListener("hashchange", handleRouting);