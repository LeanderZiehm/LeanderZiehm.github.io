let currentPopup;
function createCustomPopup(message, title, confirmButtonText = "Yes", denyButtonText = "No", confirmCallback = null, denyCallback = null) {
console.log("createCustomPopup");
addStyle(`
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
            <button id="confirmButton">${confirmButtonText}</button>
            <button id="denyButton">${denyButtonText}</button>
        </div>`;
    document.body.appendChild(popup);
    function showPopup() {
        console.log('show popup');
        popup.style.display = 'block';
        overlay.style.display = 'block';
    }
    function hidePopup() {
        console.log('Hide popup');
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }
    document.getElementById('confirmButton').addEventListener('click', function() {
        console.log(confirmButtonText);
        if (typeof confirmCallback === 'function') {
            confirmCallback();
        }
        hidePopup();
    });
    document.getElementById('denyButton').addEventListener('click', function() {
        console.log(confirmButtonText);
        if (typeof denyCallback === 'function') {
            denyCallback();
        }
        hidePopup();
    });
    showPopup();
}
function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}