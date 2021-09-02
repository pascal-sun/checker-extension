const currentSecurityHeaderElement = document.getElementById('currentSecurityHeader');
const currentLinkTagElement = document.getElementById('currentLinkTag');
const currentScriptTagElement = document.getElementById('currentScriptTag');

function addElement(id, text, statut) {
    let ul = document.getElementById(id);
    let li = document.createElement("li");
    li.setAttribute("class", "element-" + statut);
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
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

    data = results[results.currentHostname]["linkTags"][results.currentPathname];
    for (let i in data) {
        message = '<link href="' + i + '" ';
        let correct = false;
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


    for (let i in results[results.currentHostname]["scriptTags"][results.currentPathname]) {
        addElement("currentScriptTag", i, "correct");
    }
});

console.log("AAAAAAA" + currentLinkTagElement.childElementCount);
