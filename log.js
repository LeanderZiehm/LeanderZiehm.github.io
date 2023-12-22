// debug(window.location);
// debug(window.location.href);

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
  console.log(localValue);
  localValue.push(getTimeDateString());
  localStorage.setItem(key, JSON.stringify(localValue));
  debug(key + localValue);
}

function debug(text) {
  // console.log(text);
  // document.getElementById("debug").innerHTML += "<p>" + text + "</p>";
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
  // localStorage.clear();
  let x = "jlscXJ4Tjzz{I}KF9f<Glvy{yyJEjX7tWX4~88Lr";
  x = de(x);
  const owner = "Circulai";
  const repo = "Circulai.github.io";
  const branch = "main"; // or the branch you want to commit to
  const path = "visitsLog.json"; // path to your JSON file
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const r = await fetch(
      `https://raw.githubusercontent.com/Circulai/Circulai.github.io/main/${path}`
    );
    //https://raw.githubusercontent.com/Circulai/Circulai.github.io/main/visitsLog.json
    let fetchedJson = await r.json();

    const RESET_DATA = false;

    if (RESET_DATA) {
      localStorage.clear();
      fetchedJson = [];
    }

    console.log(fetchedJson);

    // debug("Fetched JSON: " + JSON.stringify(fetchedJson));
    const userCount = fetchedJson.length;
    // debug("list length: " + userCount);

    const userAgenString = window.navigator.userAgent;
    const ipRequest = await fetch("https://api.ipify.org");
    const ip = await ipRequest.text();
    const userString = ip + "," + userAgenString;
    let unserStringEncryped = en(userString);

    debug("userString: " + userString);
    debug("unserStringEncryped: " + unserStringEncryped);
    debug("decripted: " + de(unserStringEncryped));
    // unserStringEncryped = "x";

    let userID = localStorage.getItem("userID");
    let user = null;

    debug("userID: " + userID);
    debug("userCount: " + userCount);
    // debug("fetchedJson[userID]" + fetchedJson[userID]);

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

    debug("updatedData: " + JSON.stringify(updatedData));

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
    console.log("Done!");
  } catch (error) {
    console.error("Error:", error);
  }
}

// async function commitFile() {
//   return; // function disabled for now

//   const owner = "Circulai";
//   const repo = "Circulai.github.io";
//   const branch = "main"; // or the branch you want to commit to
//   const path = "data.json"; // path to your JSON file
//   const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

//   try {
//     const r = await fetch(
//       "https://raw.githubusercontent.com/Circulai/Circulai.github.io/main/data.json"
//     );
//     // console.log(r.status);

//     const rJson = await r.json();
//     console.log(rJson);

//     document.getElementById("loadedData").innerHTML = JSON.stringify(rJson);

//     views = rJson["views"];
//     views = parseInt(views);
//     user = rJson["user"];
//     IP = rJson["user"]["IP-Address"];
//     lastVisited = rJson["user"]["lastVisited"];
//     visitCount = rJson["user"]["visitCount"];
//     console.log(views);
//     views = views + 1;
//     rJson["views"] = views; //views + 1000;
//     console.log(rJson["views"]);

//     // return;

//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     updatedData = rJson;
//     const content = btoa(JSON.stringify(updatedData, null, 2));
//     const sha = data.sha;

//     const commitMessage = `${views} views`;
//     // Commit the changes
//     await fetch(apiUrl, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${x}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: commitMessage,
//         content: content,
//         sha: sha,
//         branch: branch,
//       }),
//     });
//     console.log("Done!");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

save();
