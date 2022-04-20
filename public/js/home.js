var audio = document.getElementById(`home-audio-player`);
var audioSlider = document.getElementById(`home-audio-slider`);
var audioLength = document.getElementById(`home-audio-length`);
var speedNormal=document.getElementById(`speedNormal`);
var speedHalfmore=document.getElementById(`speedHalfmore`);
var speedDouble=document.getElementById(`speedDouble`);
var audiocurrentTime = null;
var isAudioPlaying = false;
var rAF;
var muteButton=document.getElementById(`home-audio-mute`);
var muteAudioBool=true;


////speed Changing events//////
const speed1=()=>{
  console.log("hum se panga nghi bhae");
  speedNormal.classList.add('selected-home');
  speedDouble.classList.remove('selected-home')
  speedHalfmore.classList.remove('selected-home');
  audio.playbackRate=1;
}
const speed15=()=>{
  console.log("hum se panga nghi bhae");
  speedNormal.classList.remove('selected-home');
  speedDouble.classList.remove('selected-home')
  speedHalfmore.classList.add('selected-home');
audio.playbackRate=1.5;
}
const speed2=()=>{
  console.log("hum se panga nghi bhae");
  speedNormal.classList.remove('selected-home');
  speedDouble.classList.add('selected-home')
  speedHalfmore.classList.remove('selected-home');
  audio.playbackRate=2;
}









// getting fixed content//////////////////////
const getAudioifTitleisTooLong = (audioAttachment) => {
  return audioAttachment.title.substring(0, 10) + "...";
};

const getAudioTitle = (audioAttachment) => {
  if (audioAttachment.title.length > 12)
    return getAudioifTitleisTooLong(audioAttachment);
  else return audioAttachment.title;
};

const getAvatarUrl = (audioAttachment) => {
  return (
    audioAttachment._links.base +
    audioAttachment.history.createdBy.profilePicture.path.substring(5)
  );
};

const getAudioUrl = (audioAttachment) => {
  return audioAttachment._links.base + audioAttachment._links.download;
};

const getAllAudioDetails = (audioAttachment) => {
  const audioTitle = getAudioTitle(audioAttachment);
  const audioUrl = getAudioUrl(audioAttachment);
  const avatarPicUrl = getAvatarUrl(audioAttachment);

  return { audioTitle, audioUrl, avatarPicUrl };
};
const showAudioSliderProgress = (rangeInput) => {
  // audioContainer.style.setProperty(
  //   "--seek-before-width",
  //   (rangeInput.value / rangeInput.max) * 100 + "%"
  // );
};
const setAllEventListeners = () => {
  const inputListener = audioSlider.addEventListener("input", (e) => {
    audio.currentTime = audioSlider.value;
    audioLength.textContent = calculateTotalAudioLengthinMinutes(
      audioSlider.value
    );
    showAudioSliderProgress(e.target);
  });

  const changeListener = audioSlider.addEventListener("change", () => {
    audio.currentTime = audioSlider.value;
    audioLength.textContent = calculateTotalAudioLengthinMinutes(
      audioSlider.value
    );
    showAudioSliderProgress(audioSlider);
  });

  const timeupdateListener = audio.addEventListener("timeupdate", () => {
    audioSlider.value = Math.floor(audio.currentTime);
    audioLength.textContent = calculateTotalAudioLengthinMinutes(
      audioSlider.value
    );
    showAudioSliderProgress(audioSlider);
  });
};

const setIsAudioPlaying = (is_playing) => {
  isAudioPlaying = is_playing;
};
const whilePlayingAudioRecording = () => {
  audioSlider.value = Math.floor(audio.currentTime);
  rAF = requestAnimationFrame(whilePlayingAudioRecording);
};

const playAndpauseControls = async () => {
  
  if (!isAudioPlaying) {
    setIsAudioPlaying(true);
    changeStylesForPlayAndPauseButton(isAudioPlaying);
    setAllEventListeners();
    requestAnimationFrame(whilePlayingAudioRecording);
    await audio.play();
  } else {
    setIsAudioPlaying(false);
    changeStylesForPlayAndPauseButton(isAudioPlaying);
    cancelAnimationFrame(rAF);
    await audio.pause();
  }
};


const changeStylesForPlayAndPauseButton = (
  isAudioPlaying
) => {
  let playButton = document.getElementById(`home-play-pause-button`);
    if (isAudioPlaying) {
      playButton.innerHTML = playButtonSVG();
    } else {
      playButton.innerHTML = pauseButtonSVG();
    }
};

//mute button
const setmuteaudio=()=>{
  console.log("hello");
  if(muteAudioBool){
    audio.muted=true;
    muteAudioBool=false;
    muteButton.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 24 24"><path d="M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm15.324 4.993l1.646-1.659-1.324-1.324-1.651 1.67-1.665-1.648-1.316 1.318 1.67 1.657-1.65 1.669 1.318 1.317 1.658-1.672 1.666 1.653 1.324-1.325-1.676-1.656z"/></svg>`;
  }
  else{
audio.muted=false;
muteAudioBool=true;
muteButton.innerHTML=` <svg
          width="18"
          height="13"
          viewBox="0 0 23 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.653498 14.1518H5.39075L12.2843 17.7897C12.3823 17.8233 12.4803 17.8571 12.5783 17.8571C12.7089 17.8571 12.8071 17.8235 12.9051 17.7561C13.1011 17.6214 13.2319 17.4191 13.2319 17.1835V0.678226C13.2319 0.442323 13.1014 0.24026 12.9051 0.105626C12.7092 -0.0290084 12.4803 -0.0290077 12.2518 0.0720273L5.39085 3.70949H0.653364C0.29397 3.70949 0 4.0126 0 4.38312V13.4778C0 13.8486 0.261398 14.1517 0.653364 14.1517L0.653498 14.1518ZM11.8924 16.0716L6.01156 12.9727L6.01179 4.88851L11.8926 1.78957L11.8924 16.0716ZM1.30692 5.05693H4.73744V12.8043L1.30692 12.804V5.05693Z"
            fill="#253858"
          ></path>
          <path
            d="M15.4856 11.6253V12.9725C17.4785 12.9725 19.0795 11.3219 19.0795 9.26714C19.0795 7.21235 17.4786 5.56177 15.4856 5.56177V6.90901C16.7598 6.90901 17.7725 7.95316 17.7725 9.26684C17.7725 10.581 16.7598 11.6252 15.4856 11.6252V11.6253Z"
            fill="#253858"
          ></path>
          <path
            d="M15.4856 1.52051V2.86775C18.9161 2.86775 21.6931 5.73103 21.6931 9.26774C21.6931 12.8046 18.9159 15.6677 15.4856 15.6677V17.015C19.6349 17.015 22.9999 13.5455 22.9999 9.26762C22.9999 4.99016 19.6348 1.52087 15.4856 1.52087V1.52051Z"
            fill="#253858"
          ></path>
        </svg>`;
  }
}

/////////fixed content end///////////
const pauseButtonSVG = () => {
  return `
    <svg
      width="10"
      height="15"
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
    `;
};

const playButtonSVG = () => {
  return `
  <svg
  width="10"
  height="15"
  viewBox="0 0 9 14"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M1.92383 1.9624V12.3486"
    stroke="#253858"
    stroke-width="2.41236"
    stroke-linecap="square"
  ></path>
  <path
    d="M6.99927 1.9624V12.3486"
    stroke="#253858"
    stroke-width="2.41236"
    stroke-linecap="square"
  ></path>
</svg>
    `;
};
//implementation of audio player///////////////////

const setAudioDurationAndSliderMaxValue = () => {
  const audio = document.getElementById(`home-audio-player`);

  if (audio.readyState > 0) {
    setTotalAudioLength(audio);
    setAudioSliderMaxValue(audio);
    // displayBufferedAmount();
  } else {
    audio.addEventListener("loadedmetadata", (e) => {
      setTotalAudioLength(audio);
      setAudioSliderMaxValue(audio);
      // displayBufferedAmount();
    });
  }
};

const calculateTotalAudioLengthinMinutes = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

const setTotalAudioLength = (audio) => {
  let audioLengthContainer = document.getElementById(`home-audio-length`);
  const totalaudioLength = calculateTotalAudioLengthinMinutes(audio.duration);
  audioLengthContainer.innerHTML = totalaudioLength;
};

const setAudioSliderMaxValue = (audio) => {
  let totalaudioLength, audioSliderContainer;

  const getAllHtmlTags = () => {
    audioSliderContainer = document.getElementById(`home-audio-slider`);
    totalaudioLength = Math.floor(audio.duration);
  };

  getAllHtmlTags();

  audioSliderContainer.val = 0;
  audioSliderContainer.max = totalaudioLength;
};

// implementation done/////////

//STARTING POINT
AP.confluence.getMacroData(function (data) {
  console.log("macro id ", data.macroId);
  const macroId = data.macroId.substring(3);
  AP.request({
    url: `/rest/api/content/${macroId}`,
    type: "GET",
    success: function (responseText) {
      const audioAttachment = JSON.parse(responseText);
      console.log(audioAttachment);

      const { audioTitle, audioUrl, avatarPicUrl } =
        getAllAudioDetails(audioAttachment);
      console.log("title:", audioTitle);
      console.log("audio:", audioUrl);
      console.log("avatar:", avatarPicUrl);

      const htmlTagForTitle = document.getElementById("final-audio-title");
      const htmlTagForAvatar = document.getElementById("final-avatar-image");
      const htmlTagForAudio = document.getElementById(`home-audio-player`);
      htmlTagForTitle.innerHTML = `${audioTitle}`;
      htmlTagForAvatar.setAttribute("src", avatarPicUrl);
      htmlTagForAudio.setAttribute("src",audioUrl);
      setAudioDurationAndSliderMaxValue();
    },
    error: function (xhr, statusText, errorThrown) {
      console.log("error", arguments);
    },
  });
});


