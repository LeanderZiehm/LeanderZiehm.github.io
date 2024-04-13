///////////////////// Database related code

syncIntervalMillisec = 60000 // 60000 milliseconds = 1 minute

// localStorage.clear();



// async function main(){
function main(){
  checkIfItsTimeToSyncUserData();
}

// async function checkIfItsTimeToSyncUserData() {
function checkIfItsTimeToSyncUserData() {
  var currentTime = new Date().getTime();
  var lastSyncTime = localStorage.getItem('lastSyncTime');


  const milliseconds = (currentTime - lastSyncTime)
  if (!lastSyncTime || milliseconds > syncIntervalMillisec) { 
      console.log('Syncing data with github...');
      mainSave();
      localStorage.setItem('lastSyncTime', currentTime);
  } else {
      console.log('No need to sync yet. Milliseconds left: ' + (syncIntervalMillisec - milliseconds)) ;
  }
}



async function mainSave(){

    const fileInfo = await getGithubFileInfo();
    const stringOfJsonDatabase = atob(fileInfo.content);
    const jsonData = JSON.parse(stringOfJsonDatabase);
    console.log(stringOfJsonDatabase);
    
    
    let userID = localStorage.getItem('userID');

    if (userID === null) {
        userID = createIncrementalUserID(jsonData);
        localStorage.setItem('userID',userID);
    }

    const userData = jsonData.users.find(user => user.userID == userID)
    const isNewUser = (userData == undefined)

    if(isNewUser){
        const newUserData = {"userID":userID, "device":window.navigator.userAgent, "startDate":getTimeDateString(), "comments":[], "actionHistory" :[]}
        jsonData.users.unshift(newUserData);

    }else{
        // console.log(userData);
        // // const comments = localStorage.getItem('comments');
        // const comment = {text:"I AM A GOD!", upvotes:1, created:getTimeDateString()};
        // userData.comments.unshift(comment);


        // const actionHistoryElement = {
        //     "action": "view",
        //     "url": window.location.href,
        //     "date": getTimeDateString()
        // }

        // userData.actionHistory.unshift(actionHistoryElement);
    }

    console.log(JSON.stringify(jsonData));

    saveJsonToGithub(jsonData,fileInfo.sha);
}

function createIncrementalUserID(jsonData) {

    let maxUserID = 0;
    jsonData.users.forEach(user => {

        let userID = parseInt(user.userID)
        if (userID > maxUserID) {
            maxUserID = userID;
        }
    });
    return maxUserID + 1;
}



///////////////////// Github Related helper functions

const shift = 3;

function en(x) {
  let y = "";
  for (let i = 0; i < x.length; i++) {
    let charCode = x.charCodeAt(i) + shift + (i % 2);
    y += String.fromCharCode(charCode);
  }
  return y;
}

function de(x) {
  let y = "";
  for (let i = 0; i < x.length; i++) {
    let charCode = x.charCodeAt(i) - shift - (i % 2);
    y += String.fromCharCode(charCode);
  }
  return y;
}


function getTimeDateString() {
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

// function getTimeDateString() {
//   let date = new Date();
//   let time = date.toLocaleTimeString();
//   let dateString = date.toLocaleDateString();
//   return dateString + " " + time;
// }

async function getJsonDatabaseDelayed(){
  const response = await fetch("https://raw.githubusercontent.com/Circulai/Requests/main/requests.json");
  const json = await response.json();
  return json
}

function getTimeDateStringMilliseconds() {
  let date = new Date();
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');
  let milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  let time = hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
  let dateString = date.toLocaleDateString();
  return dateString + ' ' + time;
}


///////////////////// GITHUB STUFF

const owner = "Circulai";
const repo = "Requests";
const branch = "main"; // or the branch you want to commit to
const fileName = "requests.json"; // path to your JSON file
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
let x = "jlscRggPXjZPyk;QDVDV9jHHLfK7[4Gj:j7OPjz:";
x = de(x);

async function getGithubFileInfo() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data
}

async function saveJsonToGithub(jsonToSave,sha) {
  // console.log("SAVE");
  const dateString = getTimeDateStringMilliseconds();
  const commitMessage = `${dateString}`;
  const contentBits = btoa(JSON.stringify(jsonToSave, null, 2));
  const requestBody = JSON.stringify({ message: commitMessage, content: contentBits, sha: sha, branch: branch});
  const finalResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${x}`,
        "Content-Type": "application/json",
      },
      body: requestBody
    });
  console.log(finalResponse);

  if(finalResponse.status === 200) {
    console.log("Saved successfully");
  }else{
    console.log("ERROR:"+finalResponse.status);
  }
}



////////////////////// MAIN


main();
