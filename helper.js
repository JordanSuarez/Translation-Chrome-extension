//  Save data to storage across user browsers
function setExtensionStorage(selectedValues) {
    chrome.storage.sync.set({'language': selectedValues});
}
