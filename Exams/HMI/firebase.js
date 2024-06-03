function de(x) {
    let y = "";
    for (let i = 0; i < x.length; i++) {
        let charCode = x.charCodeAt(i) - 3 - (i % 2);
        y += String.fromCharCode(charCode);
    }
    return y;
}

let xf = "DM}eV}Gt]1{wZ\nrte:sD6N;5[b~05yghVxOZjP"
xf = de(xf);



const firebaseConfig = {
    apiKey: xf,
    authDomain: "exams-14f95.firebaseapp.com",
    projectId: "exams-14f95",
    storageBucket: "exams-14f95.appspot.com",
    messagingSenderId: "761737202591",
    appId: "1:761737202591:web:a3701795dc698e9e250baa",
    measurementId: "G-JX10YJR8NG",
    databaseURL: "https://exams-14f95-default-rtdb.europe-west1.firebasedatabase.app",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();








//



function track() {
    // Add live right now

    const url = window.location.href;
    const currentDateTimeString = getCurrentDateTimeString();
    const browser = navigator.userAgent;

    const liveRightNowRef = db.ref('liveRightNow');
    const liveRightNow = liveRightNowRef.push();
    liveRightNow.set({ url: url, startedAt: currentDateTimeString, browser: browser });
    liveRightNow.onDisconnect().remove();

    //


    const usersDatabase = db.ref('users');
    usersDatabase.once('value', (snapshot) => {
        let usersValues = snapshot.val() || {};

        const userCount = Object.keys(usersValues).length;
        let userID = localStorage.getItem('userID');
        if (!userID) {
            userID = `(${userCount})${getCurrentDateTimeString()}`;
            // userID = "hi"
            userID = userID.replace(/[/]/g, '-');    //replace / with with -
            userID = userID.replace(/ /g, '');    //remove all spaces
            localStorage.setItem('userID', userID);
        }
        user = usersValues[userID]

        if (!user) {
            localStorage.setItem('userID', userID);
            user = {
                userAgent: navigator.userAgent,
                joinedTime: getCurrentDateTimeString(),
                joinedUrl: window.location.href
            };
            usersValues[userID] = user;
        }

        views = user.views;
        if (!views) {
            views = {};
            user.views = views;
        }


        let dateTimeKey = getCurrentDateTimeString();
        dateTimeKey = dateTimeKey.replace(/[/]/g, '-');    //replace / with with -
        dateTimeKey = dateTimeKey.replace(/ /g, '');
        views[dateTimeKey] = window.location.href;
        usersDatabase.set(usersValues);

    });

}

track();

console.log('track');