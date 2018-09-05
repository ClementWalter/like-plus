let intervalIds = [];
let moodValue = 50;
let intervalId;
let originalLikes = [];
let randomLikes = [];
let specialLiker = '';

const setNumberOfLikes = (moodValue, specialLiker) => () => {
  let minMood = parseFloat(moodValue) / 2.0;
  let maxMood = parseFloat(moodValue) * 2.0;
  const moodGenerator = () => getRndInteger(minMood, maxMood);
  const likeSpans = getLikeSpans();
  originalLikes = updateOriginalLikes(likeSpans, originalLikes);
  randomLikes = updateRandomLikes(randomLikes, originalLikes, moodGenerator);
  likeSpans
    .map((span, i) => span.children[0].innerHTML = getInnerHtml(specialLiker, randomLikes[i]));
};

const getLikeSpans = () => Array
  .from(document.getElementsByTagName('span'))
  .filter((span) => span.className === "_4arz");

const updateOriginalLikes = (likeSpans, originalLikes) => likeSpans.map(
  (span, i) => i < originalLikes.length ? originalLikes[i] : getNumberOfLikes(span.children[0].innerHTML)
);

const updateRandomLikes = (randomLikes, originalLikes, moodGenerator) => originalLikes.map(
  (originalLike, i) => i < randomLikes.length ? randomLikes[i] : originalLike*moodGenerator()
);

const getInnerHtml = (name, likeCount) => name ? `${name} and ${likeCount} others` : likeCount;

const getNumberOfLikes = (originalString) => originalString.match(/\d+/) ? parseInt(originalString.match(/\d+/)[0]) + 2 : 1;

const isProfilePage = (title, profileName) => title && title.toLowerCase().includes(profileName.toLowerCase());

const getProfileName = () => document.getElementsByClassName('_1vp5') ? document.getElementsByClassName('_1vp5')[0].innerHTML : '';

const clearIntervalIds = (intervalIds) => {
  intervalIds.map((intervalId) => window.clearInterval(intervalId));
  return []
};

chrome.runtime.onMessage.addListener(function (message) {
  if (message.title) {
    const title = message.title;
    const profileName = getProfileName();
    if (isProfilePage(title, profileName)) {
      chrome.storage.sync.get(['moodValue', 'specialLiker'], function(result) {
        moodValue = result.moodValue || moodValue;
        specialLiker = result.specialLiker || specialLiker;
        intervalId = window.setInterval(setNumberOfLikes(moodValue, specialLiker), 500);
        intervalIds.push(intervalId);
        console.log('So many friends around there');
            });
    } else {
      // Do not update likes on other pages
      intervalIds = clearIntervalIds(intervalIds)
    }
  }
  if (message.moodValue) {
    console.log('update setInterval with new mood', message.moodValue);
    moodValue = 101 - message.moodValue;
    intervalIds = clearIntervalIds(intervalIds);
    randomLikes = [];
    intervalId = window.setInterval(setNumberOfLikes(moodValue, specialLiker), 500);
    intervalIds.push(intervalId);
  }
  if (message.specialLiker) {
    console.log('update setInterval with new liker', message.specialLiker);
    specialLiker = message.specialLiker;
    intervalIds = clearIntervalIds(intervalIds);
    intervalId = window.setInterval(setNumberOfLikes(moodValue, specialLiker), 500);
    intervalIds.push(intervalId)
  }
});
