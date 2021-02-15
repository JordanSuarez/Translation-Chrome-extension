const selectSourceLanguage = document.querySelector('#source-translate-language');
const selectTargetLanguage = document.querySelector('#target-translate-language');

//Pre-filled field with data on chrome storage
function displaySelectLanguage() {
    chrome.storage.sync.get(['language'], function({language}) {
        selectSourceLanguage.value = language.source;
        selectTargetLanguage.value = language.target;
    });
}

//Executed when opening popup
displaySelectLanguage()

function handleSelectLanguage(event) {
    event.preventDefault();
    if (selectTargetLanguage.value.length > 0 && selectSourceLanguage.value.length > 0) {
        const selectedLanguage = {
            source: selectSourceLanguage.value,
            target: selectTargetLanguage.value,
        }
        setExtensionStorage(selectedLanguage)
    } else {
        handleDisplayError()
    }
}

function handleDisplayError() {
    //TODO display error on form if values are not selected on submit
    // And if both values are identical
}

function closePopup() {
    //TODO close popup on submit
}

function refreshBrowser() {
    //TODO refresh browser on submit for validate changes
}

document.querySelector('#submit-button').addEventListener('click', handleSelectLanguage)
