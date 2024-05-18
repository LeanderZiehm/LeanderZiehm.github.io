// TODO: fix multible pushes!


//TODO FIGURE OUT KEY
// Is it allowed to store the data on the users account locally and update later?

const usePrivateRepo = true;
const shouldSyncToGithubText = get('shouldSyncToGithub',"true");
let shouldSyncToGithub = (shouldSyncToGithubText === "true");
const syncIntervalMillisec = 10000 // 60000 milliseconds = 1 minute
///////////////////// Database syncing local storage to github


let toPush;
async function main(){


  // return;

  toPush = get('toPush',{});
      checkIfIsNewUser();
      setupLocalSaves();



  if(shouldSyncToGithub){
      checkIfItsTimeToSyncUserData();
  }else{
    console.log('.');
  }
}

///////////////////// LOCAL: Views and Buttons



let startedViewTime;

function setupLocalSaves(){
  startedViewTime = new Date();
  document.addEventListener("DOMContentLoaded", addClickListeners);
  window.addEventListener("beforeunload", beforeUnloadPage);
 
}

function checkIfIsNewUser(){
  const needToIncrementNewUserCount = get('needToIncrementNewUserCount','true');
    if(needToIncrementNewUserCount === 'true'){
      set('needToIncrementNewUserCount','false');
      toPush['uniqueUser'] = true;
      toPush['browser'] = window.navigator.userAgent;
      toPush['newUserView'] = window.location.href+'  '+getDateTimeString()+'  '+window.navigator.userAgent;
    }
}

function onSuccessfullPush(){
  console.log("Synced successfully.");
  set('needToIncrementNewUserCount','false');
  toPush = {}
  set('toPush',{});
  set('pushedVotes',get('votes',{}));
}


function beforeUnloadPage(){
  storeViewEndLocal();
  set('toPush',toPush);
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
  const view = getDateTimeString()+", "+diffSec+"s";
  toPush['views'][url].unshift(view)



}

function saveShortcutToPush(shortcut){


   if(toPush['shortcuts'] == null || toPush['shortcuts'] == undefined){
      toPush['shortcuts'] = {}

    }
      const url = window.location.href
    if(toPush['shortcuts'][url] == null){
      toPush['shortcuts'][url] = {}
  }
    
    if(toPush['shortcuts'][url][shortcut] == undefined){
      toPush['shortcuts'][url][shortcut] = []
    }
    toPush['shortcuts'][url][shortcut].unshift(getDateTimeString());
    


}



function saveClickLocal(element,type) {


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

function triggerWithE(){

  databaseJson = {
  "votes": {
    "2": {
      "+": 1,
      "-": 0
    },
    "3": {
      "+": 0,
      "-": 1
    },
    "4": {
      "+": 1,
      "-": 0
    }
  }
}

  // pushedVotes = get('pushedVotes',{}); 
  pushedVotes = 
  {
  "2": "+",
  "3": "-",
  "4": "+",
}



  votes = get('votes',{});
  votes = {
  "2": "+",
  "3": "+",
  "4": "+",
}



  
}

function addDataToDatabaseJson(databaseJson){

    if(toPush['uniqueUser']){
        if(databaseJson['uniqueUsers'] == null){
        databaseJson['uniqueUsers'] = 0;
        }
        databaseJson['uniqueUsers'] += 1; 
    }

    if(toPush['newUserView']){

      if(databaseJson['newUserView'] == null){
        databaseJson['newUserView'] = []
      }

       databaseJson['newUserView'].unshift(toPush['newUserView']);
    }



    if(toPush['browser']){

      if(databaseJson['browsers'] == null){
        databaseJson['browsers'] = []
      }

       databaseJson['browsers'].unshift(toPush['browser']);
    }




  


 



    if(databaseJson['views'] == null){
          databaseJson['views'] = {}
      }

    if(databaseJson['clicks'] == null){
          databaseJson['clicks'] = {}
    }

    if(databaseJson['shortcuts'] == null){
          databaseJson['shortcuts'] = {}
    }


    merge(databaseJson['views'],toPush['views'])
    merge(databaseJson['clicks'],toPush['clicks'])
    merge(databaseJson['shortcuts'],toPush['shortcuts'])

    /////////////////////////////////////////////

  pushedVotes = get('pushedVotes',{}); 
  votes = get('votes',{});


   if(databaseJson['votes'] == null){
        databaseJson['votes'] = {}
      }

      


   if(databaseJson['votes'] == null){
        databaseJson['votes'] = {}
      }


    for (let exercieseNumber in votes) {

      let vote = votes[exercieseNumber]

      const isFirstVoterInThisExerciese = (databaseJson['votes'].hasOwnProperty(exercieseNumber) == false)

      if(isFirstVoterInThisExerciese){
        databaseJson['votes'][exercieseNumber] = {"+":0,"-":0};
        databaseJson['votes'][exercieseNumber][vote] += 1;
      }else{


        if (pushedVotes.hasOwnProperty(exercieseNumber)){

                let prevVote = pushedVotes[exercieseNumber];


                if(vote !== prevVote){
                  databaseJson['votes'][exercieseNumber][prevVote] -= 1; 
                  databaseJson['votes'][exercieseNumber][vote] += 1; 
                }

        }else{

          databaseJson['votes'][exercieseNumber][vote] += 1; 

        } 

      }
    }

  set('databaseJsonVotes',databaseJson['votes']); // RENAME THIS TO GLOBAL VOTES!!!!!!

  return databaseJson
}







// get2('databaseJsonVotes',[exerciseNumber],{'+':0,'-':0});
function get2(getName,keys,defaultValue){



  const isList = (typeof keys.constructor === Array)
  if(isList == false){
    keys = [keys]
  }

  const json = get(getName,{});


  let currentLayer = json;

  for(index in keys){

    key = keys[index];


    if(currentLayer.hasOwnProperty(key)){

      currentLayer = currentLayer[key]

    }else{
      return defaultValue;
    }
  }

  return currentLayer

}



function merge(jsonMain,jsonToAdd) {
    for (let key in jsonToAdd) {
        if (jsonToAdd.hasOwnProperty(key)) {
            if (!jsonMain.hasOwnProperty(key)) {
                // If the key doesn't exist in jsonMain, add it with the same type as in jsonToAdd
                jsonMain[key] = jsonToAdd[key];
            } else {
                // If the key exists in jsonMain, but the types don't match, don't merge
                if (typeof jsonMain[key] !== typeof jsonToAdd[key]) {
                    // console.error(`Type mismatch for key "${key}". Skipping merge.`);
                    continue;
                }
                // If the types match, merge recursively for nested objects or arrays
                if (typeof jsonMain[key] === 'object') {
                    if (Array.isArray(jsonMain[key]) && Array.isArray(jsonToAdd[key])) {
                        jsonMain[key] = jsonMain[key].concat(jsonToAdd[key]);
                    } else {
                        merge(jsonToAdd[key], jsonMain[key]);
                    }
                } else {
                    // For non-object types, overwrite with the value from jsonToAdd
                    jsonMain[key] = jsonToAdd[key];
                }
            }
        }
    }
    return jsonMain;
}





///////////////////// Global 

function checkIfItsTimeToSyncUserData() {
  var currentTime = new Date().getTime();
  var lastSyncTime = localStorage.getItem('lastSyncTime');
  const milliseconds = (currentTime - lastSyncTime)
  if (!lastSyncTime || milliseconds > syncIntervalMillisec) { 
      saveDataToGithub();
  
      localStorage.setItem('lastSyncTime', currentTime);
  } else {
    console.log('syncLeft:',milliseconds);
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

async function saveJsonToGithub(jsonToSave,sha) {
  try{

    // jsonToSave = {}
    // sha = '3'
    
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

    onSuccessfullPush();
    
  }else{
  }
}catch(e){
      console.log("couldn't push to github. trying again in "+syncIntervalMillisec)
      setTimeout(checkIfItsTimeToSyncUserData, syncIntervalMillisec);
      }
}




//////////////////////////////////// Dev

//   document.addEventListener('keydown', function(event) {
//     if (event.key === 'e') {
//         triggerWithE();
//     }
// });



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


function jsonString(json){
  return JSON.stringify(json, null, 2);
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