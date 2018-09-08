let facebookTabIds = [];
let moodValue = 50;
let specialLiker = '';
let averageUpLikeInterval = 10;

function updateMood(event) {
  moodValue = event.target.value;
  chrome.storage.sync.set({moodValue}, function() {
    console.log('MoodValue set to ' + moodValue);
    facebookTabIds.map((tabId) => chrome.tabs.sendMessage(tabId, {moodValue}));
  });
}

function updateSpecialLiker(event) {
  specialLiker = event.target.value;
  chrome.storage.sync.set({specialLiker}, function() {
    console.log('Special Liker set to ' + specialLiker);
    facebookTabIds.map((tabId) => chrome.tabs.sendMessage(tabId, {specialLiker}));
  });
}

function updateAverageUplikeInterval(event) {
  averageUpLikeInterval = event.target.value;
  chrome.storage.sync.set({averageUpLikeInterval}, function() {
    console.log('Average uplike interval set to ' + averageUpLikeInterval);
    facebookTabIds.map((tabId) => chrome.tabs.sendMessage(tabId, {averageUpLikeInterval}));
  });
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector('input[name="mood"]').onchange = updateMood;
  document.querySelector('input[name="special-liker"]').onchange = updateSpecialLiker;
  document.querySelector('input[name="average-uplike-interval"]').onchange = updateAverageUplikeInterval;
  chrome.storage.sync.get(['moodValue', 'facebookTabIds', 'specialLiker', 'averageUpLikeInterval'], function(result) {
    console.log('result', result);
    facebookTabIds = result.facebookTabIds || facebookTabIds;
    moodValue = result.moodValue || moodValue;
    specialLiker = result.specialLiker || specialLiker;
    averageUpLikeInterval = result.averageUpLikeInterval || averageUpLikeInterval;
    document.querySelector('input[name="mood"]').value = moodValue;
    document.querySelector('input[name="special-liker"]').value = specialLiker;
    document.querySelector('input[name="average-uplike-interval"]').value = averageUpLikeInterval;
  });
});
