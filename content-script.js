// Retrieve <link> or <script> tags
function retrieveTags(tags, type) {
    let attribute = "";
    // If we try to retrieve <link> tags
    if (type === "link") {
       attribute = "href";
    }
    // If we try to retrieve <script> tags
    else if (type === "script") {
        attribute = "src";
    }
    else {
        console.error(`${type} type doesn't exist for retrieveTags function. Please choose between "link" or "script"`);
        return;
    }
    console.group(`[checker] Logs to retrieve ${type} tags`);
    console.log(`There are ${tags.length} ${type} tags in this document...`, tags);
    let tagsWithURL = {};
    for (let tag of tags) {
        console.log("URL " + tag[attribute]);
        if (tag.hasAttribute(attribute)) {
            // We collect the diffrent attributes, except "src" or "href"
            const attributeNames = tag.getAttributeNames().filter(attributeName => attributeName != attribute);
            let tmp = {};
            for (let attributeName of attributeNames) {
                tmp[attributeName] = tag.getAttribute(attributeName)
            }
            tagsWithURL[tag[attribute]] = tmp;
        }
    }
    console.log(`... including ${Object.keys(tagsWithURL).length} with the "href" attribute:`, tagsWithURL)
    console.groupEnd();
    return tagsWithURL;
}

            /*url = new URL(i.src);
            if (url.hostname != document.location.hostname){
                if (i.hasAttribute("integrity")) {
                    scriptTagsCorrect.push(i);
                }
                else {
                    scriptTagsIncorrect.push(i);
                }
            }*/
            // scriptTagsWithSrc.push(i);

            // We collect the diffrent attributes, except "src"

// On startup, check if we have stored data
// If we don't, then store the default settings
async function getData(hostname) {
    console.group(`[checker] Checking stored data for ${hostname}`);
    let data = await browser.storage.local.get(hostname);
    // If there is no data for the hostname, we create the default setting
    if (Object.keys(data).length === 0) {
        console.log("No data currently avalable");
        data[hostname] = {
            "headers-all":{
            },
            "headers-security":{
                "strict-transport-security": new Set(),
                "x-xss-protection": new Set(),
                "content-security-policy": new Set(),
                "x-content-type-options": new Set()
            },
            "linkTags":{
                "allURLs": {}   
            },
            "scriptTags":{
                "allURLs": {}
            }
        };
    }
    console.log("data", data);
    console.groupEnd();
    return data;
}

// Store items in the storage area, or update existing items
async function saveData(data, tagsWithURL, type) {
    console.group("[checker] Checking for saveData")
    let attribute = "";
    // If we try to save <link> tags
    if (type === "link") {
       attribute = "linkTags";
    }
    // If we try to save <script> tags
    else if (type === "script") {
        attribute = "scriptTags";
    }
    else {
        console.error(`${type} type doesn't exist for saveData function. Please choose between "link" or "script"`);
        return;
    }
    data[document.location.hostname][attribute][document.location.pathname] = tagsWithURL;
    for (let url in tagsWithURL) {
        data[document.location.hostname][attribute]["allURLs"][url] = tagsWithURL[url];
    }
    console.log("data", data)
    browser.storage.local.set(data).catch(err => console.log(err)); 
    console.groupEnd();
}

function onGot(item) {
      console.log(item);
}

function onError(error) {
      console.log(`Error: ${error}`);
}



console.log(`Test du content-script : ${document.location.hostname}`);

let linkTags = document.getElementsByTagName('link');
let scriptTags = document.getElementsByTagName("script");

let linkTagsWithHref = retrieveTags(linkTags, "link");
let scriptTagsWithSrc = retrieveTags(scriptTags, "script");

getData(document.location.hostname).then(result => {
    saveData(result, linkTagsWithHref, "link");
    saveData(result, scriptTagsWithSrc, "script");
});

browser.storage.local.get().then(result => console.log("All", result));
