// console.log('firebase.js loaded');

function firebaseGetRef(branchName,refName){
    refName = removeIllegalChars(refName);
    let ref = db.ref(branchName + "/" + refName);
    return ref;
}

function main() {
    init();
}

function removeIllegalChars(fileName) {
    // fileName = fileName.replace()
    fileName = fileName.replace(/%20/g, ''); 
    //remove spaces
    fileName = fileName.replace(/ /g, '');
    return fileName.replace(/[\.\#\$\[\]\\/]/g, '_');
}

function init(){
    addLiveRightNow();
}

function addLiveRightNow() {

    // const liveRightNow = liveRightNowRef.push();
    const url = window.location.href;
    const currentDateTimeString = getCurrentDateTimeString();
    const browser = navigator.userAgent;

    const myUserID = currentDateTimeString + browser;
    const legalUserID = removeIllegalChars(myUserID);
    const liveRightNow = db.ref("liveRightNow/"+legalUserID); //db.ref('');
    liveRightNow.set({ url: url, startedAt: currentDateTimeString, browser: browser });
    liveRightNow.onDisconnect().remove();
}


function myDateToString(date) {
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
function getCurrentDateTimeString() {
    return myDateToString(new Date());
}

///////////////////////////////////////
function en(x) {
    let y = "";
    for (let i = 0; i < x.length; i++) {
        let charCode = x.charCodeAt(i) + 3 + (i % 2);
        y += String.fromCharCode(charCode);
    }
    return y;
}
function de(x) {
    let y = "";
    for (let i = 0; i < x.length; i++) {
        let charCode = x.charCodeAt(i) - 3 - (i % 2);
        y += String.fromCharCode(charCode);
    }
    return y;
}
let xf = `DM}eV}Dk|iWos}TOzOfVnvVZUtQEqjNcJZ[zFo\\`
xf = de(xf);
const firebaseConfig = {
    apiKey: xf,
    authDomain: "dreams-b6d83.firebaseapp.com",
    databaseURL: "https://dreams-b6d83-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dreams-b6d83",
    storageBucket: "dreams-b6d83.appspot.com",
    messagingSenderId: "663324058727",
    appId: "1:663324058727:web:c00eab23b58f9628e9a0c2",
    measurementId: "G-DW1EF1FQP8"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
document.addEventListener('DOMContentLoaded',main);