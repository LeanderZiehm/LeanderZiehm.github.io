// console.log('firebase.js loaded');

function firebaseGetRef(refName){
    refName = removeIllegalChars(refName);
    let ref = db.ref(refName);
    return ref;
}



let changedByDatabase = false;
// localStorage.clear();
function main() {
    init();
    const video = document.getElementById('video');
    const videoSource = video.src;
    let videoFileName = videoSource.split('/').pop();
    //remove %20 from videoFileName with _
    videoFileName = videoFileName.replace(/%20/g, '_');
    const legalFileName = removeIllegalChars(videoFileName);
    console.log('[start] videoFileName:', legalFileName);
    const videoStateRef = db.ref('videoState/' + legalFileName);


    videoStateRef.on('value', (snapshot) => {
        changedByDatabase = true;
        const videoState = snapshot.val();
        console.log('on value videoStateFromFirebase:', videoState,'changedByDatabase:',changedByDatabase);


        if (videoState === null) {
            videoStateRef.set({ paused: true, time: 0 });
        } else if (videoState) {
            video.currentTime = videoState.time;
            if (videoState.paused && !video.paused) {
                video.pause();
            } else if (!videoState.paused && video.paused) {
                video.play();
            }
        }
    });

    // videoPlayer.addEventListener('seeked', () => updateVideoState('seeked'));
    // videoPlayer.addEventListener('play', () => updateVideoState('play'));
    // videoPlayer.addEventListener('pause', () => updateVideoState('pause'));

    function updateVideoState(eventName){
        const isPaused = video.paused;
        const currentTime = video.currentTime;

        if (changedByDatabase) {
            console.log(`#Database ${eventName}:   isPaused: ${isPaused},    ${currentTime}`);
            changedByDatabase = false;
        } else {
            console.log(`##User [${eventName}]:   isPaused: ${isPaused},  ${currentTime}`);
            const newState = {
                paused: isPaused,
                time: currentTime
            };
            videoStateRef.set(newState);
        }
    
    };

}

function removeIllegalChars(fileName) {
    return fileName.replace(/[\.\#\$\[\]]/g, '_');
}

function init(){
    addLiveRightNow();
}

function addLiveRightNow() {
    const liveRightNowRef = db.ref('liveRightNow');
    const liveRightNow = liveRightNowRef.push();
    const url = window.location.href;
    const currentDateTimeString = getCurrentDateTimeString();
    const browser = navigator.userAgent;

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