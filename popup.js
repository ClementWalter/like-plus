let facebookTabIds = [];
let moodValue = 50;
let specialLiker = '';

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

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector('input[name="mood"]').onchange = updateMood;
  document.querySelector('input[name="special-liker"]').onchange = updateSpecialLiker;
  chrome.storage.sync.get(['moodValue', 'facebookTabIds', 'specialLiker'], function(result) {
    console.log('result', result);
    facebookTabIds = result.facebookTabIds || facebookTabIds;
    moodValue = result.moodValue || moodValue;
    specialLiker = result.specialLiker || specialLiker;
    document.querySelector('input[name="mood"]').value = moodValue;
    document.querySelector('input[name="special-liker"]').value = specialLiker;
  });
});
