// set('shouldSyncToGithub','false');
let shouldSyncToGithub = get('shouldSyncToGithub',"true");
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
  let userID = localStorage.getItem('userID');
    if (userID === null) {
        const jsonData = await getJsonDatabase()
        userID = createIncrementalUserID(jsonData);
        localStorage.setItem('userID',userID);
    }

    window.addEventListener("beforeunload", storeViewEnd);

  if(shouldSyncToGithub === "true"){
      checkIfItsTimeToSyncUserData();
  }else{
    console.log("shouldSyncToGithub: "+shouldSyncToGithub);
  }
}

function storeViewEnd(){

  const views = get('views',{})
  const url = window.location.href

  if(views[url] == undefined){
    views[url] = []
  }
  views[url].unshift("-"+getDateTimeString())
  set('views',views,true);
}

function checkIfItsTimeToSyncUserData() {
  var currentTime = new Date().getTime();
  var lastSyncTime = localStorage.getItem('lastSyncTime');

  const milliseconds = (currentTime - lastSyncTime)
  if (!lastSyncTime || milliseconds > syncIntervalMillisec) { 
      console.log('Syncing data with github...');
      saveToGithub();
      localStorage.setItem('lastSyncTime', currentTime);
  } else {
      console.log('No need to sync yet. Milliseconds left: ' + (syncIntervalMillisec - milliseconds)) ;
  }
}

async function saveToGithub(){

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
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
let x = "jlscRggPXjZPyk;QDVDV9jHHLfK7[4Gj:j7OPjz:";
x = de(x);

async function getGithubFileInfo() {
  const response = await fetch(apiUrl);
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
  const dateString = getDateTimeStringMilliseconds();
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
////////////////////// MAIN
main();