var cloudwalkerMode = 0;
var warnagain = 1;
var keepComputing = 1;
var previousSignificant = 0;
var previousSignificantTmp = 0;
var warnedAtTime = 0;
var flickerStartedAtTime = 0;
var lastBrightFrame = [0, 0, 0, 0, 0, 0];
let video = document.querySelector('.video-stream.html5-main-video');
var counter = 0;
var coutner2 = 0;
let lower = document.querySelector('.ytp-chrome-bottom');
var hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') {
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  let data = { url: window.location.toString() };
  if (request.message) {
    data = { url: request.message };
    chrome.tabs.create({ url: request.message });
  }

fetch("http://127.0.0.1:5000/check", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    res.json().then((json) => {
      console.log(json);
      intervals = json.intervals;
    });
  });
});

let intervals = [];
let goto = 0;

setInterval(function (request) {
  console.log(intervals);
  var video = document.getElementsByTagName("video")[0];
  if (video) {
    let time = video.currentTime;
    for (let i = 0; i < intervals.length; i++) {
      if (time >= intervals[i][0]-1 && time < intervals[i][1]) {
        goto = intervals[i][1];
        intervals.shift();

        //continueScript();
        video.currentTime = goto;
        console.log("here");
        break;
      }
    }
  }
}, 1000);

function cloudwalkerModeOn() {
  cloudwalkerMode = 1;
  var seizafecanvas = document.getElementById('seizafe-canvas');
  if (seizafecanvas) {
    seizafecanvas.style.display = 'block';
  } else {
  }
}

function cloudwalkerModeOff() {
  cloudwalkerMode = 0;
  var seizafecanvas = document.getElementById('seizafe-canvas');
  if (seizafecanvas) {
    seizafecanvas.style.display = 'none';
  } else {
  }
}

var waitSeconds = 40;
var flickerTimer = 4;
var flickers = 4;
var brightnessSensitivityUpper = 10;
var brightnessSensitivityLower = 100;
var desiredRedPercent = 50;
var desiredGreenPercent = 50;
var desiredBluePercent = 75;

function removeElementsByClass(className) {
  var elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function hideSeizafe() {
  var seizafewarning = document.getElementById('seizafewarning');
  if (seizafewarning) {
    warnedAtTime = document.querySelector('.video-stream.html5-main-video')
      .currentTime;
    video.play();
    seizafewarning.remove();
  } else {
  }
}


function DisplaySeizafeWarning() {
  if (warnagain == 1) {
    document.querySelector('.video-stream.html5-main-video').pause();
    var seizafewarning = document.getElementById('seizafewarning');
    if (seizafewarning) {
      seizafewarning.remove();
    }
    document
      .querySelector('#player-container.style-scope.ytd-watch-flexy')
      .insertAdjacentHTML(
        'beforeend',
        `<div id='seizafewarning' style=display:block class='overlay seizafewarning'>
          <div class='hovered'>
            <div class='overlay-body' align=center>
              <div id=szf></div>
              <p class='overlay-text'>
              <span class='overlay-text-title'>⚠ <u>WARNING!</u> ⚠</span>
              <br></br>
              <br /><span class='overlay-text-body'>
              The following content may potentially trigger seizures for <br />
              people with PHOTOSENSITIVE EPILEPSY.
              </span><br>
              <br></br>
              <span class='overlay-text-body'>
              Hit spacebar to continue watching.
              </span><br>
              <div class="seizafe-toggle2" id="seizafe-toggle2"><input id="s2" type="checkbox" class="switch">
              <label for="s2" class='seizafe-label'>Watch the video with an overlay.</label><br></div>
              <div class="seizafe-toggle" id="seizafe-toggle"><input id="s1" type="checkbox" class="switch">
              <label for="s1" class='seizafe-label'>Don't warn me again during this video.</label><br></div>

              </p>
            </div>
          </div>
        </div>`
      );
        animate = true;
    document
      .getElementById('seizafewarning')
      .addEventListener('click', hideSeizafe);

    document
      .getElementById('seizafe-toggle')
      .addEventListener('click', function (event) {
        event.stopPropagation();
        if (document.getElementById('s1').checked == true) {
          warnagain = 0;
          window.setTimeout(hideSeizafe, 800);
        } else if (document.getElementById('s1').checked == false) {
          warnagain = 1;
          window.setTimeout(hideSeizafe, 800);
        }
      });

      document
      .getElementById('seizafe-toggle2')
      .addEventListener('click', function (event) {
        event.stopPropagation();
        if (document.getElementById('s2').checked == true) {
          overlay();
          window.setTimeout(hideSeizafe, 800);
        } else{
        }
      });
      
  }
}

function overlay(){
  if (warnagain == 1) {
    document
      .querySelector('#player-container.style-scope.ytd-watch-flexy')
      .insertAdjacentHTML('beforeend',
      `<div id='overlay2' class='overlay2'>`
      );
      document.querySelector('.video-stream.html5-main-video').play();
      counter = 1;
  }
}

function overlayoff(){
  removeElementsByClass('overlay2');
}

function drawSeizafeCanvas() {
  var interval = setInterval(function () {
    var playerContainer = document.querySelector(
      '#player-container.style-scope.ytd-watch-flexy'
    );
    if (playerContainer) {
      clearInterval(interval);
      playerContainer.insertAdjacentHTML(
        'beforeend',
        `<canvas id="seizafe-canvas"  class="szf-processing"></canvas>`
      );
    } else {
    }
  }, 100);
}

let c1, ctx1, c_tmp, ctx_tmp;
var seizafecanvas = document.getElementById('seizafe-canvas');

function init() {
  
  c1 = document.getElementById('seizafe-canvas');
  ctx1 = c1.getContext('2d');
  c_tmp = document.createElement('canvas');
  ctx_tmp = c_tmp.getContext('2d');

  computeFrame();

  document.body.onkeyup = function (e) {
    if (e.keyCode == 37 || e.keyCode == 39) {
      if (!video.paused) {
        keepComputing = 0;
        window.setTimeout(function () {
          if (!video.paused) {
            keepComputing = 1;
            previousSignificant = 0;
            previousSignificantTmp = 0;
            computeFrame();
          }
        }, 1000);
      }
    }
  };

  
  
  document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space") {
          overlay();     
    }
  }

  

  var elements = document.getElementsByClassName('ytp-settings-menu');

  var myFunction = function () {
    refreshSeizafeProcessing();
  };

  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', myFunction, false);
  }
}

function flickerDetected() {
  keepComputing = 0;
  DisplaySeizafeWarning();
}


function seizafeProcessing() {
  var intervalProcessing = setInterval(function () {
    var seizafeCanvasInstance = document.getElementById('seizafe-canvas');
    var playerContainer = document.querySelector(
      '#player-container.style-scope.ytd-watch-flexy'
    );
    if (playerContainer) {
      clearInterval(intervalProcessing);
      keepComputing = 1;
      if (seizafeCanvasInstance) {
        removeElementsByClass('szf-processing');
      }
      playerContainer.insertAdjacentHTML(
        'beforeend',
        `<canvas id="seizafe-canvas" class="szf-processing"></canvas>`
      );

      var interval = setInterval(function () {
        var seizafecanvas = document.getElementById('seizafe-canvas');
        if (seizafecanvas) {
          clearInterval(interval);
          window.setTimeout(init, 500);
        } else {
        }
      }, 100);
    } else {
    }
  }, 100);
}

function refreshSeizafeProcessing() {
  keepComputing = 0;
  seizafeProcessing();
}

function seizafeOn() {
  drawSeizafeCanvas();
  seizafeProcessing();

  video = document.querySelector('.video-stream.html5-main-video');
  video.addEventListener('pause', function () {
    keepComputing = 0;
  });

  video.addEventListener('play', function () {
    if (warnagain == 1) {
      chrome.storage.sync.get('seizafeStatusStorage', function (data) {
        if (typeof data.seizafeStatusStorage === 'undefined') {
          seizafePlay();
        } else {
          if (data.seizafeStatusStorage == 'ON') {
            seizafePlay();
          } else {
            seizafeOff();
          }
        }
      });
    } else {
      seizafeOff();
    }
  });
}

function seizafePlay() {
  video = document.querySelector('.video-stream.html5-main-video');
  if (!video.paused) {
    hideSeizafe();
    keepComputing = 1;
    computeFrame();
  }
}

function seizafeOff() {
  var seizafewarning = document.getElementById('seizafewarning');
  var seizafecanvas = document.getElementById('seizafe-canvas');
  keepComputing = 0;
  if (seizafecanvas) {
    seizafecanvas.remove();
  }
  if (seizafewarning) {
    seizafewarning.remove();
  } else {
  }
}

function handleVisibilityChange() {
  if (document[hidden]) {
    seizafeOff();
  } else {
    chrome.storage.sync.get('seizafeStatusStorage', function (data) {
      if (typeof data.seizafeStatusStorage === 'undefined') {
        seizafeOn();
      } else {
        if (data.seizafeStatusStorage == 'ON') {
          seizafeOn();
        } else {
          seizafeOff();
        }
      }
    });
  }
}
handleVisibilityChange();

if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
  console.log('Browser does not support visibilityChange');
} else {
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.message === 'urlchanged') {
    handleVisibilityChange();
  } else if (request.message === 'ON') {
    seizafeOn();
  } else if (request.message === 'OFF') {
    seizafeOff();
  } else if (request.message === 'low') {
    handleVisibilityChange();
  }
});

  document.body.onkeyup = function(e) {
    if (e.key == "o" ||
        e.code == "o") {
      overlayoff();
      }
    }