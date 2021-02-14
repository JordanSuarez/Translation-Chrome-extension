function getUserSelection() {
    if(window.getSelection) {
        const userSelection = window.getSelection().toString().trim();
        if (userSelection.length > 2 && userSelection.length < 50) {
            return callApiForTranslate(userSelection);
        }
    }
}

function callApiForTranslate(valueSelected) {
    fetch(apiUrl(valueSelected), {
        "method": requestMethod,
        "headers": {
            "x-rapidapi-key": config.apiKey,
            "x-rapidapi-host": rapidApiHost
        }
    })
    .then(response => response.json())
    .then(({responseData}) => {
        const {translatedText} = responseData
        insertHtmlFromSelection(window.getSelection(), translatedText)
    })
}

function insertHtmlFromSelection(selectionObject, translation) {
    let range;
    if (selectionObject.getRangeAt && selectionObject.rangeCount) {
        range = selectionObject.getRangeAt(0);
        range.collapse(false);

        // insert html content
        const el = document.createElement("div");
        el.innerHTML = `<span class="translate">[${targetLanguage.toUpperCase()}: ${translation} ]</span>`;
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

document.addEventListener("mouseup", getUserSelection)
