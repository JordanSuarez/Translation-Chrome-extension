const minLengthOfSelectedValue = 2
const maxLengthOfSelectedValue = 200

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
        if (userSelection.length > minLengthOfSelectedValue
            && userSelection.length < maxLengthOfSelectedValue) {
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
        insertHtmlFromSelection(window.getSelection(), translatedText, valueSelected)
    })
}

function insertHtmlFromSelection(selectionObject, translation, valueSelected) {
    const childNodes = selectionObject.getRangeAt(0).startContainer.childNodes
    const childArray = Array.from(childNodes)

    // Enable translation if selection is not inside input element
    if (!childArray.find(element => element.matches('input'))) {
        if (selectionObject.getRangeAt && selectionObject.rangeCount) {
            const range = window.getSelection().getRangeAt(0);
            range.collapse(false);

            // Insert html content from selection
            const frag = range.createContextualFragment(
                `<span class="translate">[${storageCache.languages.target.toUpperCase()}: ${translation} ]</span>`);
            range.insertNode(frag);

            // Next step consists to reselect the previously selected value, because focus is lost after node insertion
            const offset = selectionObject.anchorOffset
            const selectionOffset =  offset - valueSelected.length
            const parentNode = selectionObject.anchorNode.parentElement
            const childNodes = selectionObject.anchorNode.parentNode.childNodes
            const node = findCurrentNodeIndex(childNodes, selectionObject)
            const textNode = parentNode.childNodes[node]

            range.setStart(textNode, selectionOffset);
            range.setEnd(textNode, offset);
        }
    }
}

function findCurrentNodeIndex(childNodes, element) {
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].textContent === element.anchorNode.nodeValue) {
            return i
        }
    }
}

function apiUrl(valueSelected, languages) {
    return `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=${languages.source}%7C${languages.target}&q=${valueSelected}&mt=1&onlyprivate=0&de=a%40b.c`
}
