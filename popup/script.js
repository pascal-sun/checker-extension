const currentSecurityHeaderElement = document.getElementById('currentSecurityHeader');
const currentLinkTagElement = document.getElementById('currentLinkTag');
const currentScriptTagElement = document.getElementById('currentScriptTag');

function addElement(id, text, statut) {
    let ul = document.getElementById(id);
    let li = document.createElement("li");
    let pre = document.createElement("pre");
    li.setAttribute("class", "element-" + statut);
    li.appendChild(document.createTextNode(text));
    pre.appendChild(li);
    ul.appendChild(pre);
}



console.log("Test Popup");

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
            message += j + '="' + data[i][j] + '" ' ;
        }
        message += '>';
        if (correct === true) {
            addElement("currentLinkTag", message, "correct");
        } else {
            addElement("currentLinkTag", message, "incorrect");
        }
    }
    if (counter === 0) {
        message = "There are no <i>&lt;link&gt; tags</i> with the <i>href attribute</i> on the current page."
    } else {
        message = "There are <b>" + counter + "</b> <i>&lt;link&gt; tags</i> with the <i>href attribute</i> on the current page:"
    }
    document.getElementById("currentLinkTag-p").innerHTML = message;



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
            addElement("currentScriptTag", message, "correct");
        } else {
            addElement("currentScriptTag", message, "incorrect");
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
            addElement("hostnameCorrectwoSRI", message, "correct");
            counterCorrectwoSRI += 1;
        } else if (SRI === true) {
            addElement("hostnameCorrectwithSRI", message, "correct");
            counterCorrectwithSRI += 1;
        } else {
            addElement("hostnameIncorrect", message, "incorrect");
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
            addElement("hostnameCorrectwoSRI", message, "correct");
            counterCorrectwoSRI += 1;
        } else if (SRI === true) {
            addElement("hostnameCorrectwithSRI", message, "correct");
            counterCorrectwithSRI += 1;
        } else {
            addElement("hostnameIncorrect", message, "incorrect");
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
});

console.log("AAAAAAA" + currentLinkTagElement.childElementCount);
