let intervalIds = [];
let moodValue = 50;
let intervalId;
let originalLikes = [];
let randomLikes = [];
let innerHtmlLikes = [];
let specialLiker = '';
let averageUpLikeInterval = 10; // interval in seconds
let setIntervalDelay = 0.5; // delay in seconds

const setNumberOfLikes = (moodValue, specialLiker, setIntervalDelay, averageUpLikeInterval) => () => {
  chrome.storage.sync.get(["enabled"], function(result) {
    let enabled = result.enabled;
    let minMood = parseFloat(moodValue) / 2.0;
    let maxMood = parseFloat(moodValue) * 2.0;
    const moodGenerator = () => getRndInteger(minMood, maxMood);
    const likeSpans = getLikeSpans();
    originalLikes = updateOriginalLikes(likeSpans, originalLikes);
    const likeIncreaser = randomLikeIncrease(averageUpLikeInterval, setIntervalDelay);
    randomLikes = updateRandomLikes(randomLikes, originalLikes, moodGenerator, likeIncreaser);
    innerHtmlLikes = enabled ? randomLikes : originalLikes;
    likeSpans
      .map((span, i) => span.children[0].innerHTML = getInnerHtml(specialLiker, innerHtmlLikes[i]));
  })
};

const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min) + min);

const getLikeSpans = () => Array
  .from(document.getElementsByTagName('span'))
  .filter((span) => span.className === "_4arz");

const updateOriginalLikes = (likeSpans, originalLikes) => likeSpans.map(
  (span, i) => i < originalLikes.length ? originalLikes[i] : getNumberOfLikes(span.children[0].innerHTML)
);

const randomLikeIncrease = (averageUpLikeInterval, setIntervalDelay) => (likeCount) =>
  likeCount + +(Math.random() < 1 / averageUpLikeInterval * setIntervalDelay);

const updateRandomLikes = (randomLikes, originalLikes, moodGenerator, randomLikeIncrease) => originalLikes.map(
  (originalLike, i) => i < randomLikes.length ?
                       randomLikeIncrease(randomLikes[i]) :
                       originalLike*moodGenerator()
);

const getInnerHtml = (name, likeCount) => name ? `${name} and ${likeCount} others` : likeCount;

const getNumberOfLikes = (originalString) => originalString.match(/\d+/) ? parseInt(originalString.match(/\d+/)[0]) + 2 : 1;

const isProfilePage = (title, profileName) => title && title.toLowerCase().includes(profileName.toLowerCase());

const getProfileName = () => document.getElementsByClassName('_1vp5') ? document.getElementsByClassName('_1vp5')[0].innerHTML : '';

const clearIntervalIds = (intervalIds) => {
  intervalIds.map((intervalId) => window.clearInterval(intervalId));
  return []
};

const setIntervals = (moodValue, specialLiker, setIntervalDelay, averageUpLikeInterval) =>
  window.setInterval(
    setNumberOfLikes(moodValue, specialLiker, setIntervalDelay, averageUpLikeInterval),
    setIntervalDelay*1000,
  );

chrome.runtime.onMessage.addListener(function (message) {
  if (message.title) {
    const title = message.title;
    const profileName = getProfileName();
    if (isProfilePage(title, profileName)) {
      chrome.storage.sync.get(['moodValue', 'specialLiker', 'averageUpLikeInterval'], function(result) {
        moodValue = result.moodValue || moodValue;
        specialLiker = result.specialLiker || specialLiker;
        averageUpLikeInterval = result.averageUpLikeInterval || averageUpLikeInterval;
        intervalId = setIntervals(moodValue, specialLiker, setIntervalDelay, averageUpLikeInterval);
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
    intervalId = setIntervals(moodValue, specialLiker, setIntervalDelay, averageUpLikeInterval);
    intervalIds.push(intervalId);
  }
  if (message.specialLiker) {
    console.log('update setInterval with new liker', message.specialLiker);
    specialLiker = message.specialLiker;
    intervalIds = clearIntervalIds(intervalIds);
    intervalId = setIntervals(moodValue, specialLiker, setIntervalDelay, averageUpLikeInterval);
    intervalIds.push(intervalId)
  }
  if (message.averageUpLikeInterval) {
    console.log('update setInterval with new interval', message.averageUpLikeInterval);
    averageUpLikeInterval = message.averageUpLikeInterval;
    intervalIds = clearIntervalIds(intervalIds);
    intervalId = setIntervals(moodValue, specialLiker, setIntervalDelay, averageUpLikeInterval);
    intervalIds.push(intervalId)
  }
});
