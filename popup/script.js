// Add new element in the list
function addElement(id, text, statut, type) {
    let ul = document.getElementById(id);
    let li = document.createElement("li");
    let pre = document.createElement("pre");
    let code = document.createElement("code");
    li.setAttribute("class", "element-" + statut);
    code.setAttribute("class", "language-" + type);
    code.appendChild(document.createTextNode(text));
    pre.appendChild(code);
    li.appendChild(pre);
    ul.appendChild(li);
    Prism.highlightElement(code);
}

// Add new element in the list, for headers on the browsed pages
function addHeaderElement(id, text, statut, nbPages) {
    let ul = document.getElementById(id);
    let li = document.createElement("li");
    let code = document.createElement("code");
    li.setAttribute("class", "element-" + statut);
    code.setAttribute("class", "language-http");
    code.appendChild(document.createTextNode(text));
    li.appendChild(code);
    li.appendChild(document.createTextNode("is present on "));
    let b = document.createElement("b");
    b.appendChild(document.createTextNode(nbPages));
    li.appendChild(b);
    li.appendChild(document.createTextNode(" pages"))
    ul.appendChild(li);
    Prism.highlightElement(code);
}

// Get URL form where the extension is open
function getCurrentUrl() {
    browser.runtime.sendMessage({
        popupOpen: true
    });
    browser.storage.local.get("currentHostname").then(data => {
        currentUrl = data.currentUrl;
    })
    return currentUrl;
}


const currentSecurityHeaderElement = document.getElementById('currentSecurityHeader');
const currentLinkTagElement = document.getElementById('currentLinkTag');
const currentScriptTagElement = document.getElementById('currentScriptTag');


browser.runtime.sendMessage({popupOpen: true});

browser.storage.local.get("currentHostname").then(data => {
  currentURL = data.currentURL;
});

let gettingStoredData = browser.storage.local.get();
gettingStoredData.then(results => {

    let savedDataElement = document.getElementById("savedData");
    console.log(results);
    for (let r in results) {
        if (r !== "currentHostname" && r !== "currentPathname") {
            savedDataElement.innerText += r + "\n";
        }
    }
    console.log("host ", results.currentHostname);
    console.log("results", results[results.currentHostname]); 

    document.getElementById("url.hostname").innerText = "on " + results.currentHostname;
    document.getElementById("url.pathname").innerText = "(" + results.currentPathname + ")";


    // Link tag sort
    data = results[results.currentHostname]["linkTags"][results.currentPathname];
    let url;
    let counter = 0;
    for (let i in data) {
        counter += 1;
        url = new URL(i);
        let correct = false;
        if (url.hostname === results.currentHostname) {
            correct = true;
        }
        message = '<link href="' + i + '" ';
        for (let j in data[i]) {
            if (j === "integrity") {
                correct = true;
            }
            message += "" +j + '="' + data[i][j] + '" ' ;
        }
        message += '>';
        if (correct === true) {
            addElement("currentLinkTag", message, "correct", "html");
        } else {
            addElement("currentLinkTag", message, "incorrect", "html");
        }
    }
    if (counter === 0) {
        message = "There are no <i>&lt;link&gt; tags</i> with the <i>href attribute</i> on the current page."
    } else {
        message = "There are <b>" + counter + "</b> <i>&lt;link&gt; tags</i> with the <i>href attribute</i> on the current page:"
    }
    document.getElementById("currentLinkTag-p").innerHTML = message ;



    // Script tag sort
    data = results[results.currentHostname]["scriptTags"][results.currentPathname];
    counter = 0;
    for (let i in data) {
        counter += 1;
        url = new URL(i);
        let correct = false;
        if (url.hostname === results.currentHostname) {
            correct = true;
        }
        message = '<script src="' + i + '" ';
        for (let j in data[i]) {
            if (j === "integrity") {
                correct = true;
            }
            message += j + '="' + data[i][j] + '" ' ;
        }
        message += '>';
        if (correct === true) {
            addElement("currentScriptTag", message, "correct", "html");
        } else {
            addElement("currentScriptTag", message, "incorrect", "html");
        }
    }
    if (counter === 0) {
        message = "There are no <i>&lt;script&gt; tags</i> with the <i>src attribute</i> on the current page."
    } else {
        message = "There are <b>" + counter + "</b> <i>&lt;script&gt; tags</i> with the <i>src attribute</i> on the current page:"
    }
    document.getElementById("currentScriptTag-p").innerHTML = message;

    // All tag sort
    data = results[results.currentHostname]["scriptTags"]["allURLs"];
    let counterCorrectwoSRI = 0;
    let counterCorrectwithSRI = 0;
    let counterIncorrect = 0;
    for (let i in data) {
        let SRI = false;
        message = '<script src="' + i + '" ';
        for (let j in data[i]) {
            if (j === "integrity") {
                SRI = true;
            }
            message += j + '="' + data[i][j] + '" ' ;
        }
        message += '>';


        url = new URL(i);
        if (url.hostname == results.currentHostname) {
            addElement("hostnameCorrectwoSRI", message, "correct", "html");
            counterCorrectwoSRI += 1;
        } else if (SRI === true) {
            addElement("hostnameCorrectwithSRI", message, "correct", "html");
            counterCorrectwithSRI += 1;
        } else {
            addElement("hostnameIncorrect", message, "incorrect", "html");
            counterIncorrect += 1;
        }
    }

    // All tag sort
    data = results[results.currentHostname]["linkTags"]["allURLs"];
    for (let i in data) {
        let SRI = false;
        message = '<link href="' + i + '" ';
        for (let j in data[i]) {
            if (j === "integrity") {
                SRI = true;
            }
            message += j + '="' + data[i][j] + '" ' ;
        }
        message += '>';


        url = new URL(i);
        if (url.hostname === results.currentHostname) {
            addElement("hostnameCorrectwoSRI", message, "correct", "html");
            counterCorrectwoSRI += 1;
        } else if (SRI === true) {
            addElement("hostnameCorrectwithSRI", message, "correct", "html");
            counterCorrectwithSRI += 1;
        } else {
            addElement("hostnameIncorrect", message, "incorrect", "html");
            counterIncorrect += 1;
        }
    }
    if (counterCorrectwoSRI === 0) {
        message = "There are no <i>&lt;link&gt;</i> or <i>&lt;script&gt; tags</i> with a relative URL in the <i>href</i> or <i>src attribute</i> on <b>" + results.currentHostname +"</b>.";
    } else {
        message = "There are <b>" + counterCorrectwoSRI + "</b> <i>&lt;link&gt;</i> or <i>&lt;script&gt; tags</i> with a relative URL in the <i>href</i> or <i>src attribute</i> on <b>" + results.currentHostname + "</b>:";
    }
    document.getElementById("hostnameCorrectwoSRI-p").innerHTML = message;

    if (counterCorrectwithSRI === 0) {
        message = "There are no <i>&lt;link&gt;</i> or <i>&lt;script&gt; tags</i> that have the <i>integrity attribute</i> on <b>" + results.currentHostname +"</b>.";
    } else {
        message = "There are <b>" + counterCorrectwithSRI + "</b> <i>&lt;link&gt;</i> or <i>&lt;script&gt; tags</i> that have the <i>integrity attribute</i> on <b>" + results.currentHostname + "</b>:";
    }
    document.getElementById("hostnameCorrectwithSRI-p").innerHTML = message;
    if (counterIncorrect === 0) {
        message = "There are no <i>&lt;link&gt;</i> or <i>&lt;script&gt; tags</i> that require the <i>integrity attribute</i> on <b>" + results.currentHostname +"</b>.";
    } else {
    message = "There are <b>" + counterIncorrect + "</b> <i>&lt;link&gt;</i> or <i>&lt;script&gt; tags</i> that require the <i>integrity attribute</i> on <b>" + results.currentHostname + "</b>:";
    }
    document.getElementById("hostnameIncorrect-p").innerHTML = message;
    // for (let i in results[results.currentHostname]["scriptTags"][results.currentPathname]) {
    //     addElement("currentScriptTag", i, "correct");
    // }
    //



    // Headers
    
    let securityHeadersCorrect = [
        "strict-transport-security", 
        "x-xss-protection",
        "content-security-policy",
        "x-frame-options",
        "x-content-type-options",
        "cache-control",
    ];
    let securityHeadersIncorrect = [
        "server",
        "x-powered-by"
    ];
        // Present headers
    data = results[results.currentHostname]["headers-all"][results.currentPathname];
    let currentHeaders = [];
    for (let i in data) {
        message = `${i}: ${data[i]}`
        currentHeaders.push(i);
        if (securityHeadersCorrect.includes(i.toLowerCase())) {
            addElement("currentPresentHeaders", message, "correct", "http");
        } else if (securityHeadersIncorrect.includes(i.toLowerCase())) {
            addElement("currentPresentHeaders", message, "incorrect", "http");
        } else {
            addElement("currentPresentHeaders", message, "none", "http");
        }
    }
    console.log(data)
    if (Object.keys(data).length === 0) {
        let p = document.getElementById("currentPresentHeaders-p");
        let i = document.createElement("i");
        i.innerText = "HTTP header";
        p.appendChild(document.createTextNode("No "));
        p.appendChild(i);
        p.appendChild(document.createTextNode(" was found on current page."));
        console.log(p.innerHTML)
    } else {
        let p = document.getElementById("currentPresentHeaders-p");
        let i = document.createElement("i");
        i.innerText = "HTTP header";
        p.appendChild(document.createTextNode("The following "));
        p.appendChild(i);
        p.appendChild(document.createTextNode(" has been received on current page:"));
        console.log(p.innerHTML)

    }

        // Missing headers
    let diff = securityHeadersCorrect.filter(header => !currentHeaders.includes(header));
    console.log(diff);
    for (let i in diff) {
        message = `${diff[i]}: ...`
        addElement("currentMissingHeaders", message, "none", "http");
    }
    if (diff.length === 0) {
        let p = document.getElementById("currentMissingHeaders-p");
        let i = document.createElement("i");
        i.innerText = "HTTP security headers";
        p.appendChild(document.createTextNode("The main "));
        p.appendChild(i);
        p.appendChild(document.createTextNode(" are present."));
    } else {
        let p = document.getElementById("currentMissingHeaders-p");
        let i = document.createElement("i");
        i.innerText = "HTTP security header";
        p.appendChild(document.createTextNode("The following "));
        p.appendChild(i);
        p.appendChild(document.createTextNode(" are missing:"));

    }

        // Headers on the domain
    data = results[results.currentHostname]["headers-all"];
    let nbPages = Object.keys(data).length; 
    let p = document.getElementById("domain-headers-p");
    p.appendChild(document.createTextNode("On "));
    let b1 = document.createElement("b");
    b1.innerText = nbPages + " visited pages";
    p.appendChild(b1);
    p.appendChild(document.createTextNode(" of "));
    let b2 = document.createElement("b");
    b2.innerText = results.currentHostname;
    p.appendChild(b2);
    p.appendChild(document.createTextNode(":"));

    data = results[results.currentHostname]["headers-security"];
    for (let header in data) {
        let size = data[header].size;
        if (header !== "server" && header !== "x-powered-by") {
            if (size === nbPages) {
                addHeaderElement("domain-headers-ul", header+": ", "correct", "all");

            } else {
                addHeaderElement("domain-headers-ul", header+": ", "incorrect", size);
            }
        } else {
            if (size === 0) {
                addHeaderElement("domain-headers-ul", header+": ", "correct", size);

            } else {
                addHeaderElement("domain-headers-ul", header+": ", "incorrect", size);
            }
        }
        // message = '<code class="language-http">' + header + '</code>'; 
        // console.log(header);
    }


});

