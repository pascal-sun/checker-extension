console.log("Test Background");

browser.runtime.onMessage.addListener(message => {
    if (message.popupOpen === true) {
        console.log("THE POPUP IS OPEN");
        browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
            const url = new URL(tabs[0].url);
            console.log(url.hostname);
            browser.storage.local.set({
                currentHostname: url.hostname,
                currentPathname: url.pathname
            });
        });
    }
});

let SecurityHeaderData = localStorage.getItem('SecurityHeaderData');
let LinkTagData = localStorage.getItem('LinkTagData');
let ScriptTagData = localStorage.getItem('ScriptTagData');

if (SecurityHeaderData === null) {
        SecurityHeaderData = {}
}
if (LinkTagData === null) {
        LinkTagData = {}
}
if (ScriptTagData === null) {
        ScriptTagData = {}
}

function logURL(requestDetails) {
      console.log("Chargement : " + requestDetails.url);
}

function listener(requestDetails) {
        let filter = browser.webRequest.filterResponseData(requestDetails.requestId);
        let decoder = new TextDecoder("utf-8");
        let encoder = new TextEncoder();
        filter.ondata = event => {
                let str = decoder.decode(event.data, {stream: true});

                console.log("Data : " + str);
                console.log(event.data);
                filter.write(event.data);
                filter.disconnect();
        }
}

function headers(requestDetails) {
        console.log(requestDetails.url);
        console.log(requestDetails.statusCode);
        console.log(requestDetails.responseHeaders);
        console.log("Title" + document.title);
}

/*browser.webRequest.onBeforeRequest.addListener(
        logURL,
  {urls: ["<all_urls>"]}
);*/

/*browser.webRequest.onBeforeRequest.addListener(
      listener,
      {urls: ["<all_urls>"], types: ["main_frame"]}
      
)
browser.webRequest.onCompleted.addListener(
        headers,
        {urls: ["<all_urls>"]},
        ["responseHeaders"]
);*/

