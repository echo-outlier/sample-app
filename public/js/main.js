// For disabling all console logs in Production

// console.log = () => {};

// Global Variable Declaration
var popupWindowParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100`;
var popupWindowRef = null;
var pageId;
const audioFiles = [];
var audio = null;
var selectedAudio = null;
var audioContainer = null;
var audioSlider = null;
var audioLength = null;
var audiocurrentTime = null;
var isAudioPlaying = false;
var id = null;
var rAF;

var audioFile;
var audioTitle;
// ************************  Utils.js  ************************ //

const calculateTotalAudioLengthinMinutes = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

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

const nameWithDots = (name, firstNameLength) => {
  return name.substring(0, firstNameLength - 3) + "...";
};

const getDisplayName = (audioAttachment) => {
  const name = audioAttachment.history.createdBy.displayName;
  const firstNameLength = name.indexOf(" ");

  if (firstNameLength > 9) return nameWithDots(name, firstNameLength);
  else return name.substring(0, firstNameLength);
};

const getAudioUrl = (audioAttachment) => {
  return audioAttachment._links.base + audioAttachment._links.download;
};

const getAudioDate = (audioAttachment) => {
  const dateAndTime = audioAttachment.history.createdDate;
  const index = dateAndTime.indexOf("T");
  const date = dateAndTime.substr(0, index);
  date.replace("-", "/");
  return date;
};

const getAllAudioDetails = (audioAttachment) => {
  const audioTitle = getAudioTitle(audioAttachment);
  const audioUrl = getAudioUrl(audioAttachment);
  const avatarPicUrl = getAvatarUrl(audioAttachment);
  const displayName = getDisplayName(audioAttachment);
  const audioDate = getAudioDate(audioAttachment);

  return { audioTitle, audioUrl, avatarPicUrl, displayName, audioDate };
};

const searchAndFilterAudioRecordings = () => {
  let i,
    searchText,
    searchTextFiltered,
    audioContainer,
    audioTitleValue,
    audioTitleContainer;

  searchText = document.getElementById("text-input");
  searchTextFiltered = searchText.value.toUpperCase();
  searchTextFiltered = searchTextFiltered.replace(/\s+/g, "");

  for (i = 0; i < audioFiles.length; i++) {
    audioContainer = document.getElementById(audioFiles[i]);
    audioTitleContainer = document.getElementById(audioFiles[i] + "title");
    audioTitleValue =
      audioTitleContainer.textContent || audioTitleContainer.innerText;
    audioTitleValue = audioTitleValue.replace(/\s+/g, "");

    if (audioTitleValue.toUpperCase().indexOf(searchTextFiltered) > -1) {
      audioContainer.style.display = "";
    } else {
      audioContainer.style.display = "none";
    }
  }
};

const FetchHtmlContentWhenAudioFilesPresent = (id, audioAttachment) => {
  const { audioTitle, audioUrl, avatarPicUrl, displayName, audioDate } =
    getAllAudioDetails(audioAttachment);

  return `<div class="sub-container-2" id="${id}"  onclick=selectAudioControls("${id}")>
            <div class="sub-inside-container" id="insideContainer-${id}">
              <div class="play-button" id="play-button-${id}" onclick=playAndpauseControls("${id}")>
                <svg
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
              </div>
       
              <div class="title-date">
                <div class="title" id="${id}title">${audioTitle}</div>
                <div class="rec-by-date">
                  <div class="rec-by">
                    <div class="avatar"></div>
                    <div class="name">by ${displayName}</div>
                  </div>
                  <div>
                  <svg
                       width="4"
                       height="5"
                       viewBox="0 0 4 5"
                       fill="none"
                       xmlns="http://www.w3.org/2000/svg"
                     >
                       <circle cx="2" cy="2.35944" r="2" fill="#172B4D"></circle>
                     </svg>
                  </div>
                  <div class="date">${audioDate}</div>
                </div>
              </div>

              <div class="audio-container" id="audio-container-${id}">
                <audio id="audio-${id}" src="${audioUrl}" preload="metadata"></audio>
                <span>
                  <input type="range" min="0" max="100" value="0" class="audio-slider" id="audio-slider-${id}"></input>
                </span>
                <div id="audio-current-time-${id}" class="audio-current-time">00:00</div>
              </div>
              <div class="audio-length" id="audio-length-${id}">
                00:00
              </div>
            </div>
          </div>`;
};

const FetchHtmlContentWhenNoAudioFilesPresent = () => {
  return `<div class="no-audio-container">
          <div class="image">
            <img src="images/no-recordings.png" alt="" />
          </div>
          <div class="flex">
          <div class="heading">
            No recording yet!
          </div>
          <div class="subheading">click on <b>"start recording"</b> button to get started</div>
        </div>`;
};

const pauseButtonSVG = () => {
  return `
    <svg
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
    `;
};

const playButtonSVG = () => {
  return `
    <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2.35944V13.8876" stroke="white" stroke-width="2.74932" stroke-linecap="square"/>
    <path d="M8.97656 2.35944V13.8876" stroke="white" stroke-width="2.74932" stroke-linecap="square"/>
    </svg>
    `;
};

// ************************  End of Utils.js  ************************ //

// ************************  Main.js  ************************ //

AP.navigator.getLocation(async function (location) {
  pageId = getPageId(location);

  await fetchAllAttachments();
});

const getPageId = (location) => {
  return location.context.contentId;
};

const fetchAllAttachments = async () => {
  await AP.request({
    url: `/rest/api/content/${pageId}/child/attachment`,
    type: "GET",
    success: function (responseText) {
      const files = JSON.parse(responseText);
      console.log("successfully all attachment fetched", files);

      filterAllAudioRecording(files);

      console.log("all AudioFiles Lenght", audioFiles.length);

      whenNoAudioFilesPresent();

      whenAudioFilesPresent();
    },
    error: function (xhr, statusText, errorThrown) {
      console.log("error", arguments);
    },
  });
};

const filterAllAudioRecording = (files) => {
  files.results.forEach((att) => {
    if (att.metadata.mediaType.substring(0, 5) == "audio") {
      audioFiles.push(att.id);
    }
  });
};

const whenNoAudioFilesPresent = () => {
  if (!audioFiles.length) {
    console.log("inside");
    const container2 = document.getElementById("container-2");
    container2.innerHTML =
      container2.innerHTML + FetchHtmlContentWhenNoAudioFilesPresent();
  }
};

const whenAudioFilesPresent = async () => {
  audioFiles.forEach(async (id, key) => {
    const attId = id.substring(3);
    await AP.request({
      url: `/rest/api/content/${attId}`,
      type: "GET",
      success: function (responseText) {
        const audioAttachment = JSON.parse(responseText);
        console.log(audioAttachment);

        const AllAudioRecordingContainer = document.getElementById("all-audio");

        AllAudioRecordingContainer.innerHTML =
          AllAudioRecordingContainer.innerHTML +
          FetchHtmlContentWhenAudioFilesPresent(id, audioAttachment);

        setAudioDurationAndSliderMaxValue(id);
      },
      error: function (xhr, statusText, errorThrown) {
        console.log("error", arguments);
      },
    });
  });
};

const setAudioDurationAndSliderMaxValue = (id) => {
  const audio = document.getElementById(`audio-${id}`);

  if (audio.readyState > 0) {
    setTotalAudioLength(id, audio);
    setAudioSliderMaxValue(id, audio);
    // displayBufferedAmount();
  } else {
    audio.addEventListener("loadedmetadata", (e) => {
      setTotalAudioLength(id, audio);
      setAudioSliderMaxValue(id, audio);
      // displayBufferedAmount();
    });
  }
};

const setTotalAudioLength = (id, audio) => {
  let audioLengthContainer = document.getElementById(`audio-length-${id}`);
  const totalaudioLength = calculateTotalAudioLengthinMinutes(audio.duration);
  audioLengthContainer.innerHTML = totalaudioLength;
};

const setAudioSliderMaxValue = (id, audio) => {
  let totalaudioLength, audioSliderContainer;

  const getAllHtmlTags = () => {
    audioSliderContainer = document.getElementById(`audio-slider-${id}`);
    totalaudioLength = Math.floor(audio.duration);
  };

  getAllHtmlTags();

  audioSliderContainer.val = 0;
  audioSliderContainer.max = totalaudioLength;
};

const setAllEventListeners = () => {
  const inputListener = audioSlider.addEventListener("input", (e) => {
    audio.currentTime = audioSlider.value;
    audiocurrentTime.textContent = calculateTotalAudioLengthinMinutes(
      audioSlider.value
    );
    showAudioSliderProgress(e.target);
  });

  const changeListener = audioSlider.addEventListener("change", () => {
    audio.currentTime = audioSlider.value;
    audiocurrentTime.textContent = calculateTotalAudioLengthinMinutes(
      audioSlider.value
    );
    showAudioSliderProgress(audioSlider);
  });

  const timeupdateListener = audio.addEventListener("timeupdate", () => {
    audioSlider.value = Math.floor(audio.currentTime);
    audiocurrentTime.textContent = calculateTotalAudioLengthinMinutes(
      audioSlider.value
    );
    showAudioSliderProgress(audioSlider);
  });
};

const showAudioSliderProgress = (rangeInput) => {
  audioContainer.style.setProperty(
    "--seek-before-width",
    (rangeInput.value / rangeInput.max) * 100 + "%"
  );
};
const setSelectedAudioContainerBackgroundColor = (audio_id) => {
  if (id != null) {
    let DeselectAudioComponent = document.getElementById(
      `insideContainer-${id}`
    );
    DeselectAudioComponent.style.background = "white";
  }
  let selectedAudioComponent = document.getElementById(
    `insideContainer-${audio_id}`
  );
  console.log(selectedAudioComponent);
  selectedAudioComponent.style.background = "#cce0ff";
  console.log("hurray");
};

const playAndpauseControls = async (audio_id) => {
  console.log("id", audio_id);
  AP.flag.create({
    title: "Successfully created a flag.",
    body: "This is a flag.",
    type: "error",
  });
  await CheckifPreviousTrackPlaying(audio_id);
  setSelectedAudioContainerBackgroundColor(audio_id);
  setAllCurrentAudioReferences(audio_id);

  if (!isAudioPlaying) {
    setIsAudioPlaying(true);
    changeStylesForPlayAndPauseButton(false, audio_id, isAudioPlaying);
    setAllEventListeners();
    requestAnimationFrame(whilePlayingAudioRecording);
    await audio.play();
  } else {
    setIsAudioPlaying(false);
    changeStylesForPlayAndPauseButton(false, audio_id, isAudioPlaying);
    cancelAnimationFrame(rAF);
    await audio.pause();
  }
};
const selectAudioControls = async (audio_id) => {
  console.log("id", audio_id);
  AP.flag.create({
    title: "Successfully created a flag.",
    body: "This is a flag.",
    type: "error",
  });
  await CheckifPreviousTrackPlaying(audio_id);
  setSelectedAudioContainerBackgroundColor(audio_id);
  setAllCurrentAudioReferences(audio_id);
};

const CheckifPreviousTrackPlaying = async (audio_id) => {
  if (id != null && id != audio_id) {
    setIsAudioPlaying(false);
    console.log("pause previous track");
    changeStylesForPlayAndPauseButton(true, audio_id, isAudioPlaying);
    cancelAnimationFrame(rAF);
    await audio.pause();
  }
};

const setAllCurrentAudioReferences = (audio_id) => {
  id = audio_id;
  audio = document.getElementById(`audio-${id}`);
  playButton = document.getElementById(`play-button-${id}`);
  audioSlider = document.getElementById(`audio-slider-${id}`);
  audioContainer = document.getElementById(`audio-container-${id}`);
  audioLength = document.getElementById(`audio-length-${id}`);
  audiocurrentTime = document.getElementById(`audio-current-time-${id}`);
};

const setIsAudioPlaying = (is_playing) => {
  isAudioPlaying = is_playing;
};

const changeStylesForPlayAndPauseButton = (
  isPreviousTrackPlaying,
  audio_id,
  isAudioPlaying
) => {
  let playButton = document.getElementById(`play-button-${audio_id}`);

  if (isPreviousTrackPlaying) {
    audioContainer.style.opacity = 0;
    const previousPlayButton = document.getElementById(`play-button-${id}`);
    previousPlayButton.innerHTML = pauseButtonSVG();
    previousPlayButton.style.background = "var(--gray)";
  } else {
    if (isAudioPlaying) {
      playButton.innerHTML = playButtonSVG();
      playButton.style.background = "var(--primary-color)";
      audioContainer.style.opacity = 1;
    } else {
      playButton.innerHTML = pauseButtonSVG();
      playButton.style.background = "var(--gray)";
      audioContainer.style.opacity = 0;
    }
  }
};

const whilePlayingAudioRecording = () => {
  audioSlider.value = Math.floor(audio.currentTime);
  rAF = requestAnimationFrame(whilePlayingAudioRecording);
};

// Code for triggering Insert button
AP.dialog.getButton("submit").bind(function () {
  AP.confluence.saveMacro({
    macroId: id,
  });
  AP.confluence.closeMacroEditor();
  return true;
});

// Popup Window

const openPopupWindowForRecording = () => {
  const w=350;
  const h=400;
  const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  popupWindowRef = window.open("./popup.html", "popup",   `
  scrollbars=yes,
  width=${w / systemZoom}, 
  height=${h / systemZoom}, 
  top=${top}, 
  left=${left}
  `);
};

function saveAndUploadRecording() {
  AP.navigator.getLocation(function (location) {
    content_id = location.context.contentId;

    console.log("data", audioFile, audioTitle);
    AP.request({
      url: `/rest/api/content/${content_id}/child/attachment`,
      type: "POST",
      contentType: "multipart/form-data",
      data: { file: audioFile, minorEdit: true },
      success: function (responseText) {
        const audio_files = JSON.parse(responseText);
        console.log("success", audio_files);
      
        const postattid = audio_files.results[0].id;
        console.log(postattid)

        AP.confluence.saveMacro({
          macroId: postattid,
        });
        popupWindowRef.close();
        AP.confluence.closeMacroEditor();
      },
      error: function (xhr, statusText, errorThrown) {
        console.log("some error is there");
        popupWindowRef.close();
        AP.confluence.closeMacroEditor();
        console.log(arguments);
      },
    });
  });
}
