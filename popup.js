var statusCheckbox = document.getElementById('statusCheckbox');
var overlay = document.getElementById('overlayId')
let video = document.querySelector('.video-stream.html5-main-video');

var matchUrl = "*://www.youtube.com/watch?v*";
var queryInfo = { url: matchUrl };
document.addEventListener(
  "DOMContentLoaded",
  function () {
    document
      .getElementById("vidButton")
      .addEventListener("click", onClickVidButton, false);
    function onClickVidButton() {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, "");
      });
    }
    function onClickLinkButton() {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          document.getElementById("link").value
        );
      });
    }
    chrome.runtime.sendMessage({ message: "popup" }, function (response) {
      //
    });
  },
  false
);

function newPopup(url) {
  popupWindow = window.open(
    url,
    "popUpWindow",
    "height=800,width=1000,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes"
  );
}


if(overlay){
  overlay.addEventListener('click', changeState2);
  function loadData() {
    chrome.storage.sync.get('overlayStorage', function (data) {
        if (data.overlayStorage == 'ON') {
          overlay.checked = true;
        } else {
          overlay.checked = false;
        }
    });
  }
  loadData();
}

function changeState2(){
  if (overlay.checked == true){
    value = 'ON';
    chrome.storage.sync.set({ overlayStorage: value }, function (data) {
      sendSettings(value);
    });
  } else if (overlay.checked == false) {
    value = 'OFF';
    chrome.storage.sync.set({ overlayStorage: value }, function (data) {
      sendSettings(value);
    });
  }
}

if (statusCheckbox) {
  statusCheckbox.addEventListener('click', changeState);
  function loadData() {
    chrome.storage.sync.get('seizafeStatusStorage', function (data) {
        if (data.seizafeStatusStorage == 'ON') {
          statusCheckbox.checked = true;
        } else {
          statusCheckbox.checked = false;
        }
    });
  }
  loadData();
}

function changeState() {
  if (statusCheckbox.checked == true) {
    value = 'ON';
    chrome.storage.sync.set({ seizafeStatusStorage: value }, function (data) {
      sendSettings(value);
    });
  } else if (statusCheckbox.checked == false) {
    value = 'OFF';
    chrome.storage.sync.set({ seizafeStatusStorage: value }, function (data) {
      sendSettings(value);
    });
  }
}

function sendSettings(setting) {
  let params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, gotTabs);
  function gotTabs(tabs) {
    let msg = {
      message: setting,
    };
    chrome.tabs.sendMessage(tabs[0].id, msg);
  }
}
