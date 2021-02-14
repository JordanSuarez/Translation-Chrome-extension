function getUserSelection() {
    if(window.getSelection) {
        const userSelection = window.getSelection().toString().trim();
        if (userSelection.length > 2 && userSelection.length < 50) {
            return callApiForTranslate(userSelection);
        }

        // document.addEventListener('click', function(event) {
        //     const target = event.target
        //     if(!target.matches('input')) {
        //         if (userSelection.length > 2 && userSelection.length < 50) {
        //             return callApiForTranslate(userSelection);
        //         }
        //     }
        // })
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
    if(selectionObject.getRangeAt(0).startContainer.childNodes.length === 0) {
        let range;
        let expandedSelRange;
        let node;
        if (selectionObject.getRangeAt && selectionObject.rangeCount) {
            range = selectionObject.getRangeAt(0);
            expandedSelRange = range.cloneRange();
            console.log(range)
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
}

document.addEventListener("mouseup", getUserSelection)
