// console.log('firebase.js loaded');

let userID;

const url = window.location.href;
const currentDateTimeString = getCurrentDateTimeString();
const browser = navigator.userAgent;

// localStorage.clear();

function main() {
    init();



    //on press e add example answer
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e') {
            addAnswer('A3', 'Paris');
        }
    });

}

function init(){
    addUserIfNotExists();
    addLiveRightNow();
}

function addAnswer(questionID, answer) {
    console.log('addAnswer', questionID, answer);
    const answerDatabase = db.ref('answers');
    const answerRef = answerDatabase.push();
    const nowString = getCurrentDateTimeString();
    answerRef.set({ questionID: questionID, userID: userID, answer: answer, dateTime: nowString }); 
}

function addLiveRightNow() {
    const liveRightNowRef = db.ref('liveRightNow');
    const liveRightNow = liveRightNowRef.push();
    liveRightNow.set({ url: url, startedAt: currentDateTimeString, browser: browser });
    liveRightNow.onDisconnect().remove();
}

function addUserIfNotExists() {
    userID = localStorage.getItem('userID');
    if (!userID) {
        userID = prompt('Enter your name');
        localStorage.setItem('userID', userID);
        const joinedTime = getCurrentDateTimeString();
        const url = window.location.href;
        const user = db.ref('users/' + userID);
        //check if user already exists
        user.once('value', (snapshot) => {
            const userValue = snapshot.val();
            if (!userValue) {
                user.set({ joinedTime: joinedTime, joinedUrl: url });
            }else{
                // if user already exists, update joinedTime and joinedUrl
                // user.update({ joinedTime: joinedTime, joinedUrl: url });
                // /show allert that user already exists
                console.log('User already exists');
                alert('User already exists, please enter a different name');
                addUserIfNotExists();
            }
        });
        
        // user.set({joinedTime: joinedTime, joinedUrl: url });
        
    }
    console.log('userID', userID);
}


// function getUserID(username, date) {
//     let hash = 0;
//     for (let i = 0; i < date.length; i++) {
//         hash = (hash << 5) - hash + date.charCodeAt(i);
//         hash = hash & hash; // Convert to 32bit integer
//     }
//     return hash;



function loadDatabase() {


    // const shouldTrackText = get('shouldTrack', "true");
    // let shouldTrack = (shouldTrackText === "true");

    // const url = window.location.href;

    // const isLocalFile = url.startsWith('file://');


    // const currentDateTimeString = getCurrentDateTimeString();


    // // if(shouldTrack && !isLocalFile){

    // //   const ref = db.ref('views');
    // //   const visitRef = ref.push();
    // //   visitRef.set({
    // //     url: url,
    // //     dateTime: currentDateTimeString,
    // //   });
    // // }else{
    // // }

    // const browser = navigator.userAgent;



    // const lastVisit = localStorage.getItem('lastVisit');

    // const uniqueUsersRef = db.ref('uniqueUsers');
    // const uniqueUserRef = uniqueUsersRef.push();
    // const uniqueUsersEachDayRef = db.ref('uniqueUsersEachDay');
    // const uniqueUsersEachDay = uniqueUsersEachDayRef.push(lastVisit);


    // const isNewUser = (lastVisit == null);



    // if (isNewUser) {
    //   uniqueUserRef.set({
    //     url:url,
    //     dateTime: currentDateTimeString,
    //     browser: browser,
    //   });
    // }else{
    //   const todayDate = currentDateTimeString.split(' ')[0];
    //   const lastVisitDate = lastVisit.split(' ')[0];
    //   const firstVisitToday = (todayDate !== lastVisitDate);


    //   if (firstVisitToday){
    //     uniqueUserRef.set({
    //       url: url,
    //       dateTime: currentDateTimeString,
    //       browser: browser,
    //     });

    //   }else{
    //   }
    // }


    // if (lastVisit) {
    //   // uniqueUsersEachDay.set
    //   uniqueUsersEachDay.set({
    //     url:url,
    //     dateTime: lastVisit,
    //     browser: browser,
    //   });

    // } 

    // const datesRef = db.ref('dates');
    // // datesRef.set([currentDateTimeString])

    // // get dates list from db
    // datesRef.once('value', (snapshot) => {
    //   const dates = snapshot.val();

    //   const dateDay = currentDateTimeString.split(' ')[0];
    //   // add current date if not exists
    //   if (!dates.includes(dateDay)){

    //   }
    // });


    //add if not exists already
    // dateRef.set(currentDateTimeString);




    
    // usersDatabase.once('value', (snapshot) => {
    //     let usersValues = snapshot.val() || {};
    //     const userCount = Object.keys(usersValues).length;
    //     let userID = getuserID();
    //     if (!userID) {
    //         userID = `(${userCount})${getCurrentDateTimeString()}`;
    //         // userID = "hi"
    //         userID = userID.replace(/[/]/g, '-');    //replace / with with -
    //         userID = userID.replace(/ /g, '');    //remove all spaces
    //         setuserID(userID);
    //     }
    //     user = usersValues[userID]
    //     if (!user) {
    //         localStorage.setItem('userID', userID);
    //         user = {
    //             userAgent: navigator.userAgent,
    //             joinedTime: getCurrentDateTimeString(),
    //             joinedUrl: window.location.href
    //         };
    //         usersValues[userID] = user;
    //     }
    //     views = user.views;
    //     if (!views) {
    //         views = {};
    //         user.views = views;
    //     }
    //     let dateTimeKey = getCurrentDateTimeString();
    //     dateTimeKey = dateTimeKey.replace(/[/]/g, '-');    //replace / with with -
    //     dateTimeKey = dateTimeKey.replace(/ /g, '');
    //     views[dateTimeKey] = window.location.href;
    //     usersDatabase.set(usersValues);
    // });
    
}

// function getuserID() {
//     const userID = localStorage.getItem('userID');
//     return userID;
// }
// function setuserID(userID) {
//     localStorage.setItem('userID', userID);
// }


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



///////////////////////////////////////

function en(x) {
    let y = "";
    for (let i = 0; i < x.length; i++) {
        let charCode = x.charCodeAt(i) + 3 + (i % 2);
        y += String.fromCharCode(charCode);
    }
    return y;
}






document.addEventListener('DOMContentLoaded', main);