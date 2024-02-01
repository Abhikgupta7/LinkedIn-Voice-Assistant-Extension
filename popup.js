const toggleButton = document.getElementById('btn');
const heading = document.getElementById('heading');

chrome.storage.local.get('toggleState', function (data) {
    if (data.toggleState === undefined) {
        toggleButton.checked = false;
    } else {
        toggleButton.checked = data.toggleState;
    }
});


toggleButton.addEventListener("change", function () {
    chrome.storage.local.set({ 'toggleState': toggleButton.checked });
    if (toggleButton.checked) heading.innerHTML = "Voice Assistant is Listening...."
    else if (!toggleButton.checked) heading.innerHTML = `Turn "ON" Voice Assistant`
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        chrome.tabs.sendMessage(tabs[0].id, { message: toggleButton.checked });
    });
});
