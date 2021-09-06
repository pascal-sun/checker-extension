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
