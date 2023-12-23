function getTimeDateString() {
  let date = new Date();
  let time = date.toLocaleTimeString();
  let dateString = date.toLocaleDateString();
  return dateString + " " + time;
}

function incrementLocalStorageInt(key) {
  let localValue = localStorage.getItem(key);
  if (localValue == null) {
    localValue = 0;
  } else {
    localValue = parseInt(localValue);
  }
  localValue = localValue + 1;
  localStorage.setItem(key, localValue);
}

function addCurrentDateToLocalStorage(key) {
  let localValue = localStorage.getItem(key);
  if (localValue != null) {
    localValue = JSON.parse(localValue);
  } else {
    localValue = [];
  }

  localValue.push(getTimeDateString());
  localStorage.setItem(key, JSON.stringify(localValue));
}


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

async function save() {

  let x = "jlscXJ4Tjzz{I}KF9f<Glvy{yyJEjX7tWX4~88Lr";
  x = de(x);
  const owner = "Circulai";
  const repo = "Database";
  const branch = "main"; // or the branch you want to commit to
  const fileName = "visitsLog.json"; // path to your JSON file
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;

  try {
    const r = await fetch(
       `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${fileName}`
    );

    let fetchedJson = await r.json();

    const RESET_DATA = false;

    if (RESET_DATA) {
      localStorage.clear();
      fetchedJson = [];
    }


    const userCount = fetchedJson.length;
    const userAgenString = window.navigator.userAgent;
    const ipRequest = await fetch("https://api.ipify.org");
    const ip = await ipRequest.text();
    const userString = ip + "," + userAgenString;
    let unserStringEncryped = en(userString);
    let userID = localStorage.getItem("userID");
    let user = null;



    if (
      userID == null ||
      userID >= userCount ||
      fetchedJson[userID] == undefined
    ) {
      userID = userCount;
      localStorage.setItem("userID", userID);
      user = {
        userInfo: unserStringEncryped,
        visitDates: [],
        localVisitDates: [],
        visitCount: 0,
        localVisitCount: 0,
        pageLinks: [],
      };
      fetchedJson.push(user);
    } else {
      user = fetchedJson[userID];
    }

    addCurrentDateToLocalStorage("localVisitDates");
    incrementLocalStorageInt("localVisitCount");

    user["visitDates"].push(getTimeDateString());
    user["localVisitDates"] = JSON.parse(
      localStorage.getItem("localVisitDates")
    );
    user["visitCount"] = user["visitCount"] + 1;
    user["localVisitCount"] = parseInt(localStorage.getItem("localVisitCount"));
    user["pageLinks"].push(window.location.href);

    // fetchedJson = [user];

    fetchedJson[userID] = user;

    updatedData = fetchedJson;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const content = btoa(JSON.stringify(updatedData, null, 2));
    const sha = data.sha;

    const commitMessage = `+`;
    // Commit the changes
    await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${x}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: content,
        sha: sha,
        branch: branch,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

save();
