function sendMessage() {
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
        const url = new URL(tabs[0].url);
        browser.storage.local.set({
            currentHostname: url.hostname,
            currentPathname: url.pathname
        });
    });
}
// browser.runtime.onMessage.addListener(message => {
//     if (message.popupOpen === true) {
//         console.log("THE POPUP IS OPEN");
//         browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
//             const url = new URL(tabs[0].url);
//             console.log(url.hostname);
//             browser.storage.local.set({
//                 currentHostname: url.hostname,
//                 currentPathname: url.pathname
//             });
//         });
//     }
// });
// 
// 
function logResponse(responseDetails) {
    if (responseDetails.documentUrl === undefined) {
        let url = new URL(responseDetails.url);
        browser.storage.local.get(url.hostname).then(data => {
            if (Object.keys(data).length === 0) {
                console.log("No data currently avalable");
                data[url.hostname] = {
                    "headers-all":{
                    },
                    "headers-security":{
                        "strict-transport-security": new Set(),
                        "x-xss-protection": new Set(),
                        "content-security-policy": new Set(),
                        "x-frame-options": new Set(),
                        "x-content-type-options": new Set(),
                        "cache-control": new Set(),
                        "server": new Set(),
                        "x-powered-by": new Set()
                    },
                    "linkTags":{
                        "allURLs": {}   
                    },
                    "scriptTags":{
                        "allURLs": {}
                    }
                };
}
 
        data[url.hostname]["headers-all"][url.pathname] = {};
        let securityHeaders = [
            "strict-transport-security", 
            "x-xss-protection",
            "content-security-policy",
            "x-frame-options",
            "x-content-type-options",
            "cache-control",
            "server",
            "x-powered-by"
        ]
        for (let header in responseDetails.responseHeaders) {
            data[url.hostname]["headers-all"][url.pathname][responseDetails.responseHeaders[header].name] = responseDetails.responseHeaders[header].value;
            if (securityHeaders.includes(responseDetails.responseHeaders[header].name.toLowerCase())) {
                data[url.hostname]["headers-security"][responseDetails.responseHeaders[header].name.toLowerCase()].add(url.pathname);
            }
        }

        // for (let header in data[url.hostname]["headers-security"]) {
        //     console.log(responseDetails.responseHeaders);
        //     if (responseDetails.responseHeaders.includes(header)) {
        //         data[url.hostname]["headers-security"][header].add(url.pathname);
        //     }
        // }
        console.log(data);
        browser.storage.local.set(data);
    });

};
}

browser.webRequest.onCompleted.addListener(
    logResponse,
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);
browser.runtime.onMessage.addListener(message => {
     if (message.popupOpen === true) {
         sendMessage();
    }
});
let portFromExtension;
function connected(p) {
    portFromExtension = p;
    portFromExtension.postMessage({greeting: "hi there extension!"});
}
browser.runtime.onConnect.addListener(connected);
