let storageCache = {
    languages: {
        source: 'en',
        target: 'fr',
    }
};

//Get languages in chrome storage from user input
chrome.storage.sync.get(['languages'], function(response) {
    if (Object.keys(response).length > 0) {
        storageCache = response
    }
    document.addEventListener("mouseup", getUserSelection)
});

// Get status from toggle button on popup
chrome.storage.sync.get(['setEnabled'], function({setEnabled}) {
    storageCache = {...storageCache, setEnabled}
});

function getUserSelection() {
    if(window.getSelection && storageCache.setEnabled === true) {
        const userSelection = window.getSelection().toString().trim();
        if (userSelection.length > 2 && userSelection.length < 50) {
            return callApiForTranslate(userSelection);
        }
    }
}

function callApiForTranslate(valueSelected) {
    fetch(apiUrl(valueSelected, storageCache.languages), {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": config.apiKey,
            "x-rapidapi-host": "translated-mymemory---translation-memory.p.rapidapi.com"
        }
    })
    .then(response => response.json())
    .then(({responseData}) => {
        const {translatedText} = responseData
        insertHtmlFromSelection(window.getSelection(), translatedText)
    })
}

function insertHtmlFromSelection(selectionObject, translation) {
    const childNodes = selectionObject.getRangeAt(0).startContainer.childNodes
    const childArray = Array.from(childNodes)
    // Enable trad if selection is not inside input element
    if (!childArray.find(element => element.matches('input'))) {
        let range;
        let expandedSelRange;
        let node;
        if (selectionObject.getRangeAt && selectionObject.rangeCount) {
        range = window.getSelection().getRangeAt(0);
        expandedSelRange = range.cloneRange();
        range.collapse(false);

        // insert html content
        const el = document.createElement("div");
        el.innerHTML = `<span class="translate">[${storageCache.languages.target.toUpperCase()}: ${translation} ]</span>`;
        let frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        selectionObject.empty();
        }
    }
}

function apiUrl(valueSelected, languages) {
    return `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=${languages.source}%7C${languages.target}&q=${valueSelected}&mt=1&onlyprivate=0&de=a%40b.c`
}
