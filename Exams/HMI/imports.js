//if is local file clear cache storage and set username to LeanderLocal
const isLocal = window.location.href.includes('file://');
if (isLocal) {
    localStorage.clear();
    localStorage.setItem('userName', 'LeanderLocal');
}




// console.log('main.js loaded');

const scriptsToAdd = [
    'exam.js',
    '../based/app.js',
    '../based/base.js',
    // 'firebase.js'
];


for (const script of scriptsToAdd) {
   const scriptString = `<script src="${script}"></script>`;
    document.write(scriptString);
}



function getUserName() {
    let userNameFromLocalStorage = localStorage.getItem('userName');
    let userName;
    if (userNameFromLocalStorage) {
        userName = userNameFromLocalStorage;
    }else{
        const userNameInput = prompt('Enter your name');
        if(userNameInput){
           userName = userNameInput;
        }else{
            // userName = 'Anonymous_' + getCurrentDateTimeString();
            userName = 'Anonymous' + Math.floor(Math.random() * 1000);
        }
        setUserName(userName);
    }

    return userName;

}

function setUserName(newUserName) {
    localStorage.setItem('userName', newUserName);
}

function getCurrentDateTimeString() {
    let date = new Date();
    let options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };
    return date.toLocaleString('en-GB', options);
}
