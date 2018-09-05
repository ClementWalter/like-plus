let intervalIds = [];
let moodValue = 50;
let intervalId;
let originalLikes = [];
let randomLikes = [];

const setNumberOfLikes = (moodValue) => () => {
  const htmlSpans = document.getElementsByTagName('span');
  const arraySpans = Array.from(htmlSpans);
  const filteredSpans = arraySpans
    .filter((span) => span.className === "_4arz");
  if (randomLikes.length < filteredSpans.length) {
    let minMood = parseFloat(moodValue) / 2.0;
    let maxMood = parseFloat(moodValue) * 2.0;
    const newOriginalLikes = filteredSpans
        .filter((span, i) => i >= originalLikes.length)
        .map((span) => getNumberOfLikes(span.children[0].innerHTML));
    originalLikes = [...originalLikes, ...newOriginalLikes];
    randomLikes = originalLikes.map(
      (originalLike, i) => i < randomLikes.length ? randomLikes[i] : originalLike*getRndInteger(minMood, maxMood)
    );
    filteredSpans
      .map((span, i) => span.children[0].innerHTML = randomLikes[i]);
  }
};

const getNumberOfLikes = (originalString) => originalString.match(/\d+/) ? parseInt(originalString.match(/\d+/)[0]) + 2 : 1;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'facebook') {
    const profileSpan = document.getElementsByClassName('_1vp5')[0];
    const profileName = profileSpan.innerHTML;
    const title = msg.title;
    if (title && title.toLowerCase().includes(profileName.toLowerCase())) {
      intervalId = window.setInterval(setNumberOfLikes(moodValue), 500);
      intervalIds.push(intervalId);
      console.log('So many friends around there');
    } else {
      intervalIds.map((intervalId) => window.clearInterval(intervalId))
    }
  }
  if (msg.text === 'mood') {
    moodValue = 101 - msg.moodValue;
    intervalIds.map((intervalId) => window.clearInterval(intervalId));
    randomLikes = [];
    intervalId = window.setInterval(setNumberOfLikes(moodValue), 500);
    intervalIds.push(intervalId)
  }
});
