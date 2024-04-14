function createCustomPopup(title, message , yesFunction = null, noFunction = null,  yesText = "Yes", noText = "No", yesButtonColor="rgb(55, 130, 55)",noButtonColor="rgb(92, 91, 102)") {

    injectCSS(`
 .popup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fefefe;
        border: 1px solid #888;
        width: 300px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        border-radius: 10px;
    }

    /* Overlay */
    .overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
    }

    /* Buttons */
    .popup-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .popup-buttons button {
        padding: 10px 20px;
        cursor: pointer;
    }
`);

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <h2 id="popup-title">${title}</h2>
        <p id="popup-message">${message}</p>
        <div class="popup-buttons">
            <button id="yesButton">${yesText}</button>
            <button id="noButton">${noText}</button>
        </div>`;
    document.body.appendChild(popup);



    document.getElementById('yesButton').style.backgroundColor = yesButtonColor;

    document.getElementById('noButton').style.backgroundColor = noButtonColor;

    function showPopup() {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Hide popup
    function hidePopup() {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }


    // Event listener for 'Yes' button
    document.getElementById('yesButton').addEventListener('click', function() {
        if (typeof yesFunction === 'function') {
            yesFunction();
        }
        hidePopup();
    });

    // Event listener for 'No' button
    document.getElementById('noButton').addEventListener('click', function() {
        if (typeof noFunction === 'function') {
            noFunction();
        }
        hidePopup();
    });


    showPopup();
}



function injectCSS(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}


