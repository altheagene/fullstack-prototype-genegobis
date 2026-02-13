window.location.hash = '#/'

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

//OTHER ELEMENTS
document.getElementById('registration-form')
    .addEventListener('submit', function(e){
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        handleRegistration(data);
});

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
    currentPage.classList.toggle('active');
    console.log('HIE HOW ARE YA')
    switch (hash){
        case '#/login': currentPage = loginPage; break;
        case '#/register' : currentPage = registerPage; break;
        case '#/verify-email' : currentPage = verifyEmailPage; break;
        case '#/profile-page' : currentPage = profilePage; break;
    }

    currentPage.classList.toggle('active')
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

    //check validity of email
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const match = emailRegEx.test(email);

    data.verified = false;
    console.log(data);
    window.db.accounts.push(data);
    navigateTo('#/verify-email');

}

window.addEventListener("hashchange", handleRouting);