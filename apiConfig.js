const sourceLanguage = "en";
const targetLanguage = "fr";

const requestMethod = "GET";

const rapidApiHost = "translated-mymemory---translation-memory.p.rapidapi.com";

function apiUrl(valueSelected) {
    return `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=${sourceLanguage}%7C${targetLanguage}&q=${valueSelected}&mt=1&onlyprivate=0&de=a%40b.c`
}
