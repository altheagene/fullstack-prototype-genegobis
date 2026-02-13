window.location.hash = '#/'

//COMPONENTS
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

let currentUser = null;
let currentPage = homePage;
window.db = {};
window.db.accounts = [];
window.db.departments = [];
window.db.employees = [];
window.db.requests = []

function navigateTo(hash){
    window.location.hash = hash
}

function handleRouting(){
    const hash = window.location.hash;
    currentPage.classList.toggle('active')
    switch (hash){
        case '#/login': currentPage = loginPage; break;
        case '#/register' : currentPage = registerPage; break;
        case '#/verify-email' : currentPage = verifyEmailPage; break;
        case '#/profile-page' : currentPage = profilePage; break;
    }

    currentPage.classList.toggle('active')
}

window.addEventListener("hashchange", handleRouting);