const app = {
    selectSourceLanguage: document.querySelector('#source-translate-language'),
    selectTargetLanguage: document.querySelector('#target-translate-language'),
    toggleButton: document.querySelector('#toggle-button'),
    submitButton: document.querySelector('#submit-button'),
    refreshButton: document.querySelector('#refresh-button'),
    popupTitle: document.querySelector('#popup__toggle__title'),
    refreshContainer: document.querySelector('#refresh'),
    defaultSourceLanguage: 'en',
    defaultTargetLanguage: 'fr',
    setExtensionEnabled: false,
    extensionEnable: 'Translation is enable',
    extensionDisable: 'Translation is disable',
    languagesList: languages,
    init: () => {
        app.getExtensionStatus();
        app.displayStorageLanguage();
        app.displaySelectOptions(app.selectSourceLanguage);
        app.displaySelectOptions(app.selectTargetLanguage);
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
    displaySelectOptions: (element) => {
        app.languagesList.map(({code, name}) => {
            const option = document.createElement('option')
            option.value = code;
            option.textContent = name;
            element.appendChild(option);
        })
    },
    getExtensionStatus: () => {
        chrome.storage.sync.get(['setEnabled'], function({setEnabled}) {
            if (setEnabled !== undefined) {
                app.setExtensionEnabled = setEnabled;
                app.toggleButton.checked = setEnabled;
            } else {
                app.toggleButton.checked = app.setExtensionEnabled;
            }
            app.handleDisplayTitle();
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
            app.handleDisplayRefreshButton();
        }
    },
    handleClosePopup: () => {
        window.close();
    },
    saveSelectedValueOnStorage: (selectedValues) => {
        // Save selected values
        chrome.storage.sync.set({'languages': selectedValues});
    },
    handleToggleButtonStatus: () => {
        // Save toggle button status
        chrome.storage.sync.set({'setEnabled': !app.setExtensionEnabled});
        app.getExtensionStatus();
        app.handleDisplayRefreshButton();
    },
    handleDisplayTitle: () => {
        app.popupTitle.textContent = app.setExtensionEnabled ? app.extensionEnable : app.extensionDisable;
    },
    handleDisplayRefreshButton: () => {
        app.refreshContainer.classList.remove('popup__refresh--disable');
        app.refreshButton.addEventListener('click', app.refreshBrowser);
    },
    refreshBrowser: () => {
        app.handleClosePopup();
        chrome.tabs.reload();
    },
}

document.addEventListener('DOMContentLoaded', app.init);
