const app = {
    selectSourceLanguage: document.querySelector('#source-translate-language'),
    selectTargetLanguage: document.querySelector('#target-translate-language'),
    toggleButton: document.querySelector('#toggle-button'),
    submitButton: document.querySelector('#submit-button'),
    refreshButton: document.querySelector('#refresh-button'),
    popupTitle: document.querySelector('#popup--activate--title'),
    refreshContainer: document.querySelector('#refresh'),
    defaultSourceLanguage: 'en',
    defaultTargetLanguage: 'fr',
    setExtensionEnabled: false,
    extensionEnable: 'Translation is enable',
    extensionDisable: 'Translation is disable',
    init: () => {
        app.getExtensionStatus();
        app.displayStorageLanguage();
        app.submitButton.addEventListener('click', app.handleSubmit);
        app.toggleButton.addEventListener('click', app.handleToggleButtonStatus);
    },
    displayStorageLanguage: () => {
        //Display languages on chrome storage
        chrome.storage.sync.get(['languages'], function({languages}) {
            if (languages) {
                app.selectSourceLanguage.value = languages.source;
                app.selectTargetLanguage.value = languages.target;
            } else {
                app.selectSourceLanguage.value = app.defaultSourceLanguage;
                app.selectTargetLanguage.value = app.defaultTargetLanguage;
            }
        });
    },
    getExtensionStatus: () => {
        chrome.storage.sync.get(['setEnabled'], function({setEnabled}) {
            if (setEnabled !== undefined) {
                app.setExtensionEnabled = setEnabled
                app.toggleButton.checked = setEnabled
            } else {
                app.toggleButton.checked = app.setExtensionEnabled
            }
            app.handleDisplayTitle()
        });
    },
    handleSubmit: (event) => {
        event.preventDefault();
        if (app.selectTargetLanguage.value.length > 0 && app.selectSourceLanguage.value.length > 0) {
            const selectedLanguage = {
                source: app.selectSourceLanguage.value,
                target: app.selectTargetLanguage.value,
            }
            app.saveSelectedValueOnStorage(selectedLanguage);
            app.handleDisplayRefreshButton()
        } else {
            app.handleDisplayError();
        }
    },
    handleDisplayError: () => {
    //TODO display error on form if values are not selected on submit
    // And if both values are identical
    },
    handleClosePopup: () => {
        window.close()
    //TODO close popup on submit
    },
    saveSelectedValueOnStorage: (selectedValues) => {
        // Save selected values
        chrome.storage.sync.set({'languages': selectedValues});
    },
    handleToggleButtonStatus: () => {
        // Save toggle button status
        chrome.storage.sync.set({'setEnabled': !app.setExtensionEnabled});
        app.getExtensionStatus()
        app.handleDisplayRefreshButton()
    },
    handleDisplayTitle: () => {
        app.popupTitle.textContent = app.setExtensionEnabled ? app.extensionEnable : app.extensionDisable
    },
    handleDisplayRefreshButton: () => {
        app.refreshContainer.classList.remove('popup--refresh--disable')
        app.refreshButton.addEventListener('click', app.refreshBrowser);
    },
    refreshBrowser: () => {
        app.handleClosePopup()
        chrome.tabs.reload()
        //TODO refresh browser on submit for validate changes
    },
}

document.addEventListener('DOMContentLoaded', app.init);
