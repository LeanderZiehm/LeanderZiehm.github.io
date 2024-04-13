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
  let time = date.toLocaleTimeString();
  let dateString = date.toLocaleDateString();
  return dateString + " " + time;
}

function getTimeDateStringWithSeconds() {
  let date = new Date();
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');
  let milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  let time = hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
  let dateString = date.toLocaleDateString();
  return dateString + ' ' + time;
}


async function save(toSave) {

  console.log("SAVE");
  let x = "jlscRggPXjZPyk;QDVDV9jHHLfK7[4Gj:j7OPjz:";
  x = de(x);

  const owner = "Circulai";
  const repo = "Requests";
  const branch = "main"; // or the branch you want to commit to
  const fileName = "requests.json"; // path to your JSON file
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;


  const response = await fetch(apiUrl);
  const data = await response.json();
  const sha = data.sha;
  console.log(data);

  const dateString = getTimeDateStringWithSeconds();
  const commitMessage = `${dateString}`;
  let newJson = `{"hello":"${dateString}"}`
  const contentBits = btoa(JSON.stringify(newJson, null, 2));

  const requestBody = JSON.stringify({ message: commitMessage, content: contentBits, sha: sha, branch: branch});

  const finalRespone = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${x}`,
        "Content-Type": "application/json",
      },
      body: requestBody
    });

  console.log(finalRespone);

}

console.log("hi")
save();