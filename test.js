// I will use Anonymous for now because it's a private repo https://github.com/Circulai/Anonymous/blob/main/data.json
//TODO FIGURE OUT KEY
// Encrypt and rename this file
// Is it allowed to store the data on the users account locally and update later?


const usePrivateRepo = true;
const shouldSyncToGithubText = get('shouldSyncToGithub',"trueec");
let shouldSyncToGithub = (shouldSyncToGithubText === "true");
const syncIntervalMillisec = 10000 // 60000 milliseconds = 1 minute
///////////////////// Database syncing local storage to github


let toPush;
async function main(){

  toPush = get('toPush',{});
      checkIfIsNewUser();
      setupLocalSaves();
  if(shouldSyncToGithub){
      checkIfItsTimeToSyncUserData();
  }
}

///////////////////// LOCAL: Views and Buttons



const startedViewTime = new Date();
console.log(startedViewTime);

function setupLocalSaves(){
  document.addEventListener("DOMContentLoaded", addClickListeners);
  window.addEventListener("beforeunload", storeViewEndLocal);
 
}

function checkIfIsNewUser(){
    if(get('needToIncrementNewUserCount','true') === 'true'){
      set('needToIncrementNewUserCount','false');
      toPush['uniqueUser'] = true;
      toPush['browser'] = true;
    }
}


function storeViewEndLocal(){
  if(toPush['views'] == null){
    toPush['views'] = {}
  }
  const url = window.location.href
    if(toPush['views'][url] == null){
      toPush['views'][url] = []
  }
  const diffMillisec =  new Date() - startedViewTime;
  const diffSec = diffMillisec/1000;
  console.log(diffSec);
  const view = getDateTimeString()+", "+diffSec+"s";
  console.log(view);// "15/04/2024, 11:59:07 pm, 25s"
  toPush['views'][url].unshift(view)

}


function saveClickLocal(element,type) {

  console.log(element,type);

   if(toPush['clicks'] == null){
      toPush['clicks'] = {}
    }
      const url = window.location.href
    if(toPush['clicks'][url] == null){
      toPush['clicks'][url] = {}
  }
    
    let id; 
    if (element.id) {
       id = element.id;
    }else{
        id = element.textContent.trim().replace(/[^\x00-\x7F]/g, '*');
    }
    
    if(toPush['clicks'][url][id] == undefined){
      toPush['clicks'][url][id] = []
    }
    toPush['clicks'][url][id].unshift(getDateTimeString());

}
function addClickListeners() {
    var listenTo = ['button', 'a','input', 'select'];
    listenTo.forEach(function(tagName) {
        var elements = document.querySelectorAll(tagName);
        elements.forEach(function(element) {
            element.addEventListener('click', function(event) {
                saveClickLocal(element);
            });
        });
    });
}

///////////////////// GLOBAL Data

gg = {}
function triggerWithE(){


  // let pushedVotes = { 0: "+", 1: "-", 2: "+", 4: "-", 5: "-", 6: "+", 7: "+", 8: "+", 11: "+"};
  // let votes = { 0: "-", 1: "-", 2: "+", 4: "-", 5: "-", 6: "+", 7: "+", 8: "+", 11: "+", 13: "-"};

  // let databaseJson2 = {}


  //   for (let key in votes) {

  //   if (pushedVotes.hasOwnProperty(key)){

  //     if(votes[key] !== pushedVotes[key]){
  //       console.log(key,"changed");
  //     }
  //   }else{
  //     console.log(key,"NEW");
  //   }
}

function addDataToDatabaseJson(databaseJson){
    


    if(toPush['uniqueUser']){
       databaseJson['uniqueUsers'] = (databaseJson['userCount'] || 0) + 1;
    }

    if(toPush['browser']){

      if(databaseJson['browsers'] == null){
        databaseJson['browsers'] = []
      }

       databaseJson['browsers'].unshift(window.navigator.userAgent);
    }


   if(databaseJson['clicks'] == null){
          databaseJson['clicks'] = {}
        }

       if(databaseJson['views'] == null){
          databaseJson['views'] = {}
        }

        /// BRUH  !!!!!!!!!!!!!!!!! TODO MERGE JSON WITH FOR LOOPS

    //     if(databaseJson['views'] == null){
    //       databaseJson['views'] = []
    //     }

    // databaseJson['clicks']


  pushedVotes = get('pushedVotes',{}); 
  votes = get('votes',{});


   if(databaseJson['votes'] == null){
        databaseJson['votes'] = {}
      }

    
    for (let exercieseNumber in votes) {
      let vote = votes[exercieseNumber]

      if(databaseJson['votes'].hasOwnProperty(exercieseNumber) == false){
        databaseJson['votes'][exercieseNumber] = {}
        databaseJson['votes'][exercieseNumber][vote] = 1
      }else if (pushedVotes.hasOwnProperty(exercieseNumber)){

      let prevVote = pushedVotes[exercieseNumber];
      if(vote !== prevVote){
        // console.log(exercieseNumber,"changed");
        databaseJson['votes'][exercieseNumber][prevVote] -= 1; 
        databaseJson['votes'][exercieseNumber][vote] += 1; 
      }
    }else{
      // console.log(exercieseNumber,"NEW");
      databaseJson['votes'][exercieseNumber][vote] += 1; 
    }
    }
    
  console.log(databaseJson)
  return databaseJson
}



///////////////////// Global 

function checkIfItsTimeToSyncUserData() {
  var currentTime = new Date().getTime();
  var lastSyncTime = localStorage.getItem('lastSyncTime');
  const milliseconds = (currentTime - lastSyncTime)
  if (!lastSyncTime || milliseconds > syncIntervalMillisec) { 
      console.log('Syncing data with github...');
      saveDataToGithub();
  
      localStorage.setItem('lastSyncTime', currentTime);
  } else {
      console.log('No need to sync yet. Milliseconds left: ' + (syncIntervalMillisec - milliseconds)) ;
  }
}


async function saveDataToGithub(){
    const fileInfo = await getGithubFileInfo();
    const stringOfJsonDatabase = atob(fileInfo.content);
    let databaseJson = JSON.parse(stringOfJsonDatabase); 

    databaseJson = addDataToDatabaseJson(databaseJson);

    saveJsonToGithub(databaseJson,fileInfo.sha);
}

///////////////////// Global Deep
const owner = "Circulai";
const repo = "Requests";
const branch = "main"; // or the branch you want to commit to
const fileName = "requests.json"; // path to your JSON file
let x = "jlscRggPXjZPyk;QDVDV9jHHLfK7[4Gj:j7OPjz:";
x = de(x);
const publicURL = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
const privateURL = `https://api.github.com/repos/Circulai/Anonymous/contents/data.json`
let urlRepo;
if(usePrivateRepo){
  urlRepo = privateURL;
}else{
  urlRepo = publicURL;
}
async function getGithubFileInfo() {
  let response;
  if(usePrivateRepo){ 
      response = await fetch(urlRepo, {
        headers: {
          Authorization: `token ${x}`
        }
      });
  }else{
    response = await fetch(urlRepo);
  }

  const data = await response.json();
  return data
}
async function getJsonDatabase(){
    const fileInfo = await getGithubFileInfo();
    const stringOfJsonDatabase = atob(fileInfo.content);
    const jsonData = JSON.parse(stringOfJsonDatabase);
    return jsonData;
}
async function saveJsonToGithub(jsonToSave,sha) {
  try{
      // console.log("SAVE");
  const dateString = getDateTimeString();
  const commitMessage = `${dateString}`;
  const contentBits = btoa(JSON.stringify(jsonToSave, null, 2));
  const requestBody = JSON.stringify({ message: commitMessage, content: contentBits, sha: sha, branch: branch});
  const finalResponse = await fetch(urlRepo, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${x}`,
        "Content-Type": "application/json",
      },
      body: requestBody
    });
  if(finalResponse.status === 200) {
    console.log("Saved successfully");

    set('toPush',{});
    set('pushedVotes',get('votes',{}));
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



///////////////////// Date


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

function parseDateString(dateString){
  // console.log(dateString);
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
              // console.log(value)
              return JSON.parse(value);
      }else{
              return value;
          }
      }
  function set(key,value,json = false){
      const isArray = (value.constructor === [].constructor)
      const isObject = (value.constructor ===  ({}).constructor)

      if(json||isArray||isObject){
            localStorage.setItem(key,JSON.stringify(value));  
      }else{
            localStorage.setItem(key,value);  
      }      
  }


///////////////////// X
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
////////////////////// MAIN
main();