var rec = null;
var blob = null;
var audioURL = null;
var recorder = null;
var isAudioPlaying = false;
var recordingStarted = false;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

var audioContainer = document.querySelector("#audio-player");
var playAndbutton = document.querySelector("#play-button");
var stopButton = document.querySelector("#stop-button");
var ResetButton = document.querySelector("#reload-button");
var inputTitleBar = document.querySelector("#saving-title");
var timer = document.querySelector("#audio-timer");
var svgIcon = document.querySelector("#svg-icon");
var audioPlayTime = null;
var audioPauseTime = null;
var currentRecordedTime = 0;
var audioTimeout = null;

const calculateTotalAudioLengthinMinutes = () => {
  currentRecordedTime =
    currentRecordedTime + new Date().getTime() - audioPlayTime;
  audioPlayTime = new Date().getTime();
  const secs = currentRecordedTime / 1000;
  const minutes = Math.floor(secs / 60);
  const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${returnedMinutes}:${returnedSeconds}`;
};

const audioTimerFunction = () => {
  const timeinMinutes = calculateTotalAudioLengthinMinutes();
  timer.textContent = timeinMinutes;
};

const changeSvgIcon = (isPlay) => {
  if (isPlay) {
    svgIcon.innerHTML = `<div class="wave-1"></div>
      <div class="wave-2"></div>
      <div class="wave-3"></div>`;
  } else {
    svgIcon.innerHTML = `
            <svg
              width="43"
              height="43"
              viewBox="0 0 29 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 17C12.7533 22.9671 16.0431 22.7326 22 17V23.5C22 27.6421 18.6421 31 14.5 31C10.3579 31 7 27.6421 7 23.5V17Z"
                fill="url(#paint0_linear_203_2380)"
              />
              <path
                d="M19.3333 46H9.66667C8.7 46 8.05556 45.3655 8.05556 44.4138C8.05556 43.4621 8.7 42.8276 9.66667 42.8276H12.8889V38.069C0.161111 37.1172 0 25.5379 0 25.3793C0 24.4276 0.644444 23.7931 1.61111 23.7931C2.57778 23.7931 3.22222 24.4276 3.22222 25.3793C3.22222 26.331 3.54444 34.8966 14.5 34.8966C25.6167 34.8966 25.7778 25.6966 25.7778 25.3793C25.7778 24.4276 26.4222 23.7931 27.3889 23.7931C28.3556 23.7931 29 24.4276 29 25.3793C29 25.5379 28.8389 37.1172 16.1111 38.069V42.8276H19.3333C20.3 42.8276 20.9444 43.4621 20.9444 44.4138C20.9444 45.3655 20.3 46 19.3333 46ZM14.5 31.7241C8.05556 31.7241 6.44444 26.4897 6.44444 23.7931V7.93103C6.44444 5.23448 8.05556 0 14.5 0C20.9444 0 22.5556 5.23448 22.5556 7.93103V23.7931C22.5556 26.4897 20.9444 31.7241 14.5 31.7241ZM14.5 3.17241C9.98889 3.17241 9.66667 7.13793 9.66667 7.93103V23.7931C9.66667 24.5862 9.98889 28.5517 14.5 28.5517C19.0111 28.5517 19.3333 24.5862 19.3333 23.7931V7.93103C19.3333 7.13793 19.0111 3.17241 14.5 3.17241Z"
                fill="#253858"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_203_2380"
                  x1="14.5"
                  y1="17"
                  x2="14.5"
                  y2="31"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FFAB00" />
                  <stop offset="1" stop-color="#FFC400" stop-opacity="0.6" />
                </linearGradient>
              </defs>
            </svg>`;
  }
};

const finalSaveRecording = () => {
  const audioTitleInput = document.querySelector("#audio-title-input");
  const audioTitle = audioTitleInput.value;
  console.log("audioTitle", audioTitle);
  if (audioTitle == "") {
    alert("Audio Title could not be empty");
    return;
  }
  const myFile = new File([blob], audioTitle, {
    type: blob.type,
  });
  window.opener.audioFile = myFile; //saving object to global variable of parent window
  window.opener.audioTitle = audioTitle;
  window.opener.saveAndUploadRecording();
};

function createAudioUrltoPlay(url) {
  console.log("url", url);
  //creating audio element.
  const audioPlayer = document.createElement("audio");
  audioPlayer.controls = true;
  audioPlayer.src = url;
  audioContainer.innerHTML = "";
  audioContainer.appendChild(audioPlayer);
}

// triggered when clicked on Record Again Button
function goBackAndRecordAudioAgain() {
  // getting back to Previous Screen & Initializing the Recorder Object Again.
}

function pauseRecording() {
  recorder.pauseRecording();
  isAudioPlaying = false;
  clearInterval(audioTimeout);
  // blob = recorder.getBlob();
  // const url = window.URL.createObjectURL(blob);
  // audioURL = url;
  // createAudioUrltoPlay(audioURL);
  playAndbutton.innerHTML = ` <svg
    width="13"
    height="19"
    viewBox="0 0 13 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="svg"
  >
   <path
      d="M12.0208 10.075L1.06114 18.1132C0.842244 18.2741 0.572699 18.2741 0.353788 18.1135C0.134888 17.9527 0 17.6562 0 17.3349V1.25847C0 0.937102 0.134888 0.6406 0.353788 0.479798C0.572687 0.319267 0.842463 0.319267 1.06137 0.480091L12.0211 8.51829C12.24 8.67882 12.3746 8.97562 12.3746 9.29666C12.3746 9.61769 12.2397 9.91454 12.0208 10.075Z"
      fill="#253858"
    ></path>
 </svg>
 <span class="tooltiptext">Start&Pause</span> `;
}

async function saveFile() {
  const date = new Date().toISOString();
  const buffer = rec.buffer;
  // console.log("buffer");
  // let blob = await rec.getBlob();
  // console.log("lbobl", blob);
  const file = new File(buffer, date, {
    type: "audio/ogg",
    lastModified: Date.now(),
  });
  window.opener.audiofile = file; //saving object to global variable of parent window
  console.log("file", file);
  window.opener.func();
  window.opener.audiofile = file; //saving object to global variable of parent window
  window.opener.func();
}

// const invokeSaveAsDialog = (blob) => {
//   console.log("blob", blob);
// };

function stopRecording() {
  console.log("stop Recording");

  if (isAudioPlaying || recordingStarted) {
    console.log("stop");
    recorder.stopRecording(function () {
      clearInterval(audioTimeout);
      changeSvgIcon(false);
      blob = recorder.getBlob();
      const url = window.URL.createObjectURL(blob);
      audioURL = url;
      createAudioUrltoPlay(audioURL);
    });
    inputTitleBar.style.display = "block";
    playAndbutton.innerHTML = `<svg
    width="13"
    height="19"
    viewBox="0 0 13 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="svg"
  >
   <path
      d="M12.0208 10.075L1.06114 18.1132C0.842244 18.2741 0.572699 18.2741 0.353788 18.1135C0.134888 17.9527 0 17.6562 0 17.3349V1.25847C0 0.937102 0.134888 0.6406 0.353788 0.479798C0.572687 0.319267 0.842463 0.319267 1.06137 0.480091L12.0211 8.51829C12.24 8.67882 12.3746 8.97562 12.3746 9.29666C12.3746 9.61769 12.2397 9.91454 12.0208 10.075Z"
      fill="#253858"
    ></path>
 </svg> 
 <span class="tooltiptext">Start&Pause</span>`;
  }
}

function restartRecording() {
  if (isAudioPlaying) {
    recorder.pauseRecording();
    clearInterval(audioTimeout);
    changeSvgIcon(false);
  }
  recorder = null;
  isAudioPlaying = false;
  recordingStarted = false;
  audioPlayTime = null;
  audioPauseTime = null;
  currentRecordedTime = 0;
  audioTimeout = null;
  inputTitleBar.style.display = "none";
  audioContainer.innerHTML = "";
  timer.textContent = "00:00";

  playAndbutton.innerHTML = ` <svg
    width="13"
    height="19"
    viewBox="0 0 13 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="svg"
    >
      <path
        d="M12.0208 10.075L1.06114 18.1132C0.842244 18.2741 0.572699 18.2741 0.353788 18.1135C0.134888 17.9527 0 17.6562 0 17.3349V1.25847C0 0.937102 0.134888 0.6406 0.353788 0.479798C0.572687 0.319267 0.842463 0.319267 1.06137 0.480091L12.0211 8.51829C12.24 8.67882 12.3746 8.97562 12.3746 9.29666C12.3746 9.61769 12.2397 9.91454 12.0208 10.075Z"
        fill="#253858"
      ></path>
    </svg> 
    <span class="tooltiptext">Start&Pause</span>`;
}

function getStream(stream) {
  recorder = RecordRTC(stream, {
    type: "audio",
  });
}

function resumeRecording() {
  recorder.resumeRecording();
}

function playAndpauseControlsinPopup() {
  if (isAudioPlaying) {
    console.log("pausing recording");
    changeSvgIcon(false);
    pauseRecording();
  } else {
    if (recordingStarted) {
      console.log("resuming recording");
      resumeRecording();
      audioContainer.innerHTML = "";
      isAudioPlaying = true;
      audioPlayTime = new Date().getTime();
      audioTimeout = setInterval(audioTimerFunction, 100);
      changeSvgIcon(true);
    } else {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(async function (stream) {
          getStream(stream);
          recorder.startRecording();
          console.log("recording started");
          isAudioPlaying = true;
          recordingStarted = true;
          audioPlayTime = new Date().getTime();
          audioTimeout = setInterval(audioTimerFunction, 100);
          changeSvgIcon(true);
        })
        .catch((err) => console.log("Uh oh... unable to get stream...", err));
    }
    //pause button
    playAndbutton.innerHTML = ` <svg
      width="25"
      height="30"
      viewBox="0 0 9 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.52869 0.295654V12.429"
        stroke="#253858"
        stroke-width="2"
      />
      <path
        d="M7.46002 0.295654V12.429"
        stroke="#253858"
        stroke-width="2"
      />
    </svg>`;
  }
}
console.log();

playAndbutton.addEventListener("click", playAndpauseControlsinPopup);
stopButton.addEventListener("click", stopRecording);
ResetButton.addEventListener("click", restartRecording);
