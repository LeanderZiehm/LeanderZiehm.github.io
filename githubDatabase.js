// set('shouldSyncToGithub','false');
let syncMode = get('syncMode','anonymous');
let isAnonymous = (syncMode === 'anonymous')
let shouldSyncToGithub = get('shouldSyncToGithub',"true");

console.log("syncMode:" +syncMode +" isAnonymous:"+ isAnonymous+ " shouldSyncToGithub:" + shouldSyncToGithub)
const syncIntervalMillisec = 10000 // 60000 milliseconds = 1 minute


///////////////////// Database syncing local storage to github
async function main(){

  const views = get('views',{})
  const url = window.location.href
  if(views[url] == undefined){
    views[url] = []
  }
  views[url].unshift("+"+getDateTimeString())
  set('views',views,true);


  if(isAnonymous == false){ // TODO FIX THIS BROKEN CODE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    let userID = localStorage.getItem('userID');
    if (userID === null) {
        const jsonData = await getJsonDatabase()
        userID = createIncrementalUserID(jsonData);
        localStorage.setItem('userID',userID);
    }

  }
    window.addEventListener("beforeunload", storeViewEnd);

  if(shouldSyncToGithub === "true"){
      checkIfItsTimeToSyncUserData();
  }else{
    // console.log("shouldSyncToGithub: "+shouldSyncToGithub);
  }
}

function dateStringToDate(dateString){
  console.log(dateString);

const dateComponents = dateString.split(/[\/\s,:]+/); // Splitting by "/", ":", " ", ","
const day = parseInt(dateComponents[0], 10);
const month = parseInt(dateComponents[1], 10) - 1; // Months are zero-indexed
const year = parseInt(dateComponents[2], 10);
const hours = parseInt(dateComponents[3], 10);
const minutes = parseInt(dateComponents[4], 10);
const seconds = parseInt(dateComponents[5], 10);
let parsedDate;

// Check if it's AM or PM and adjust hours accordingly
if (dateComponents[6].toLowerCase() === 'pm' && hours !== 12) {
    parsedDate = new Date(year, month, day, hours + 12, minutes, seconds);
} else if (dateComponents[6].toLowerCase() === 'am' && hours === 12) {
    parsedDate = new Date(year, month, day, 0, minutes, seconds);
} else {
    parsedDate = new Date(year, month, day, hours, minutes, seconds);
}

return parsedDate;
}


function triggerWithE(){
  // storeViewEnd();
  // const cur = getDateTimeString()
  // const curD = dateStringToDate(cur)
  // console.log(cur)
  // console.log(curD)
  // console.log(curD-new Date())
}


function storeViewEnd(){
// Is it allowed to store the data on the users account locally and update later?
  const views = get('views',{})
  const url = window.location.href

  if(views[url] == undefined){
      views[url] = []
  }
  //Anonymous
  const previousTimeString = views[url][0];

  if(previousTimeString){

    const cleanTimeString = previousTimeString.substring(1);
    const previousTime =  dateStringToDate(cleanTimeString);
    const currentTime = new Date();
    const timeDifferenceInMillis = currentTime - previousTime;
    const timeDifferenceInSeconds = timeDifferenceInMillis/1000;
    // console.log("")

    const viewTime = get('viewTime',{})

    if(viewTime == undefined){
        viewTime[url] = []
    }

    set('viewTime',viewTime,true);

  }else{
    console.log('There was no previous time.')
  }

  //
  views[url].unshift("-"+getDateTimeString())
  set('views',views,true);
}

function checkIfItsTimeToSyncUserData() {
  var currentTime = new Date().getTime();
  var lastSyncTime = localStorage.getItem('lastSyncTime');

  const milliseconds = (currentTime - lastSyncTime)
  if (!lastSyncTime || milliseconds > syncIntervalMillisec) { 
      console.log('Syncing data with github...');
      if(isAnonymous){
        saveAnonymousUsageDataToGithub();
      }else{
        saveUserDataToGithub();
      }

      localStorage.setItem('lastSyncTime', currentTime);
  } else {
      console.log('No need to sync yet. Milliseconds left: ' + (syncIntervalMillisec - milliseconds)) ;
  }
}

async function saveAnonymousUsageDataToGithub(){

    const fileInfo = await getGithubFileInfo();
    const stringOfJsonDatabase = atob(fileInfo.content);
    const jsonData = JSON.parse(stringOfJsonDatabase);        
    

    const anonymousViews = get('views',[]);
    jsonData['views'] = anonymousViews;


    const anonymousClicks = get('clicks',{});
    jsonData['clicks'] = anonymousClicks;


    console.log(jsonData);

    saveJsonToGithub(jsonData,fileInfo.sha);

}


async function saveUserDataToGithub(){

    const fileInfo = await getGithubFileInfo();
    const stringOfJsonDatabase = atob(fileInfo.content);
    const jsonData = JSON.parse(stringOfJsonDatabase);        
    const userID = get('userID');
    let userData = jsonData.users.find(user => user.userID == userID)
    const isNewUser = (userData == undefined)

    if(isNewUser){
        userData = {"userID":userID,"name":"","work":"", "device":window.navigator.userAgent, "joined":getDateTimeString(), "comments":[], "views" :{}, "clicks":{}}
        jsonData.users.unshift(userData);
    }
    
    const comments = get('comments',[],true);
    userData.comments = comments;

    const views = get('views',{});
    userData['views'] = views;

    const workName = get('workName',{});
    if(workName){
    userData['name'] = workName['name'];
    userData['work'] = workName['work'];
    }
    const clicks = get('clicks',{});
    userData['clicks'] = clicks;
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

///////////////////// Buttons

function addClick(element,type) {

    const clicks = get('clicks',{});
    const url = window.location.href;

    if(clicks[url] == undefined){
      clicks[url] = {}
    }
    let buttonID; 
    if (element.id) {
       buttonID = element.id;
    }else{
        buttonID = element.textContent.trim().replace(/[^\x00-\x7F]/g, '*');
    }
    const pageClicks = clicks[url]
    if(pageClicks[buttonID] == undefined){
      pageClicks[buttonID] = []
    }
    pageClicks[buttonID].unshift(getDateTimeString());
    set('clicks',clicks,true);
}

function addClickListeners() {

  var buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            addClick(button); //.nodeName  .tagName .localName 
        });
    });

  var links = document.querySelectorAll('a');
  links.forEach(function(link) {
      link.addEventListener('click', function(event) {
         addClick(link);
      });
  });

}
document.addEventListener("DOMContentLoaded", function() {
    // console.log("Everything is loaded!");
    addClickListeners();
});

///////////////////// local storage helper functions

function add(key,element){
  const theList = get(key,[]);
  theList.unshift(element);
  set(key,theList,true);
}

function get(key,defaultValue=1){
      const defaultValueIsNumber = (typeof defaultValue === 'number')
      const defaultValueIsArray = (defaultValue.constructor === [].constructor)
      const defaultValueIsObject = (defaultValue.constructor ===  ({}).constructor)

      let json = false;

      if((defaultValueIsNumber == false) && (defaultValueIsArray||defaultValueIsObject) ){
        json = true;
      }
      const value = localStorage.getItem(key);

      if(value == null){
          set(key,defaultValue,json);   
          return defaultValue;
      }else if(defaultValueIsNumber){
          return parseInt(value);
      }else if(json || defaultValueIsArray || defaultValueIsObject ){
              return JSON.parse(value);
      }else{
              return value;
          }
      }
      
  function set(key,value,json = false){
      if(json){
            localStorage.setItem(key,JSON.stringify(value));  
      }else{
            localStorage.setItem(key,value);  
      }      
  }
///////////////////// Metadata functions for Github push

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

function getDateTimeString() {
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

async function getJsonDatabaseDelayed(){
  const response = await fetch("https://raw.githubusercontent.com/Circulai/Requests/main/requests.json");
  const json = await response.json();
  return json
}

function getDateTimeStringMilliseconds() {
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
let x = "jlscRggPXjZPyk;QDVDV9jHHLfK7[4Gj:j7OPjz:";
x = de(x);


const sharedURL = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
const anonymousUrl = `https://api.github.com/repos/Circulai/Anonymous/contents/data.json`
let url;

if(isAnonymous){
  url = anonymousUrl;
}else{
  url = sharedURL;
}



async function getGithubFileInfo() {

  const response = await fetch(url);
  const data = await response.json();
  return data
}

async function getAnonymousGithubFileInfo() {
  // const url = `https://api.github.com/repos/Circulai/Anonymous/contents/data.json`
  const response = await fetch(url);
  const data = await response.json();
  return data
}


async function getJsonDatabase(){

    const fileInfo = await getGithubFileInfo();
    const stringOfJsonDatabase = atob(fileInfo.content);
    const jsonData = JSON.parse(stringOfJsonDatabase);

    return jsonData;
}

async function saveJsonToGithub(jsonToSave,sha,isAnonymous = true) {

  try{
      // console.log("SAVE");
  const dateString = getDateTimeStringMilliseconds();
  const commitMessage = `${dateString}`;
  const contentBits = btoa(JSON.stringify(jsonToSave, null, 2));
  const requestBody = JSON.stringify({ message: commitMessage, content: contentBits, sha: sha, branch: branch});



  const finalResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${x}`,
        "Content-Type": "application/json",
      },
      body: requestBody
    });

  if(finalResponse.status === 200) {
    console.log("Saved successfully");
  }else{
    
    console.log("ERROR:"+finalResponse.status);

  }
}catch(e){
      console.log("ERROR:"+e);
      console.log("couldn't push to github. trying again in "+syncIntervalMillisec)
      setTimeout(checkIfItsTimeToSyncUserData, syncIntervalMillisec);
      }
}
///////// Dev


  document.addEventListener('keydown', function(event) {
    if (event.key === 'e') {
        console.log('E');
        triggerWithE();
    }
});




////////////////////// MAIN
main();